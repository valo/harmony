---
layout: post
title: Installing the rails native mysql bindings for a "fink" mysql
comments: true
tags:
  - mac
  - mysql
  - rails
  - ruby
---

I am using Mac OS X Leopard and I have the package manager [fink](http://www.finkproject.org/) for installing open source software. I have used fink to install mysql and today it turned out that this was a horrible mistake.

I lost around 1:30 hours for figure out how to compile the mysql gem. The installer was not able to find the mysql libraries and includes. The magic line turned out to be:

    # gem install mysql -- --with-mysql-config=`which mysql_config`

This makes the install just a piece of cake! :)
