---
layout: post
title: "Adult Income Data Set Anaysis"
tags:
    - python
    - notebook
---
In this blog post I will show you how to slice'n dice the data set from [Adult
Data Set MLR](https://archive.ics.uci.edu/ml/datasets/Adult) which contains
income data for about 32000 people. We will look at the data and build a machine
learning model, which tries to predict if a person will make more than $50K a
year, given data like education, gender and martial status.

Let's first import some libraries that we are going to need for our analysis

**In [1]:**

{% highlight python %}
import pandas as pd
import numpy as np
import statsmodels as sm
import sklearn as skl
import sklearn.preprocessing as preprocessing
import sklearn.linear_model as linear_model
import sklearn.cross_validation as cross_validation
import sklearn.metrics as metrics
import sklearn.tree as tree
import seaborn as sns
{% endhighlight %}

First we need to read the data from the file, which contains comma separated
columns. With the command below we will read the data skipping any spaces
before/after the commans and mark the values '?' as missing data points.

## Load the data

**In [2]:**

{% highlight python %}
original_data = pd.read_csv(
    "adult.data.txt",
    names=[
        "Age", "Workclass", "fnlwgt", "Education", "Education-Num", "Martial Status", "Occupation",
        "Relationship", "Race", "Sex", "Capital Gain", "Capital Loss", "Hours per week", "Country",
        "Target"],
        sep=r'\s*,\s*',
        engine='python',
        na_values="?")
original_data.tail()
{% endhighlight %}




<div style="max-height:1000px;max-width:1500px;overflow:auto;">
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Age</th>
      <th>Workclass</th>
      <th>fnlwgt</th>
      <th>Education</th>
      <th>Education-Num</th>
      <th>Martial Status</th>
      <th>Occupation</th>
      <th>Relationship</th>
      <th>Race</th>
      <th>Sex</th>
      <th>Capital Gain</th>
      <th>Capital Loss</th>
      <th>Hours per week</th>
      <th>Country</th>
      <th>Target</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>32556</th>
      <td> 27</td>
      <td>      Private</td>
      <td> 257302</td>
      <td> Assoc-acdm</td>
      <td> 12</td>
      <td> Married-civ-spouse</td>
      <td>      Tech-support</td>
      <td>      Wife</td>
      <td> White</td>
      <td> Female</td>
      <td>     0</td>
      <td> 0</td>
      <td> 38</td>
      <td> United-States</td>
      <td> &lt;=50K</td>
    </tr>
    <tr>
      <th>32557</th>
      <td> 40</td>
      <td>      Private</td>
      <td> 154374</td>
      <td>    HS-grad</td>
      <td>  9</td>
      <td> Married-civ-spouse</td>
      <td> Machine-op-inspct</td>
      <td>   Husband</td>
      <td> White</td>
      <td>   Male</td>
      <td>     0</td>
      <td> 0</td>
      <td> 40</td>
      <td> United-States</td>
      <td>  &gt;50K</td>
    </tr>
    <tr>
      <th>32558</th>
      <td> 58</td>
      <td>      Private</td>
      <td> 151910</td>
      <td>    HS-grad</td>
      <td>  9</td>
      <td>            Widowed</td>
      <td>      Adm-clerical</td>
      <td> Unmarried</td>
      <td> White</td>
      <td> Female</td>
      <td>     0</td>
      <td> 0</td>
      <td> 40</td>
      <td> United-States</td>
      <td> &lt;=50K</td>
    </tr>
    <tr>
      <th>32559</th>
      <td> 22</td>
      <td>      Private</td>
      <td> 201490</td>
      <td>    HS-grad</td>
      <td>  9</td>
      <td>      Never-married</td>
      <td>      Adm-clerical</td>
      <td> Own-child</td>
      <td> White</td>
      <td>   Male</td>
      <td>     0</td>
      <td> 0</td>
      <td> 20</td>
      <td> United-States</td>
      <td> &lt;=50K</td>
    </tr>
    <tr>
      <th>32560</th>
      <td> 52</td>
      <td> Self-emp-inc</td>
      <td> 287927</td>
      <td>    HS-grad</td>
      <td>  9</td>
      <td> Married-civ-spouse</td>
      <td>   Exec-managerial</td>
      <td>      Wife</td>
      <td> White</td>
      <td> Female</td>
      <td> 15024</td>
      <td> 0</td>
      <td> 40</td>
      <td> United-States</td>
      <td>  &gt;50K</td>
    </tr>
  </tbody>
</table>
</div>



## Analyze the data

Let's plot the distribution of each feature, so that we have a better
understanding what we have in our data. We draw the number of values for each
category feature and the histogram of the values for each continuous feature.

**In [3]:**

{% highlight python %}
fig = plt.figure(figsize=(20,15))
cols = 5
rows = ceil(float(original_data.shape[1]) / cols)
for i, column in enumerate(original_data.columns):
    ax = fig.add_subplot(rows, cols, i + 1)
    ax.set_title(column)
    if original_data.dtypes[column] == np.object:
        original_data[column].value_counts().plot(kind="bar", axes=ax)
    else:
        original_data[column].hist(axes=ax)
        plt.xticks(rotation="vertical")
plt.subplots_adjust(hspace=0.7, wspace=0.2)
{% endhighlight %}


![png](/notebooks/adult_income_data_set_files/adult_income_data_set_7_0.png)


As you can see from the plots above our data is mostly concentrated in the USA
with mostly male white people. This is a good thing to notice, as it may impact
the conclusions we come to later.

**In [4]:**

{% highlight python %}
(original_data["Country"].value_counts() / original_data.shape[0]).head()
{% endhighlight %}




    United-States    0.895857
    Mexico           0.019748
    Philippines      0.006081
    Germany          0.004207
    Canada           0.003716
    dtype: float64



Indeed! 89% of the samples are for people from the US. Mexico comes next
with less than 2%.

Now, let's explore something else. The correlation between the different
features. Generally it is not a good idea to have many correlated features, as
it might be a sign that your data is not very good. For this purpose
we will need to encode the categorical features as numbers. This can be done
using the `LabelEncoder` in the `scikit-learn` package.

**In [5]:**

{% highlight python %}
# Encode the categorical features as numbers
def number_encode_features(df):
    result = df.copy()
    encoders = {}
    for column in result.columns:
        if result.dtypes[column] == np.object:
            encoders[column] = preprocessing.LabelEncoder()
            result[column] = encoders[column].fit_transform(result[column])
    return result, encoders

# Calculate the correlation and plot it
encoded_data, _ = number_encode_features(original_data)
sns.heatmap(encoded_data.corr(), square=True)
plt.show()
{% endhighlight %}


![png](/notebooks/adult_income_data_set_files/adult_income_data_set_11_0.png)


We see there is a high correlation between `Education` and `Education-Num`.
Let's look at these columns

**In [6]:**

{% highlight python %}
original_data[["Education", "Education-Num"]].head(15)
{% endhighlight %}




<div style="max-height:1000px;max-width:1500px;overflow:auto;">
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Education</th>
      <th>Education-Num</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0 </th>
      <td>    Bachelors</td>
      <td> 13</td>
    </tr>
    <tr>
      <th>1 </th>
      <td>    Bachelors</td>
      <td> 13</td>
    </tr>
    <tr>
      <th>2 </th>
      <td>      HS-grad</td>
      <td>  9</td>
    </tr>
    <tr>
      <th>3 </th>
      <td>         11th</td>
      <td>  7</td>
    </tr>
    <tr>
      <th>4 </th>
      <td>    Bachelors</td>
      <td> 13</td>
    </tr>
    <tr>
      <th>5 </th>
      <td>      Masters</td>
      <td> 14</td>
    </tr>
    <tr>
      <th>6 </th>
      <td>          9th</td>
      <td>  5</td>
    </tr>
    <tr>
      <th>7 </th>
      <td>      HS-grad</td>
      <td>  9</td>
    </tr>
    <tr>
      <th>8 </th>
      <td>      Masters</td>
      <td> 14</td>
    </tr>
    <tr>
      <th>9 </th>
      <td>    Bachelors</td>
      <td> 13</td>
    </tr>
    <tr>
      <th>10</th>
      <td> Some-college</td>
      <td> 10</td>
    </tr>
    <tr>
      <th>11</th>
      <td>    Bachelors</td>
      <td> 13</td>
    </tr>
    <tr>
      <th>12</th>
      <td>    Bachelors</td>
      <td> 13</td>
    </tr>
    <tr>
      <th>13</th>
      <td>   Assoc-acdm</td>
      <td> 12</td>
    </tr>
    <tr>
      <th>14</th>
      <td>    Assoc-voc</td>
      <td> 11</td>
    </tr>
  </tbody>
</table>
</div>



As you can see these two columns actually represent the same features, but
encoded as strings and as numbers. We don't need the string representation, so
we can just delete this column. Note that it is a much better option to delete
the `Education` column as the `Education-Num` has the important property that
the values are ordered: the higher the number, the higher the education that
person has. This is a vaulable information a machine learning algorithm can use.

**In [7]:**

{% highlight python %}
del original_data["Education"]
{% endhighlight %}

So it seems that the data is mostly OK with the exception of `Sex` and
`Relationship`, which seems to be negatively correlated. Let's explore that for
a bit

**In [8]:**

{% highlight python %}
original_data[["Sex", "Relationship"]].head(15)
{% endhighlight %}




<div style="max-height:1000px;max-width:1500px;overflow:auto;">
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Sex</th>
      <th>Relationship</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0 </th>
      <td>   Male</td>
      <td> Not-in-family</td>
    </tr>
    <tr>
      <th>1 </th>
      <td>   Male</td>
      <td>       Husband</td>
    </tr>
    <tr>
      <th>2 </th>
      <td>   Male</td>
      <td> Not-in-family</td>
    </tr>
    <tr>
      <th>3 </th>
      <td>   Male</td>
      <td>       Husband</td>
    </tr>
    <tr>
      <th>4 </th>
      <td> Female</td>
      <td>          Wife</td>
    </tr>
    <tr>
      <th>5 </th>
      <td> Female</td>
      <td>          Wife</td>
    </tr>
    <tr>
      <th>6 </th>
      <td> Female</td>
      <td> Not-in-family</td>
    </tr>
    <tr>
      <th>7 </th>
      <td>   Male</td>
      <td>       Husband</td>
    </tr>
    <tr>
      <th>8 </th>
      <td> Female</td>
      <td> Not-in-family</td>
    </tr>
    <tr>
      <th>9 </th>
      <td>   Male</td>
      <td>       Husband</td>
    </tr>
    <tr>
      <th>10</th>
      <td>   Male</td>
      <td>       Husband</td>
    </tr>
    <tr>
      <th>11</th>
      <td>   Male</td>
      <td>       Husband</td>
    </tr>
    <tr>
      <th>12</th>
      <td> Female</td>
      <td>     Own-child</td>
    </tr>
    <tr>
      <th>13</th>
      <td>   Male</td>
      <td> Not-in-family</td>
    </tr>
    <tr>
      <th>14</th>
      <td>   Male</td>
      <td>       Husband</td>
    </tr>
  </tbody>
</table>
</div>



Yes. The data looks correlated, because for example `Male` and `Husband` are
highly correlated values, as well as `Female` and `Wife`. There is no easy way
to tackle this problem, so let's carry on.

## Build a classifier

Now that we explored our data, let's try to build a classifier which tries to
predict what will be the income of a given person given the features we have in
our dataset.

First we need to encode the features as numbers as the classifiers cannot work
with string features. As we saw a while ago this can be achieved easily with the
function we defined earlier. Let's encode the data and show the histograms of
the values again.

**In [9]:**

{% highlight python %}
encoded_data, encoders = number_encode_features(original_data)
fig = plt.figure(figsize=(20,15))
cols = 5
rows = ceil(float(encoded_data.shape[1]) / cols)
for i, column in enumerate(encoded_data.columns):
    ax = fig.add_subplot(rows, cols, i + 1)
    ax.set_title(column)
    encoded_data[column].hist(axes=ax)
    plt.xticks(rotation="vertical")
plt.subplots_adjust(hspace=0.7, wspace=0.2)
{% endhighlight %}


![png](/notebooks/adult_income_data_set_files/adult_income_data_set_20_0.png)


As you can see we have our data properly encoded and it seems to make sense.
Now, let's try to build a classifier for it. Before we do that, let's split the
data into a train and test set. This is a common approach to avoid overfitting.
If we train and test the classifiers on the same data we will always get awesome
results and we will most probably overfit the model. However if we test a
classifier on data it has never seen we can be more confident it will perform
better when ran on new data.

## Split and scale the features

Most machine learning algorithms like the features to be scaled with mean 0 and
variance 1. This is called "removing the mean and scaling to unit variance".
This can be easily done with the `StandardScaler` from `scikit-learn`. Let's
scale the features and look at them again.

**In [10]:**

{% highlight python %}
X_train, X_test, y_train, y_test = cross_validation.train_test_split(encoded_data[encoded_data.columns - ["Target"]], encoded_data["Target"], train_size=0.70)
scaler = preprocessing.StandardScaler()
X_train = pd.DataFrame(scaler.fit_transform(X_train.astype("f64")), columns=X_train.columns)
X_test = scaler.transform(X_test.astype("f64"))
{% endhighlight %}

### Logistic regression

**In [11]:**

{% highlight python %}
cls = linear_model.LogisticRegression()

cls.fit(X_train, y_train)
y_pred = cls.predict(X_test)
cm = metrics.confusion_matrix(y_test, y_pred)
plt.figure(figsize=(12,12))
plt.subplot(2,1,1)
sns.heatmap(cm, annot=True, fmt="d", xticklabels=encoders["Target"].classes_, yticklabels=encoders["Target"].classes_)
plt.ylabel("Real value")
plt.xlabel("Predicted value")
print "F1 score: %f" % skl.metrics.f1_score(y_test, y_pred)
coefs = pd.Series(cls.coef_[0], index=X_train.columns)
coefs.sort()
plt.subplot(2,1,2)
coefs.plot(kind="bar")
plt.show()
{% endhighlight %}

    F1 score: 0.553203



![png](/notebooks/adult_income_data_set_files/adult_income_data_set_25_1.png)


As you can see we managed to achieve F1 score of 0.55 and the features that
seems to contribute most positevely to have an income of more than $50K are
`Capital Gain`, `Education-Num` and `Sex`, while the features that contribute
most negatively are `Martia Status` and `Relationship`. There is a problem here,
though. Features like `Martial Status` have values ranging from 0 to 6 and the
order is really important here. In practice there is no particular order in that
feature (unline `Education-Num` for which the higher the number, the better the
education). We can fix this using *binary features*.

### Classify using binary features

As a last step we can try to improve our classifier using binary attributes. Our
current approach for encoding our data has the drawback that we put arbitrary
order in our classes. For example we encode `Relationship` with a number between
1 and 5 and the logistic regression interprets these values as continuous
variables and plugs them into an optimization function. This will cause
different classes to have different weight into our model, which is not correct.
Each class is theoretically equally weighted compared to the rest of the
classes. In order to fix this we can use dummy variables.

**In [12]:**

{% highlight python %}
binary_data = pd.get_dummies(original_data)
# Let's fix the Target as it will be converted to dummy vars too
binary_data["Target"] = binary_data["Target_>50K"]
del binary_data["Target_<=50K"]
del binary_data["Target_>50K"]
plt.subplots(figsize=(20,20))
sns.heatmap(binary_data.corr(), square=True)
plt.show()
{% endhighlight %}


![png](/notebooks/adult_income_data_set_files/adult_income_data_set_28_0.png)


Now we have a bunch of features that have only the values 0 and 1. There is a
lot of correlation between some of them, but let's not look at this for now (for
example Male and Female are negatively correlated).

