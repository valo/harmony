---
layout: post
title: Integrating custom SQL queries with ActiveRecord
comments: true
tags:
  - rails
  - activerecord
  - sql
---

I know that some people could start a flame war about what I will discussing right now, so let me first introduce you into the context of the problem.

Context of the problem
----------------------

One of the side projects I am working on right now is a grading system for high school programming problems. It is hosted on a low cost sharing hosting. A specific thing about this is that the database server is also shared and also is quite distant from the application server. This means that every query is adding an overhead of at least 20ms to the execution time (sometimes even 200ms), even if the query takes 0.1ms on the database server. Now imagine that you have an action which makes a linear number of queries depending on the number of the users in the system.

One other limitation is that the memory of the ruby VM is limited to something like 200MB. This means that loading a lot of ActiveRecord objects as a method for reducing the memory usage is not an option, because sooner or later the watchdog of the server will start to kill our ruby processes.

Some of you will say that hosting rails on a shared server is just not serious. My answer is that because we have a fairly low number of hits it is possible to use such hosting, you just have to make some tweaks.

The schema of the database
--------------------------

We have the following simplified schema:

{% highlight ruby %}
    class User < ActiveRecord::Base
      has_many :runs
      
      column :name, :string
    end
    
    class Problem < ActiveRecord::Base
      has_many :runs
      
      column :name
    end
    
    class Run < ActiveRecord::Base
      belongs_to :problem
      belongs_to :user
      
      column :total_points, :integer
    end
{% endhighlight %}
    
I am using a fictional column method to describe the attributes of each table.

What is the problem we want to solve?
-------------------------------------

We want to generate a ranklist of all users into the system. The ranklist is generated as following:

1. Total score: for every user we must compute the maximum score for every problem and sum the maximum scores for all the problems to compute the total score. For example: if there are problem A and problem B, and the user John has 2 submits for problem A with score 50 and score 60, we are going to take a maximum score 60 for problem A. If John has 3 runs for problem B with score 20, 60 and 100, we will take maximum score of 100 for problem B. Given that, John will have a total score of 60 + 100 = 160.

2. Problems solved for 100 points: we compute the number of problems for each user, which has a max score of 100 points. For example in the previous setup only problem B is counted, because the max score John has on it is 100, so John has only 1 problem solved for 100 points.

3. Total runs: for each user we count the number of runs for that user.

Solution 1
----------

It is very easy to solve the above problems using the ActiveRecord associations. Here is how they could be solved with code:

1. Total score:

{% highlight ruby %}
  User.all.map do |user|
    user.runs.group_by(&:problem) do |problem, runs|
      runs.map(&:total_points).max
    end.sum
  end
{% endhighlight %}
        
2. Problems solved for 100 points:

{% highlight ruby %}
  User.all.map do |user|
    user.runs.group_by(&:problem) do |problem, runs|
      runs.map(&:total_points).max == 100 ? 1 : 0
    end.sum
  end
{% endhighlight %}

3. Total runs:

{% highlight ruby %}
  Run.count(:all, :group => :user)
{% endhighlight %}

The problem with all these approaches is that they either issue a lot of queries or they load a lot of objects into the memory. Each of these problems makes our application useless in a shared hosting environment.

Solution 2
----------

Let's try to pack everything into one query and wrap it into ActiveRecord code. We want to compute everything into the database. Making the right indexes should make the things pretty fast.

Adding pure SQL into the code is ugly and I don't encourage that at all, but sometimes we have to get our hands dirty. Let's at least try to reduce the ugliness by wrapping this into the User module, so that it is neatly packed and easy to refactor.

The following query is computing all I described and also it gets some info about the users. We want to return an array of tuples, where there is a tuple for each user with the needed data and also his/her name. Here is the query:

{% highlight sql %}
    SELECT 
      users.id, 
      name, 
      SUM(max_points_per_problem) as score, 
      SUM(runs_per_problem) as runs_count,
      SUM(CASE max_points_per_problem WHEN 100 THEN 1 ELSE 0 END) as full_score
    FROM users
    LEFT JOIN
      (
        SELECT
          MAX(total_points) as max_points_per_problem,
          user_id,
          COUNT(runs.id) as runs_per_problem
        FROM runs
        JOIN problems ON problems.id = problem_id
        GROUP BY user_id, problem_id
      ) as problem_points
    ON problem_points.user_id = users.id
    GROUP BY users.id
    ORDER BY score DESC
{% endhighlight %}

Now the question is: how to integrate that into our rails code? Here is the answer: using select_all:

{% highlight ruby %}
    class User < ActiveRecord::Base
      class << self
        def generate_ranklist
          query = <THE_UGLY_THING_I_WROTE_A_FEW_LINES_UPWARDS>
          
          User.connection.select_all(query).inject([]) do |ranklist, row|
            ranklist << [
                          User.send(:instantiate, row), 
                          row['score'], 
                          row['runs_count'], 
                          row['full_solutions'], 
                          row['full_score']
                        ]
          end
        end
      end
    end
{% endhighlight %}
    
Conclusion
----------

Using the described method we were able to reduce significantly the number of queries we do, which reduced the execution time on the shared server from several seconds to under a second and we were also fitting into the memory limit, because we are loading only things we really need.

This is also going to help in larger projects running on dedicated servers. It is just a matter of time when scalability issues emerges for an web app. Optimizing the database queries is one of the most beneficial ways for optimization.

WARNING: I am not advocating in any way that you should custom craft all your queries. Most of the cases you don't have to do so! Most of the cases only several objects are loaded by the app and a few queries are issued. In the case I describe we are making some very complex aggregations across large amounts of data, which makes ActiveRecord magic very inefficient!
