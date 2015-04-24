---
layout: post
title: "AWS Machine Learning Overview"
tags:
    - python
    - notebook
---
In the last blog post I showed you how to [slice and dice a data
set](http://www.valentinmihov.com/2015/04/17/adult-income-data-set/) describing
individual people and trying to predict if they make more than $50,000 annually.
We used [ipython](http://ipython.org/) and a bunch of libraries to do the
analysis, build a prediction model and evaluate its performance against the
data. This requires having knowledge about how to use all these python libraries
and what exactly to do with the data (although you can use the ipython notebook
from that blog post as a general framework to analyze any data set). It also
requires installing all these libraries on your system, which can be non-
trivial.

Recently Amazon released a new AWS service called [Machine
Learning](http://aws.amazon.com/machine-learning/). It provides a simplified and
easily scalable way to build machine learning models over arbitrary data sets.
In this blog post I will make an overview of this service and compare its
results with the ones we obtained using ipython on the same dataset we used the
last time.

## Import the data set into AWS

In order to import the data set into the Amazon's service you need to upload it
on S3. I uploaded [the adult](https://archive.ics.uci.edu/ml/machine-learning-
databases/adult/adult.data) data set, which I used previously, on S3 without
making any modification on it. After the import was ready it is possible to view
the distribution of the target values:

**In [1]:**

{% highlight python %}
from IPython.display import Image 
Image("aws_target_stats.png")
{% endhighlight %}




![png](/notebooks/aws-machine-learning-overview_files/aws-machine-learning-overview_2_0.png)



It also allows you to view the distribution of the values for the numerical and
categorical variables. It is very similar to what we did [last
time](http://www.valentinmihov.com/2015/04/17/adult-income-data-set/#analyze-
the-data).

**In [2]:**

{% highlight python %}
Image("aws_martial_status_stats.png")
{% endhighlight %}




![png](/notebooks/aws-machine-learning-overview_files/aws-machine-learning-overview_4_0.png)



**In [3]:**

{% highlight python %}
Image("aws_age_stats.png")
{% endhighlight %}




![png](/notebooks/aws-machine-learning-overview_files/aws-machine-learning-overview_5_0.png)



In the above screenshot you can see that the distribution of the first variable
in the dataset, which is `Age`, looks very similarly to what we saw in our
ipython analysis.

## Building a model

After we looked in the data we can try to build a model, which will predict the
target value. In this case it is a classification model with 2 possible classes
(under or equal to \$50k/year and over \$50k/year).

After building the model we see that AWS have split our data into two and used
70% of the data to build a model and remaining 30% to test the model. This is a
standard approach when building a machine learning model, which prevents extreme
overfitting of your model.

We also see that the AWS UI provides a confusion matrix of the model and F1
scores for each of the classes.

**In [4]:**

{% highlight python %}
Image("aws_confusion_matrix.png")
{% endhighlight %}




![png](/notebooks/aws-machine-learning-overview_files/aws-machine-learning-overview_8_0.png)



As you can see the [F1 score](http://en.wikipedia.org/wiki/F1_score) of the
positive target, which in this case is `>50K` is 0.69. This is slightly better
than the result we got in our ipython analysis using [dummy
variables](http://en.wikipedia.org/wiki/Dummy_variable_%28statistics%29) which
was 0.65. This means that the machine learning model was smart enough to make
this optimization in the data. Pretty cool!

## Missing data

One thing that can be noticed while browsing the data in the AWS UI is that
there is no missing data detected in the dataset, which is not correct. There is
a bunch of instances with missing values, that are marked with `?`. AWS was not
able to recognize these as missing values. Interestingly even after replacing
the `?` with just empty strings AWS didn't recognize the values as missing.
After digging into the documentation it turns out that [missing values are
supported only for numerical data](http://docs.aws.amazon.com/machine-
learning/latest/dg/creating_datasources.html#missing-values). This is really
surprising as for categorical data this is important when building a dummy
variable transformation. For example if you have a `Gender` feature that gets
values `Male` and `Female` you will have 2 dummy variables `Gender_Male` and
`Gender_Female` taking value of 0 or 1. If you have a missing value for some
instance you should set both variables to 0. For example look how the
transformation should look like:

**In [5]:**

{% highlight python %}
import pandas as pd
pd.get_dummies(['Male', 'Female', np.nan])
{% endhighlight %}




<div style="max-height:1000px;max-width:1500px;overflow:auto;">
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Female</th>
      <th>Male</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td> 0</td>
      <td> 1</td>
    </tr>
    <tr>
      <th>1</th>
      <td> 1</td>
      <td> 0</td>
    </tr>
    <tr>
      <th>2</th>
      <td> 0</td>
      <td> 0</td>
    </tr>
  </tbody>
</table>
</div>



## Conclusion

Overall the AWS Machine Learning product looks great! We were able to load data,
build and evaluate a [Logistic
Regression](http://en.wikipedia.org/wiki/Logistic_regression) model just using
the web UI. The results were awesome and comparable to the results we got using
ipython, but with much less effort from our side.

The downside of this product is the lack of machine learning algorithms. For
example it would have been really awesome to compare the results from the
logistic regression to a decision tree model, like
[C4.5](http://en.wikipedia.org/wiki/C4.5_algorithm). I am sure this is on the
TODO list of the team developing this product.

Another thing I noticed is that the loading/building/evaluation cycle is quite
slow. This is a problem, because usually when you work with data it is important
to receive immediate feedback. Very often you want to make a small tweak and see
how this affects your results. Doing this through the AWS UI will take you quite
a lot of time, as one iteration could take more than 10 mins. If you perform a
lot of experiments this time can pile up and impact your workflow significantly.

So if I need to summarize the pros and cons of AWS compared to the ipython
toolkit:

Pros:

* Very easy to use
* The results are comparable to a logistic regression with ipython, even
slightly better
* Easy data visualization of the distribution of the features
* Very easy to scale to large amounts of data
* Easier to integrate with your existing AWS deployments

Cons:

* Only logistic regression supported at the moment
* Lack of data analysis besides value distribution. Correlation would have been
nice
* Lack of support for missing values in categorical features
* Very slow feedback cycle when working with data and models
* Overall has the most simple tools for data analysis. Not really a substitute
for a full featured toolbox, like ipython
* Can't examine the built model and the weights of each feature, like we did in
the [Logistic regression with dummy
variables](http://www.valentinmihov.com/2015/04/17/adult-income-data-set
/#logistic-regression-with-dummy-variables)
