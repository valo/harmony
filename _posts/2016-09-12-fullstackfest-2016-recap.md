---
layout: post
title: "Full Stack Fest 2016 Recap"
tags:
    - fullstackfest
    - opensource
    - conference
    - barcelona
image: images/posts/full-stack-fest.png
---

I few days ago I attended the [Full Stack Fest](https://2016.fullstackfest.com/) in Barcelona. It was a great conference and I really enjoyed the way it was organized and the talks that I watched. Great thanks to the organizers [codegram](http://www.codegram.com/) and [AirHelp](https://www.airhelp.com/en/) for sponsoring my attendance. I tried to keep notes during the conference about interesting ideas and projects, so I tried to compile these notes in a blog post as a recap of what I learned from the conference.

## Computing: The first 100 years

One of the interesting facts from this talk was that iPhone 6 has the processing power of 16 Cray-1 super-computers from the 1975. Great for playing Pokemon Go, as [Joe Armstrong](https://twitter.com/joeerl) said in the talk. Some more information in this infographic: [Processing Power Compared](http://pages.experts-exchange.com/processing-power-compared/).

## Unikernels and why they're useful (or not)

Generally the idea about the unikernels is a very interesting one. I had the opportunity to chat for an hour with [Amir Chaudhry](https://twitter.com/amirmc) and it turns out that the technology around unikernels is quite ahead and it is something, which Docker is investing resources into. I would expect we start to see them used more and more in the following years.

## What did AlphaGo do to beat the strongest human Go player?

This was the most interesting machine learning talk for me. I haven't read details how exactly was the AlphaGo implemented and the talk gave a nice overview of that. The whole algorithm is a combination between neural networks and [Monte Carlo tree search](https://en.wikipedia.org/wiki/Monte_Carlo_tree_search). A very interesting idea emerged from this talk for me and this is to use neural networks to implement human "intuition". It is all pattern matching at the end and the idea of using neural networks for that is not new, but thinking about a trained network as an implementation of human intuition looks really nice to me.

## How secure are Docker containers?

A very interesting talk! Several things I didn't know about docker from it:

* the `--pids-limit` flag, which limits the number of processes in the container. An easy way to prevent fork-bombs. The default is -1 (unlimited)
* the `--read-only` flag, which mounts the root FS in the container as read only. Very useful if you want to make sure a container is not writing on the FS (and creating additional layers and stuff)
* limiting the systems calls in a container using [seccomp](https://github.com/docker/docker/blob/master/docs/security/seccomp.md). Comes with a performance penalty, so be cautious.
* [http://dockerbench.com/](http://dockerbench.com/) is a docker container, which checks for dozens of common best-practices around deploying Docker containers in production. Haven't tried it, but looks very interesting.

Finally a thing not directly connected to docker, but very relevant for security: the [Shodan](https://www.shodan.io/) search engine. It indexes the servers around Internet and allows you to find specific machines, that reply in a certain way on some port. Very useful for hackers to find unprotected docker machines, for example. The bottomline - secure your services, as hackers will certainly find you!

## Microservice Pipeline Architecture

This was a talk about the BBC website, which is basically a precomputed cache, which is updated on each update of the content. They are open sourcing their system, so it is worth having a look at it: [alephant](https://github.com/BBC-News/alephant).


## Building a Recommendation Engine with Machine Learning Techniques

If you've done machine learning this talk would probably have been a bit basic to you. It was a kind of introduction to machine learning and how to approach learning about it. I took one interesting project out of it: [RapidMiner](https://rapidminer.com/). Looks like an IDE for doing machine learning. Seems quite pricey if you handle non-trivial amount of data, but might be a nice resource for novices to learn the basics.

## The future of ES6

This talk gave an interesting insight how the JavaScript is evolving as a language. Each proposal goes through several stages as it matures. If the feature is not working well it is abandoned. For example here are all [Stage 0 proposals](https://github.com/tc39/proposals/blob/master/stage-0-proposals.md) and here are the more evolved [Stage 1+ proposals](https://github.com/tc39/proposals). Also one can follow the discussion about the feature on the [ES Discuss website](https://esdiscuss.org/).

## Best Practices on building a UI component library for your company

I really liked this talk as it describes something, which I believe more and more companies are going to adopt in their front-end workflow: reusable, isolated HTML+CSS components. [David Wells](https://twitter.com/DavidWells) described a nice workflow how to build such a component library using best practices and technologies. He mentioned some existing component libraries that are worth exploring:

* [Lightning Design System](http://lightningdesignsystem.com/) from Salesforce
* [MuleSoft Components](http://ux.mulesoft.com/#/) which are based on ReactJS
* [Atomic Design](http://bradfrost.com/blog/post/atomic-web-design/), which is the philosophy on which all these component libraries are based on
* And finally a list of [19 Open Source React Component Libraries to use in your next project](http://davidwells.io/19-open-source-react-component-libraries-to-use-in-your-next-project/) which covers some more

In order to build a component library, which provides truly isolated components (the CSS of one component does not impact the CSS of the others), [PostCSS](https://github.com/postcss/postcss) is used. Looks like a very useful project that I will definitely check out. There is a talk from David Wells on the topic: [Bulletproof CSS in React](https://vimeo.com/173122870).

One thing was mentioned in the talk, that I haven't thought about: font icons are inferior to SVG icons, because they can be only 1 color. Here is an example from [Lightning Design System](http://lightningdesignsystem.com/icons/) which shows how cool multicolor icons can look like. SVG FTW!

During the talk a very interesting project was mentioned: [Phenomic](https://phenomic.io/). It allows to generate static HTML websites from ReactJS projects. The sites will work as static if there is no JavaScript enabled, but if JS is enabled they will load as static and provide a dynamic UX.

## See the data flowing through your app

This was a talk about building front-end apps using reactive programming. [André Staltz](https://twitter.com/andrestaltz) made a great opening of this talk with some special effects and definitely took the attention of the audience. He showed what it looks like to build apps using [Cycle.js](http://cycle.js.org/). Seems like a very promising technology. Worth to mention that it has a very nice Chrome plugin, which allows you to see how the data is flowing through your app.

## How to build a website that will (eventually) work on Mars?

So here is a talk with quite a bombastic title. It was discussing various aspects of the data transfer between planets, which are mainly caused by the speed of light. Some interesting projects mentioned during the talk:

* [PouchDB](https://pouchdb.com/) is a DB which runs within your browser, so you can store data locally while your app is offline and sync it when it goes online again
* [Hyperdrive](https://github.com/mafintosh/hyperdrive) is a peer to peer data distribution protocol
* [IPFS](https://ipfs.io/) is a peer-to-peer hypermedia protocol, which allows to have a distributed web. Might be the way to handle content efficiently between planets, where each planet will have a local version of the global web, which is synchronized on demand.

## Reactive Reality & Virtual Reality is Here, in your Browser

These were two talks about virtual reality in the web. Looks like an early stage technology with some interesting potential use cases. The projects mentioned:

* [Konva](http://konvajs.github.io/) is a library for drawing on html5 canvas
* [React Konva](https://github.com/lavrton/react-konva) allows to use Konva with the ReactJS
* [A-frame](https://aframe.io/) is a JS framework for building VR worlds for the web

## The Physical Web: building on top of the open web

I was totally blown away by this talk from [Scott Jenson](https://twitter.com/scottjenson). The Physical Web essentially allows you to put a small beacon in some physical object and transmit an URL using BLE. This is a very powerful concept, as it allows to interact with objects around you without the need of downloading a mobile app. For example you can approach a parking meter, see its URL, open it and pay for your parking without installing an app. Or approach a monument, open its URL and read more about it. Or have a box of pills, which broadcasts an URL, on which you can monitor when you need to take your medication and once you access it, receive push notifications when you need to take the next dose. The possibilities are so many, so I urge you to read more about [Physical Web](https://google.github.io/physical-web/) and tell people around you more about it. This simple technology looks like a peak in the future.

## Final words

Generally I really liked the conference and Barcelona as a hosting city, so I will definitely try to come back next year. I have a big list of technologies to read about and play with. Hope I will have enough time to go through everything until next year ;-).
