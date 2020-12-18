---
layout: post
title: Weird ERB comment behaviors
comments: true
tags:
  - rails
  - erb
---

I encountered some very strange erb behaviors when the you comments in the templates. For example:

    <% if true %>
      Hi from Rails!
    <% end # hi from rails %>
    
The solution: if you want to put comments in ERB templates use this syntax:

    <% if true %>
      Hi from Rails!
    <% end %>
    <%# hi from rails %>