**In [13]:**

{% highlight python %}
X_train, X_test, y_train, y_test = cross_validation.train_test_split(binary_data[binary_data.columns - ["Target"]], binary_data["Target"], train_size=0.70)
scaler = preprocessing.StandardScaler()
X_train = pd.DataFrame(scaler.fit_transform(X_train), columns=X_train.columns)
X_test = scaler.transform(X_test)
{% endhighlight %}

### Logistic Regression

**In [14]:**

{% highlight python %}
cls = linear_model.LogisticRegression()

cls.fit(X_train, y_train)
y_pred = cls.predict(X_test)
cm = metrics.confusion_matrix(y_test, y_pred)

plt.figure(figsize=(20,20))
plt.subplot(2,1,1)
sns.heatmap(cm, annot=True, fmt="d", xticklabels=encoders["Target"].classes_, yticklabels=encoders["Target"].classes_)
plt.ylabel("Real value")
plt.xlabel("Predicted value")
print "F1 score: %f" % skl.metrics.f1_score(y_test, y_pred)
coefs = pd.Series(cls.coef_[0], index=X_train.columns)
coefs.sort()
ax = plt.subplot(2,1,2)
coefs.plot(kind="bar")
plt.show()
{% endhighlight %}

    F1 score: 0.668999



![png](/notebooks/adult_income_data_set_files/adult_income_data_set_32_1.png)


# Summary

We managed to improve the F1 score significantly by converting the data to use
dummy variables. Also it seems that we managed to uncover some interesting
insign from our model. It seems that the features that impacts the income of a
person positevely are `Capital Gain`, `Married-civ-spounce`, `Age`, `Hours per
week` and `Exec-managerial`. The features that impact it most negateively are
`Never married`, `Own child`, `Priv-house-serv`, `Dovorsed` and unfortunately
`Female`. One more proof that there is a gender inequality in our society.

As you can see we not only managed to build a machine learning model that we can
use to classify new data, but we also managed to uncover some interesting
insigns from our data. This is one of the nice features of the linear models.
They are not "black boxes", like neural networks for example and allow to see
what exactly the model is doing.

You can download the ipython notebook, which was used for generating the above
analysis from [here](/notebooks/adult_income_data_set.ipynb).
