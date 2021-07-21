---
title: "What I'm Loving About JavaScript"
date: "2021-07-21"
tags: ["Javascript", "Tech", "Learning", "Python"]
tldr: "With a move over to web development I've been studying up on my JavaScript. Having mostly developed in Python I've been pondering on the differences and loving all things JS right about now."
---

Having spent years developing various bits of software in python I'm surprised how similar I'm finding JavaScript. For sure, I'm still digging around the basic syntax but this base knowledge has me eagering awaiting all the use cases I can apply this too!!

This post took me sometime to pull together. I wanted to do it all justice and be as accurate as possible. I'm learning everyday so this blog entry is already pretty outdated but I wanted to point out some key difference and explain why I'm loving JS so god darn much!

A lot of this post is comparisons against my base knowledge of Python.

## Nice in Comparison
### Falseness
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

### Parentheses and Braces

I'm not going to lie and say I loved it straight away and I think a stint using C# helped but I'm now loving parentheses and braces! I used to love how python enforced a standard code structure by essentially using indentation to start and end various blocks but there's nothing more frustrating then finding out the reason your code didn't work correctly is because of a few missing spaces. Don't get me wrong, I'm sure it's just as irritating finding your coding isn't working due to parentheses BUT ... IDEs are pretty good at reminding you about brackets and tend to be pretty duff with indentation.

Come on though, even conditional blocks wrapped in parentheses just look and read so much better!

```
if (you_like_explicit_code_formatting) {
  console.log("you will LOVE JavaScript!")
}
```

I think it does come down to personal taste a little but I actually think it's one of those things coders love. Python is so accessible and a nice first language. At first there's so many other things to remember and the chances of being caught out by indentation is pretty low (you'll likely only be working at a couple of levels).

```
if you_dont_want_a_minimal_braces_syntax:
    print "Python 2 is for you"
```

Even Python 3 comes with more parentheses and braces so I must be on to something...

### No More KeyError or AttributeError

I've got to be honest, I'm loving the dot and bracket notation for accessing object properties in JavaScript. But what I'm loving even more is it's default behaviour `undefined`. No more `obj.get()` or wrapping `obj[key]` in ugly nested try/except statements for me!

### Async Out The Box!

I can't describe how much I'm loving this. For anyone that's dug around my Github I've written little snippets in python that aim to remove the [single-threaded nature](https://www.github.com/adamsuk/pyStuff/tree/main/multi_proc.py) but in all honesty that's not really comparing apples with apples. What javascript provides out the box is insane! I've got a lot of learning but I'm loving `promise`, `await` and `async`!

### Variable Declarations

So one of the things I equally love and hate about Python is how open variable assignment is. It's kind of insane actually. You can easily do something like this:
```
function print(msg):
    with open("print.txt", "w+") as f:
        f.write(msg)
```
and I can fundamentally change what an inbuilt function does!? This can cause MASSIVE issues in large projects with complex imports, something, somewhere could be changing something you intrinsically rely on.

With JS (ES6 in particular) introduces some pretty awesome variable definitions. Introducing `const`, `var` and `let`. Why am I loving these? Well ...

`const` - by far my favourite. I'm so used to anything being up for grabs and capable of being reassigned that being able to make any variable immutable is massive. Let me type that again for you Python devs ... I can make ANY variable IMMUTABLE! This includes functions ...

`var` - mutable variable definitions. I'm not going to lie it's a little annoying having to define what I'm used to as default in Python, but having the alternatives far outweigh this slight annoyance.

`let` - no more redeclared variables with this bad boy. My best use case for this is for unassigned scoped variables. And `let my_var` is much neater than `my_var = None`. So this makes up for the `var` definitions scattered about my code.


## What I Miss

### MATHS!

I never thought I'd say this because learning it was like hell (it's basically a language of its own) but I miss pandas. Most of my experience with Python was due to the need to deal with large amounts of data. From large amounts of pre-processing to manipulation of time series datasets... pandas made it easy! With JS trying to implement a simple equation is a nightmare.

But it's the right tool for what I'm doing now. It's just a pitfall for an otherwise awesome language.

## Summary

There's a lot of stuff here. Some of it opinion and personal preference so just try it for yourself.

I'm loving JS now but would I have used it previously in place of Python ... now. Python was the right tool for the job for a data-heavy solution. Would I trade JS for Python (utilising some web framework like Django) ... hell no!

JavaScript is cool as.