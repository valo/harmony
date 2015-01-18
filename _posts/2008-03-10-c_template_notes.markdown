---
layout: post
title: Интересна забележка отностно темплейтите в C++
comments: true
tags:
  - C
---

Тъй като в момента портвам едни сорсове за GCC се натъкнах на много интересна несъвместимост между VC++ и GCC. В последствие се оказа, че това е пренебрегване на VC++ на стандарта (сефте!). Ето за какво става дума:

{% highlight cpp %}
    template class D : public B {
    public:
      void g()
      {
        // bad (even though some compilers erroneously (temporarily?) accept it)
        B::Xyz x;
        // bad (even though some compilers erroneously (temporarily?) accept it)
        B::Pqr y;
      }
    };
{% endhighlight %}

трябва да се напише по следният начин:

{% highlight cpp %}
    template class D : public B {
    public:
      void g()
      {
        typename B::Xyz x;  // good
        typename B::Pqr y;  // good
      }
    };
{% endhighlight %}

Ето и линкче от където са взети примерите (не поствам моя код заради NDA): [инфо](http://www.parashift.com/c++-faq-lite/templates.html#faq-35.18)

Между другото горният сайт е може би един най-ценните ресурси за C++ и то най-вече за по-сериозните неща в езика.
