---
layout: post
title: Why We Should Not Store ActiveRecord Objects Into The Session
published: false
tags:
  - rails
---
Why We Should Not Store ActiveRecord Objects Into The Session
=============================================================

* The session could become *very* large. It doesn't scale well
* If the model is updated some time later the object get obsolete
