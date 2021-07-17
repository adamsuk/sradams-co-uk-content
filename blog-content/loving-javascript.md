---
title: "What I'm Loving About JavaScript"
date: "2021-07-04"
tags: ["Javascript", "Tech", "Learning", "Python"]
tldr: "With a move over to web development I've been studying up on my JavaScript. Having mostly developed in Python I've been pondering on the differences and loving all things JS right about now."
---

Having spent years developing various bits of software in python I'm surprised how similar I'm finding JavaScript. For sure, I'm still digging around the basic syntax but this base knowledge has me eagering awaiting all the use cases I can apply this too!!

A lot of this post is comparisons against my base knowledge of Python.

#### Nice In Comparison
##### Falseness
One thing I loved in Python is readability, particularly in conditional logic. Something like
```
if this_condition and not this_other_condition
```
is awesome, reads like English and is easily understood when you know it's evaluating the true and falseness of variables `this_condition` and `this_other_condition`. This falls down in readability when you only care about falseness
```
if not this_condition
```
isn't really the same and ends up being more broken English. This is where JavaScript is awesome because rather than deciphering broken English all you need to understand is what `!` does to a conditional block;
```
if (!this_condition)
```
reads the same to me as pythons trueness evaluation but gets inverted in my head due to `!`. Readability maintained, check.

##### Parentheses and Braces

I'm not going to lie and say I loved it straight away and I think a stint using C# helped but I'm now loving parentheses and braces! I used to love how python enforced a standard code structure by essentially using indentation to start and end various blocks but there's nothing more frustrating then finding out the reason your code didn't work correctly is because of a few missing spaces.

##### No More KeyError or AttributeError

I've got to be honest, I'm loving the dot and bracket notation for accessing object properties in JavaScript. But what I'm loving even more is it's default behaviour `undefined`. No more `obj.get()` or wrapping `obj[key]` in ugly nested try/except statements for me!

##### Async Out The Box!
I can't describe how much I'm loving this. For anyone that's dug around my Github I've written little snippets in python that aim to remove the [single-threaded nature](https://www.github.com/adamsuk/pyStuff/tree/main/multi_proc.py) but in all honesty that's not really comparing apples with apples. What javascript provides out the box is insane! I've got a lot of learning but I'm loving `promise`, `await` and `async`!
