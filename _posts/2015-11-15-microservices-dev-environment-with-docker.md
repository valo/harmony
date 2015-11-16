---
layout: post
title: "Development environment for microservices with docker-compose"
tags:
    - docker
    - docker-compose
    - microservices
    - containers
image: images/posts/docker-friends.png
---

![png](/images/posts/docker-friends.png){: .center-image}

Developing apps as a set of microservices is getting more and more popular in the recent years. Usually teams decide to adopt this approach as a way to decrease the complexity of their projects. I won't go into details if this approach is good or bad, but I'm convinced that it has its place in the arsenal of software practices a good engineer should have.

One of the problems I've seen with this approach is the increased complexity of running the whole system. This is because with each new microservice, the developer usually needs to run a separate database and/or memcache/redis/rabbitmq/nosql storage. As the number of services grow this becomes a bigger problem (usually anything with more than 2 services is getting quite hard to run and configure). This is especially problematic for new team members that need to run the app and play with it as they need to understand the dependencies of each microservice.

Here I will show you an example how to tackle this problem using [docker-compose](https://docs.docker.com/compose/). In order to make the task easier I will show you how to run a simple app, which needs 5 difference processes to operate (1 app server, 2 storages and 2 background workers). Let's start.

## The example app

The app we are going to work with is a simplified source code grading system. The idea is that users submit source codes from a web UI, the source codes are stored in a PostgreSQL database and enqueued in a RabbitMQ queue for grading. There is a separate grading service, that reads the enqueued sources codes, calculates the score of each of them and enqueues back the score. Then the frontend reads the scores from RabbitMQ and updates the PostgreSQL database with the scores and the web UI uses this data to show a ranklist of all users.

Each of the apps are developed in a separate git repository. Here are the repos:

* Frontend - a simple sinatra app located here: [https://github.com/valo/example-docker-services-frontend](https://github.com/valo/example-docker-services-frontend)
* Grader - a simple background job processor which you can see here: [https://github.com/valo/example-docker-services-grader](https://github.com/valo/example-docker-services-grader)

Here is a diagram of the microservices and the database storages and how they are connected with each other:

![png](/images/example_docker_services_app.png){: .center-image}

## Dev environment requirements

We have several requirements for the dev environment so that it is effective and productive:

* It should be possible to run all the apps with a single command
* When a change is done in the code/templates this should be visible on a page reload
* It should be possible to run different apps without caring about clashing dependencies or incompatible libs

Basically we should be able to work with several such projects and each of them could be using different version of the same DB. The problem with the live reload is also very important as this is a key feature any developer rely on for fast prototyping.

## The solution - docker-compose

Probably you've heard about containers, docker and virtualization. These tools could be a viable solution of the above problem. In order to meet the above requirements you need to combine the following things:

* [git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) - it is possible to have a single repository, which has links to the master branches of all microservices you have. Here is an example: [https://github.com/valo/example-docker-services](https://github.com/valo/example-docker-services)
* Dockerfile for each microservice - it describes the dependencies of each microservice. Here is an example for the frontend app: [https://github.com/valo/example-docker-services-frontend/blob/master/Dockerfile](https://github.com/valo/example-docker-services-frontend/blob/master/Dockerfile)
* [docker-compose](https://docs.docker.com/compose/) - a tool, which allows to describe the services in your app and the links between them. Here is an example configuration file: [https://github.com/valo/example-docker-services/blob/master/docker-compose.yml](https://github.com/valo/example-docker-services/blob/master/docker-compose.yml)
* (optional) [foreman](https://github.com/ddollar/foreman) - allows you to run several processes with a single commands. Very useful if you have an app which serves HTTP requests and also has background workers. Here is an example for the frontend app: [https://github.com/valo/example-docker-services-frontend/blob/master/Procfile](https://github.com/valo/example-docker-services-frontend/blob/master/Procfile)

### Prerequisites for OSX

First you need to install `docker` and `docker-compose` first. On OS X I recommend using [homebrew](http://brew.sh/) to install all the require dependencies:

{% highlight bash %}
$ brew install caskroom/cask/brew-cask
$ brew cask install virtualbox
$ brew install docker-machine docker docker-compose
$ docker-machine create --driver virtualbox dev
$ eval $(docker-machine env dev)
{% endhighlight %}

This is going to install VirtualBox, docker-machine, docker and docker-compose and then create a linux VM which will host your docker containers. This is needed because docker can't run natively on OS X. You can read more about docker-machine from its docs on [https://docs.docker.com/machine/](https://docs.docker.com/machine/).

Keep in mind that the last command will setup the environment for the `docker` and `docker-compose` command. If you open a new shell you need to run `eval $(docker-machine env dev)` again, so that you can control the containers in the VM.

### Setup

You need to make some adjustments to your app, so that you can run it with docker-compose.

#### Use environment variables for your config

You need to configure your microservices with environment variables. All the links to external services should be configurable from the environment. For example the frontend app allows to set the rabbitMQ and PostgreSQL urls with the environment variables `DATABASE_URL` and `AMPQ_ADDRESS`. This convention is part of the [12 factor app](http://12factor.net/config) manifesto.

#### Create Dockerfile for each microservice

You will need a Dockerfile for each microservice, which allows to run the service in a container. In our app we can use the ruby 2.2 docker image and install any extra gems we need to run the app. Here is an example Dockerfile:

{% highlight Dockerfile %}
FROM ruby:2.2-onbuild
RUN gem install foreman

COPY . /app
WORKDIR /app

CMD foreman start
{% endhighlight %}

This Dockerfile uses the [ruby 2.2 image](https://hub.docker.com/_/ruby/) from docker hub. It installs the `foreman` gem, which we need to run the service. Then imports the source code of the project in the `/app` folder and sets the working directory there (all commands will be ran in that folder). Finally it runs the service with the `foreman start` command, which will boot the webserver and run the background workers.

#### Create a git repo with submodules

Usually each of the microservices lives in its own git repository, so it is useful to have a "root" repository, which has links to each service of the app. You can have git submodules that track a given branch of each submodule. You can create these submodules like this:

{% highlight bash %}
$ git init
$ git submodule add -b master git@github.com:valo/example-docker-services-frontend.git
$ git submodule add -b master git@github.com:valo/example-docker-services-grader.git
$ git commit -m "Import all microservices as modules"
{% endhighlight %}

The above commands will create a repository like this one: [https://github.com/valo/example-docker-services](https://github.com/valo/example-docker-services)

#### Define a docker-compose config

Finally you need a `docker-compose` config, which describes all services and their dependencies. Here is the config for the app that we have:

{% highlight yaml %}
frontend:
  build: ./example-docker-services-frontend
  ports:
    - "4567:4567"
  links:
    - rabbitmq
    - postgres
  environment:
    - AMPQ_ADDRESS=amqp://rabbitmq:5672
    - DATABASE_URL=postgres://postgres:mysecretpassword@postgres:5432
  volumes:
    - ./example-docker-services-frontend/:/app

grader:
  build: ./example-docker-services-grader
  links:
    - rabbitmq
  environment:
    - AMPQ_ADDRESS=amqp://rabbitmq:5672
  volumes:
    - ./example-docker-services-grader/:/app

rabbitmq:
  image: rabbitmq
  ports:
    - 5672

postgres:
  image: postgres:latest
  ports:
    - 5432
  environment:
    - POSTGRES_PASSWORD=mysecretpassword
    - POSTGRES_USER=postgres
{% endhighlight %}

There are several important parts in this config. There is a root element for each service (frontend, grader, rabbitmq and postgresql). Each of these services can be referenced in the `environment` section, so that we can link services together. You can see how the `rabbitmq` service is referenced in the `AMPQ_ADDRESS` variable.

It is also very important to link the local folders with `volumes` sections. This provides the "auto-reload" functionality, as the files in the container are going to be updates as you change them locally.

#### Putting it all together

Finally after you have all this setup, you can run all the services by just running:

{% highlight bash %}
$ git clone git@github.com:valo/example-docker-services.git
$ cd example-docker-services
$ docker-compose up
{% endhighlight %}

And then to open the frontend application you can run:

{% highlight bash %}
$ open http://$(docker-machine ip dev):4567
{% endhighlight %}

#### Running setup commands

Most of the time you need to run some commands to setup the DB, import data, etc. You can do that like this:

{% highlight bash %}
$ docker-compose run frontend bundle exec rake db:migrate db:seed
{% endhighlight %}

Essenatially you need to prefix each command with `docker-compose run <service_name>`.

## Conclusion

Using `docker-compose` is a great way to run multiple services in an easy and reproducible way. There are a lot of details around this tool, but I think the example project here will give you a good foundation to migrate your complex app to a more managable setup.
