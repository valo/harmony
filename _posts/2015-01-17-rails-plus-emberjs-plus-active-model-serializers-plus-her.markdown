---
layout: post
title: "Rails + EmberJS + Active Model Serializers + Her"
date: 2015-01-17 20:20:14 +0200
comments: true
tags:
   - rails
   - emberjs
   - her
   - soa
   - services
   - json
   - rails api
   - api
---
Recently I got into a situation at work, where there was a Rails app, which was exposing some data through an API which uses [active_record_serializers](https://github.com/rails-api/active_model_serializers) and [EmberJS](http://emberjs.com/) as front-end of the data. The problem was there needed to be a new Rails app, which also consumes data from the same Rails API endpoints and visualize the data. Unfortunatelly ActiveRecord and [Her](https://github.com/remiprev/her) are not supporting the ember-data kind of data format, which requires to have separate serializers for EmberJS and for regular Rails API calls. So the [ember_data_active_model_parser](https://github.com/valo/ember_data_active_model_parser) was born, which is a middleware for Her, which makes it understand the ember-data JSON format.

## Using EmberJS with Rails

The standard way to hook up EmberJS with a Rails app is to use the active_record_serializers and the [DS.ActiveModelAdapter](http://emberjs.com/api/data/classes/DS.ActiveModelAdapter.html. This causes the JSON responses to look like this (GET /project/1):

{% highlight javascript %}
// GET /projects/1
{
    "project": {
        "id": 1,
        "name": "Shop list",
        "task_ids": [
            2,
            8
        ]
    },
    "tasks": [
        {
            "completed": true,
            "id": 2,
            "name": "Water"
        },
        {
            "completed": false,
            "id": 8,
            "name": "Bread"
        }
    ]
}
{% endhighlight %}

As you see the nested resources are specified with their ids and then are serialized at the top level of the JSON. Unfortunately this does not work with ActiveResource or Her if you want to consume this from another Rails app.

This is done with the following serializers:

{% highlight ruby %}
class ProjectSerializer < ActiveModel::Serializer
  embed :ids, embed_in_root: true

  attributes :id, :name

  has_many :tasks
end

class TaskSerializer < ActiveModel::Serializer
  embed :ids, embed_in_root: true

  attributes :id, :name, :completed
end
{% endhighlight %}

## Consuming using Her and a custom parser

At this point everything works great, but what about if you want to consume the above REST API from another Rails app? There are several options for an ORM here like [ActiveResource](https://github.com/rails/activeresource) and [Her](https://github.com/remiprev/her), but they both doesn't understand the above format. Here is what you get using the default Her parsers with the active_model_serializers format:

{% highlight ruby %}
Her::API.setup url: "http://localhost:3000" do |c|
  c.use Faraday::Request::UrlEncoded
  c.use Her::Middleware::DefaultParseJSON
  c.use Faraday::Adapter::NetHttp
end

class Project
  include Her::Model

  parse_root_in_json true, format: :active_model_serializers

  has_many :tasks
end

class Task
  include Her::Model

  parse_root_in_json true, format: :active_model_serializers

  belongs_to :project
end

Project.find(1)
# => #<Project(projects/1) name="Shop list" task_ids=[2, 8] id=1>

Project.find(1).tasks
# Exception Her::Errors::ParseError because it tries to access /products/1/tasks

{% endhighlight %}

Wouldn't it be nice to be able to consume the above API data together with the relations, just like ember-data does? So I wrote a custom parser for Her, which helps Her resolve the relations: [ember_data_active_model_parser](https://github.com/valo/ember_data_active_model_parser). Include the gem in your Gemfile, replace the default JSON parser and you are good to go:

{% highlight ruby %}
Her::API.setup url: "http://localhost:3000" do |c|
  c.use Faraday::Request::UrlEncoded

  # A custom JSON parser
  c.use EmberDataActiveModelParser::Middleware
  
  c.use Faraday::Adapter::NetHttp
end

# Use the same model definitions as the example above

Project.find(1)
# => #<Project(projects/1) name="Shop list" id=1 tasks=[...]>

Project.find(1).tasks
# => [#<Task(tasks/2) name="Water" completed=true id=2 project=#<Project(projects/1) name="Shop list" ...>>, #<Task(tasks/8) name="Bread" completed=false id=8 project=#<Project(projects/1) name="Shop list" ...>>]
{% endhighlight %}

## Example projects

You can checkout the example projects I setup:

* Rails app with EmberJS front-end: [ember_rails_api_example](https://github.com/valo/ember_rails_api_example)
* Rails app which uses Her to consume the data from the first app: [ember_rails_api_consumer](https://github.com/valo/ember_rails_api_consumer)

This is the first version of the parser, so there is a lot of room for improvement. If you find it useful, please open an issue with any suggestions or bugs you find!
