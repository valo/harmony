---
layout: post
title: Switching my blog to jekyll and compass
comments: true
tags:
  - blogging
  - ruby
  - sinatra
  - heroku
  - compass
  - jekyll
---

Probably you remember that some time ago I decided to switch my blog from [blogger](http://blogger.google.com/ "Google") to a custom made blogging engine written my me. It was a simple sinatra app, which was parsing a bunch of markdown files, which were the posts and rendering the blog.

What I really liked in this approach are several things:

* I can easily blog from TextMate or any other editor supporting markdown highlighting
* I can keep my blog in source countrol, like github
* I have the flexibility to do whatever I want with the text files of the posts (like exporting them to PDF or LaTeX later)
* I avoid the complexity of WordPress and the WTFiness when the posts render weirdly from the database (like escaped '<' and '>' symbols)

As a whole I think that heavy engines like [WordPress](http://wordpress.org/ "WordPress &#8250; Blog Tool and Publishing Platform") are just too complex for most of the blogs. Keeping your posts in a database makes them difficult to be exported to other formats like PDF and also the HTML code tends to become too messy in a very short time. Especially if you are using WYSIWYG editors.

Why I decided to switch from my initial custom engine?
------------------------------------------------------

The [sinatra](http://www.sinatrarb.com/ "Sinatra") app that I implemented was basically parsing a bunch of markdown files with some meta data embedded in them and was rendering them in the blog. A lot of the functionality was offloaded to javascript.

There was a major flaw in that approach: SEO sucked!

Because of the javascript code, which was doing most of the work the search engine crawlers were not able to detect the proper titles of the posts and the titles are something *really* important for the SEO.

So, I had to make a change in order to make my blog discoverable. I decided to use [jekyll](http://github.com/mojombo/jekyll "mojombo's jekyll at master - GitHub") because a lot of people are using it already. For example [github](http://github.com/ "Secure source code hosting and collaborative development - GitHub") uses it for its project pages. Also quite a lot of people are using it as a blogging engine.

It is quite powerful and also it is doing preprocessing and effectively translates your blog into a static site. This is a great thing, because it makes the blog *very* fast.

Comments? Use a JS solution like [disqus](http://disqus.com/ "DISQUS Comments | Powering Discussion on the Web") and you will be fine ;-)

You want a twitter widget? Javascript is your friend. The twitter widget on my blog is a [jQuery](http://jquery.com/ "jQuery: The Write Less, Do More, JavaScript Library") plugin, which integrates very easily.

What about [compass](http://compass-style.org/ "Compass")?
-------------------

May be you heaven't heard of compass, but tt is really great! The idea is that you have that special language to write CSS called [SASS](http://sass-lang.com/ "Sass - Syntactically Awesome Stylesheets"). The good thing about SASS is that it gives you things like mixins, partials and variables, which makes reusing CSS easier. It integrates with already existing CSS frameworks like [blueprint](http://www.blueprintcss.org/ "Blueprint: A CSS Framework | Spend your time innovating, not replicating") and makes writing layouts a peace of cake.

For example, imagine that you are developing a site and you want to have 2 columns layout with header, content and footer. Here is how your CSS will look like with compass:

    // defines a class for a body tag for 2 columns
    body.two-col
      #container
        +container // includes a partial called 'container'
      #header, #footer
        +column(24) // the header and the footer are 24 columns wide
      #sidebar
        +column(7, true) // the sidebar is 7 columns wide
      #content
        +column(16) // the content part is 16 columns wide
        +append(1) // and it as 1 column spacing from the sidebar

This is really convenient, because you don't have to handle a lot of standard CSS and you just throw out your ideas.

Source code
-----------

You can find the source code of this blog here: [http://github.com/valo/valentinmihov.com](http://github.com/valo/valentinmihov.com). Any comments and suggestions are more than welcome.

What's next?
------------

I plan on posting a video on getting started with jekyll, compass and [heroku](http://heroku.com/ "Heroku | Ruby Cloud Platform as a Service") for your own blog. It will be a several steps procedure, which will allow most of the people to have their own jekyll blog, hosted for free on heroku (which uses the Amazon cloud)
