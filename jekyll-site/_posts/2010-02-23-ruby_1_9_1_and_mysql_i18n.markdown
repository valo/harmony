---
layout: post
title: Running Ruby 1.9.1 + Rails + MySQL and unicode characters
comments: true
tags:
   - rails
   - ruby 1.9
   - mysql
---

If you have tried to develop some rails application on Rails + Ruby 1.9.1 and MySQL database and you are storing non-English characters in your database probably you had a lot of pain with errors about incompatible charsets. This is a known problem and there is even [a bug in Rails' lighthouse](https://rails.lighthouseapp.com/projects/8994/tickets/2476-ascii-8bit-encoding-of-query-results-in-rails-232-and-ruby-191) for it. There is even a hack which is going around the issue. The solution is not perfect, but it works in most of the cases.

The problem in a nutshell is that the MySQL Ruby lib is not respecting the encoding setting defined in the database.yml file and does not encode the strings, that are pulled from the database in that encoding. Here is an example database.yml, which defines the encoding of the database connection:

{% highlight yaml %}
    development:
      adapter: mysql
      database: gsm_dev
      username: root
      password: 
      encoding: utf8
{% endhighlight %}

Fortunately there is a nice solution I found: use the [ruby-mysql](http://github.com/tmtm/ruby-mysql "tmtm's ruby-mysql at 2.9 - GitHub") lib. It is on [gemcutter](http://gemcutter.org/ "RubyGems.org | your community gem host") so you can do:

{% highlight bash %}
    gem uninstall mysql && gem install ruby-mysql
{% endhighlight %}

This is going to uninstall the buggy mysql lib and install the working ruby-mysql. Hope that helps!

P.S.: I am not sure that this is a production-ready solution, but at least it provides a way to run things without hacks until the MySQL C API is fixed.
