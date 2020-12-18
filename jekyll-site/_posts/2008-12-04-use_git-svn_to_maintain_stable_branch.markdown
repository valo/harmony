---
layout: post
title: Use git-svn to maintain a stable branch
comments: true
tags:
  - git
---

These days I discovered that git-svn could be very useful for my workflow. In the project I work now, the development is quite intense and it is not unusual for the latest code, when I get up in the morning and sync with the trunk, not to work properly or to require some reconfiguration. This means that I will need extra time to get everything working, before I am able to start working.

Our repository is SVN and I am using git-svn to track it. So I decided to maintain a branch called "stable", which has everything in a state that I am sure that is working. I am working on this branch and every time I want to push something to the trunk, I switch to the master and execute:

    $ git checkout master
    $ git merge stable
    $ git svn dcommit

This will merge my changes from the stable branch (which is a trivial merge) and will push my changes on the server. After that I switch back to the stable branch and I don't care what is happening with the trunk.

Every several days I update my stable version with the trunk.

This whole thing is saving me a lot of hours or reconfiguring and tracking regressions and I can invest these hours into real development. Git rulz :)
