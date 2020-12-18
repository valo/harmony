---
layout: post
title: My experience with developing a Rails 2.3.5 project with Ruby 1.9.1 Part 2
comments: true
tags:
   - rails
   - ruby 1.9
---

My journey into the ruby 1.9 land continues with some nice observations, tricks and tips.

Debugger still not working
--------------------------

I just discovered something interesting. It is not really a big deal, but it is something to keep in mind:

    $ gem1.9 install ruby-debug
    Building native extensions.  This could take a while...
    ERROR:  Error installing ruby-debug:
    	ERROR: Failed to build gem native extension.

    /usr/local/Cellar/ruby/1.9.1-p376/bin/ruby1.9 extconf.rb
    Can't handle 1.9.x yet

Obviously the debugger is still not working on ruby 1.9.

Using the rails console with ruby 1.9
-------------------------------------

There is a slight catch if you want to use the console. If you just do

    ./script/console
    
you will notice many strange behavior, like broken unicode characters and even core dumps like the one below if you have unpacked native gems in your project.

    (3830) malloc: *** error for object 0x1027ec038: pointer being reallocated was not allocated
    *** set a breakpoint in malloc_error_break to debug
    Abort trap

The problem is that the console is actually using the system default irb, which was using ruby 1.8 on my machine. In order to use the 1.9 irb you should do the following:

    ./script/console --irb=irb1.9
  
This is if your 1.9 irb is called irb1.9
