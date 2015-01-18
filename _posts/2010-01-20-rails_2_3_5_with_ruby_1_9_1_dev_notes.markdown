---
layout: post
title: My experience with developing a Rails 2.3.5 project with Ruby 1.9.1 Part 1
comments: true
tags:
   - rails
   - ruby 1.9
   - mechanize
---

I decided to use ruby 1.9.1 for my next project. One of the reasons I decided so is because ruby 1.9 is definitely faster than 1.8 and also it has a superior encoding support for the strings. Not to mention that living on the edge is a thrill :-)

Setup
-----

I am working on a MacBook Pro with Mac OS X 10.6.2. I installed [homebrew](http://github.com/mxcl/homebrew "mxcl's homebrew at master - GitHub") so I can install ruby 1.9. Because I don't want to override my ruby 1.8 install I had to make a change in the formula for ruby. I added a --program-suffix=1.9 to the configure script. Here is how it will look:

    system "./configure", "--prefix=#{prefix}",
                          "--disable-debug",
                          "--disable-dependency-tracking",
                          "--enable-shared",
                          "--program-suffix=1.9"

After that I did:

    gem1.9 install rails mechanize nokogiri formtastic

After some glitches, because I had a previous install of ruby 1.9 on my machine everything ran well.

Creating the rails app. Problems start to appear
------------------------------------------------

I created the rails project and here my first serious problem struck.

When I try to run
    
    ruby1.9 ./script/server
    
I receive

    Loading development environment (Rails 2.3.5)
    Missing the Rails 2.3.5 gem. Please `gem install -v=2.3.5 rails`, update your RAILS_GEM_VERSION setting in config/environment.rb for the Rails version you do have installed, or comment out RAILS_GEM_VERSION to use the latest version installed.
    
A workaround for this is to do

    rake1.9 rails:freeze:gems
    
It is going to freeze the rails framework into the vendor folder and the server is able to run from there on. I noted to myself that I will have to unpack all the gems that I use in the project. This is really not a big deal for me, so I just continued from there on.

Unicode templates. The biggest pain so far.
-------------------------------------------

I wrote my first template with some unicode symbols in it (the project is in Bulgarian) and when I tried to render the template I received an error:

    invalid byte sequence in US-ASCII
    
This was quite frustrating, but after some research I figured out that the reason for this is the default encoding of the ruby VM. It is using the LANG environment variable to determine that. My LANG was empty so it assumed US-ASCII. An easy way to test what is your default encoding is to do:

    $ irb1.9
    >> __ENCODING__
    => #<Encoding:US-ASCII>
    >> 

This means that ruby will load all files with this encoding by default, which also includes the templates. The way to fix this is to set the LANG var:

    $ export LANG=en_US.UTF-8 && irb1.9
    >> __ENCODING__
    => #<Encoding:UTF-8>
    >> 

This fixes this error, but causes a new one:

    incompatible character encodings: ASCII-8BIT and UTF-8
    
This was a tough one. It turned out that there is a bug about this in the rails' lighthouse: [here](https://rails.lighthouseapp.com/projects/8994/tickets/2188-i18n-fails-with-multibyte-strings-in-ruby-19-similar-to-2038)

Using the workaround of Hektor fixed the issue, although it is not perfect, because it forces the encoding of the erb templates to utf-8, which will not work if you use some other encoding.

Mechanize and SSL pages
-----------------------

After going through this obstacle I encountered another one. I am using mechinize and nokogiri in my project to scrape some web pages. In one of the scenarios I am accessing a SSL page. Here is what I got after trying to parse this page:

    Net::HTTP::Post: <some_ssl_web_page_address_here>
    request-header: accept => */*
    request-header: user-agent => Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en) AppleWebKit/418 (KHTML, like Gecko) Safari/417.9.3
    request-header: connection => keep-alive
    request-header: keep-alive => 300
    request-header: accept-encoding => gzip,identity
    request-header: accept-language => en-us,en;q=0.5
    request-header: host => my.globul.bg
    request-header: accept-charset => ISO-8859-1,utf-8;q=0.7,*;q=0.7
    request-header: content-type => application/x-www-form-urlencoded
    request-header: content-length => 110
    Rescuing EOF error
    Rescuing EOF error
    Rescuing EOF error

    EOFError (end of file reached):
      /usr/local/Cellar/ruby/1.9.1-p376/lib/ruby1.9/1.9.1/net/protocol.rb:135:in `sysread'
      /usr/local/Cellar/ruby/1.9.1-p376/lib/ruby1.9/1.9.1/net/protocol.rb:135:in `block in rbuf_fill'
      /usr/local/Cellar/ruby/1.9.1-p376/lib/ruby1.9/1.9.1/timeout.rb:52:in `timeout'
      /usr/local/Cellar/ruby/1.9.1-p376/lib/ruby1.9/1.9.1/timeout.rb:82:in `timeout'
      /usr/local/Cellar/ruby/1.9.1-p376/lib/ruby1.9/1.9.1/net/protocol.rb:134:in `rbuf_fill'
      /usr/local/Cellar/ruby/1.9.1-p376/lib/ruby1.9/1.9.1/net/protocol.rb:116:in `readuntil'
      /usr/local/Cellar/ruby/1.9.1-p376/lib/ruby1.9/1.9.1/net/protocol.rb:126:in `readline'
      /usr/local/Cellar/ruby/1.9.1-p376/lib/ruby1.9/1.9.1/net/http.rb:2136:in `read_status_line'
      /usr/local/Cellar/ruby/1.9.1-p376/lib/ruby1.9/1.9.1/net/http.rb:2125:in `read_new'
      /usr/local/Cellar/ruby/1.9.1-p376/lib/ruby1.9/1.9.1/net/http.rb:1117:in `transport_request'
      /usr/local/Cellar/ruby/1.9.1-p376/lib/ruby1.9/1.9.1/net/http.rb:1103:in `request'

It turns out that this is a kind of a known problem, which is described [here](http://github.com/tenderlove/mechanize/issues/#issue/7). You can have a look at my comments and [here](http://github.com/valo/mechanize/commit/e8c9d0ef72f55461ed33d4a0ee283683cb0f83aa) is a commit, which is fixing the problem. It is still not merged into the mechanize code, because I should come up with a unit test for it.

Bottomline
----------

Lol! That was a tough fight! I think that ruby 1.9 and particularly the libs in the ruby community have a long way to go until they are usable by the regular developers. At least the community is driving forward. I haven't tried rails 3, but I heard that it has fixed the issues with the encodings in the templates. For the rest of the libs it is just a matter of time to polish all the issues. Until then: give 1.9 a try and report any issues you have.
