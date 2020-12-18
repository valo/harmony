---
layout: post
title: An interesting compiler oddness in Visual Studio C++
comments: true
tags:
  - C
---

A few days ago I stumbled to a very interesting behavior of the Visual Studio C++ compiler. Here is a simple code illustrating it:

{% highlight c %}
    #include <cstdio>
    #include <map>
    #include <string>

    using namespace std;

    map<string, string> gmap;

    void test(bool use_global_map)
    {
      map<string, string>& m = use_global_map ? gmap : map<string, string>();
      m["A"] = "This is a changed value";
    }

    int main()
    {
      gmap["A"] = "Initial value";
      test(false);
      printf("Value in map with false arg: %s\n", gmap["A"].c_str());
      test(true);
      printf("Value in map with true arg: %s\n", gmap["A"].c_str());
    }
{% endhighlight %}

In this code there is an error and it is an initialization of the reference in the test function with a map, which is local for the conditional expression. This means that the reference will be initialized with an object, which will be destroyed after the line is executed.

The problem is that VC++ allows you to write this. The more interesting thing is how this code will behave. It turns out that whatever value you pass to the test function it will always behave like you created a new map and initialized the reference with it. So, gmap will never be changed!

Compiling this code with GCC gives an error, which is the correct behavior for this kind of expressions.
