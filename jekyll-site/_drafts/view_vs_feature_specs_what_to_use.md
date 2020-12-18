---
layout: post
title: "View vs Feature specs. What to use when"
date: 2015-01-27 14:35:00 +0200
comments: true
tags: 
  - rails
  - rspec
  - testing
  - capybara
---

Some may argue that the view specs in your rails project are just duplicating the feature specs you have. The idea of the view specs is to test the views in isolation, while the feature specs test user stories end-to-end, usually using tools like capybara and phantomjs (if you want to test JS functionality).

What I want to argue here is that in most of the cases the above statement is true, but the view specs are still very useful for testing edge cases and bugs you found. Having a feature spec for each edge case in your user story can make your test suite quite slow and also you will most probably have quite a lot of duplication in your specs. Let's stop talking and look at some code and data.
