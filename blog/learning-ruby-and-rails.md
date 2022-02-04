---
title: "Learning Ruby & Ruby on Rails"
date: "2022-01-19"
tags: ["Ruby", "Tech", "Learning", "Rails", "RoR"]
tldr: "With a change of jobs I've been studying up on my Ruby. Not only that but after using Nextjs, Expressjs and FastAPI I'm now delving into Rails!"
---

Firstly, it's been far too long! I need to write a completely separate post about the latter half of 2021, I won't delve into that here! This blog is all about my learnings with Ruby and Rails! Exciting stuff.

This is by no means a "how-to" guide on learning Ruby, instead it's more of a "how I learnt Ruby". It might be useful as a little "gotcha" guide but other than that this is a purely selfish post all for ME!

## Noticable Syntax Differences
Just a little interesting syntax stuff:
- Objects have an ~inspect~ method. It seems pretty comparable to `to_s` expect for `nil` where the conversion to a string is `""` but on inspect it's `"nil"` ... interesting
- Double arrows on an `Array` pushes a value to the last element, NICE!
- `:` 👀 ... ok this is different. We've got ourselves a new base type `Symbols` by the looks of things. Immutable strings for object keys, but a new base type so definitely not strings?!? I'm in!! Coming from a land of Javascript and Python the use of `:` keeps getting me!
- Array slicing is `array[_start_index, _length]` not start to end index! To do that you use `array[_start_index.._end_index`] for inclusive and `array[_start_index..._end_index]` to exclude `_end_index`.
- Array `pop` is as expected but need to remember `shift` and `unshift`!
- Hash looks like a python dictionary or javascript object to me with a [couple of differences](https://medium.com/@asiddiqui0692/are-hashes-in-ruby-the-same-as-objects-in-javascript-53bf7e4949c1)
- A non-existent Hash key returns `nil` similarly to `null` in Javascript. Use `hash.fetch(key)` to catch `KeyError` exceptions.
- [BLOCKS!](https://www.rubyguides.com/2016/02/ruby-procs-and-lambdas/) remind me of python lambdas
- Shovel (`<<`) over plus-equals (`+=`) ... this'll be a hard one to get out of ye ol' brain. (shovel modifies original variable)

There's always going to be little gotchas but what's really going to trip me up are the checks for empty variable types. I'm pretty much going to be reliant on trial/error and [cheatsheets](https://blog.arkency.com/2017/07/nil-empty-blank-ruby-rails-difference/) for a little while 😆

## Rails

On first glance it looks like a nice mixture of Django with a templating structure not too dissimliar from Jinja2. There's definitely a LOT but I understand the whole "rails" concept for this MVC approach.

One thing I need to get my head around are all the in-built methods, one being controller actions and their associated HTTP method and URL path. Luckily I found [this little cheatsheet](https://www.codecademy.com/article/standard-controller-actions).

I'm loving the boilerplate generators!! Similar to the inbuilt methods I just need to remember the important commands but 90% of the config is just given to you! Perfect. The true test will be updating an old rails app 👀

### Gotchas

- To `require` or not to `require` that is the question. By default rails requires a ton of stuff so classes and methods are pretty much available everywhere and anywhere ... except when they're not. One that keeps getting me is `helpers`.
- Rails-provided paths ... thanks rails for being ultra helpful but until I realise my paths have auto-generated variables I'm going to take a little longer setting up basic routing and redirects.

## Useful Links

[Koans](http://rubykoans.com/)

[Official Rails getting started guide](https://guides.rubyonrails.org/)

[Exceptions](https://www.honeybadger.io/blog/a-beginner-s-guide-to-exceptions-in-ruby/)

[Base Types](https://www.geeksforgeeks.org/ruby-data-types/)
