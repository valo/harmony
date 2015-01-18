---
layout: post
title: Why writing good XHTML matters
comments: true
tags:
  - xhtml
  - good practices
---

These days I am working on a large change in our corporate website. It includes  a lot of functional changes as well as a lot of little text tweaks here and there. Our process for making these changes is that the marketing people go through the whole site and generate a large document, which includes all the modifications that should be made. After that the developers go through the large doc and start making the changes. The problem is that this process is **very** inefficient. This is because of the following reasons:

 * The marketing people need time to generate the changes
 * The developers need time to understand the changes. Usually emails are exchanged, because the idea is not clear in all the places
 * The developers end up making a lot of find/replace, copy/paste changes, which are nothing more than text editing
  
Sounds familiar, huh?
  
I was thinking about this and I believe that the problem in the whole process is in the developers and the code base of the web site. In the perfect world the code of the website will be clean XHTML with very well separated CSS style and [unobstructive javascript](http://en.wikipedia.org/wiki/Unobtrusive_JavaScript "Unobtrusive JavaScript - Wikipedia, the free encyclopedia"). What this means is that the code of the website will be readable by ordinary people, who don't understand any of the above things. Therefore these people will be able to easily make simple changes of the text without fearing that they will break something.

You can't expect the non-programming people to understand what is javascript, why are these empty div-s here and why do we need them in order to have rounded corners. This reminds me again about the saying "Source code is intended to be read by humans and sometimes to be able to run on machines".

Here is a real argument, why we should not bloat our code. It will save us time in the future and will make our company more effective.

Bottom line
-----------

If you write clean and understandable code you will not only save time during future maintenance, but your team could be more effective, because non-programming people can make small tweaks.
