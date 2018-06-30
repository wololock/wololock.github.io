---
title: 'Groovy: split string and avoid getting IndexOutOfBoundsException'
date: 2018-06-30 22:48:16
tags:
    - groovy
categories:
    - Programming tips
---

If you use Groovy for scripting or other similar tasks you probably faced a situation where you 
get an input as a text and you need to process it e.g. split by some delimiter and continue working
with extracted values. In this post I will show you how to do it in 3 different ways.

<!-- more -->

### Preparation

Let's start with defining input data and expected result. We will use following simple text input:
    
    1;Joe Doe;joedoe@example.com
    2;Paul Doe;pauldoe@example.com
    3;Mark Doe
    4;Clark Doe;clarkdoe@example.com;2
    
This is a CSV-like input. We will iterate over each line, split by `;` and generate output similar to:

    id: 1, name: Joe Doe, email: joedoe@example.com, sibling: null
    id: 2, name: Paul Doe, email: pauldoe@example.com, sibling: null
    id: 3, name: Mark Doe, email: null, sibling: null
    id: 4, name: Clark Doe, email: clarkdoe@example.com, sibling: 2
    
    
### Ex. 1: Use `List.get(int index)` to extract values

This is the most Java-like way to do it. `List.get(int index)` method has one significant drawback -
it throws `IndexOutOfBoundsException` when we are trying to get a value for non existing index. 
In our case only line 4 contains all 4 expected values, so for all other cases we have to be careful 
and prevent this exception from throwing.

```groovy
def text = '''1;Joe Doe;joedoe@example.com
2;Paul Doe;pauldoe@example.com
3;Mark Doe
4;Clark Doe;clarkdoe@example.com;2
'''

text.eachLine { line ->
    def arr = line.tokenize(';')

    println "id: ${arr.size() > 0 ? arr.get(0) : null}, name: ${arr.size() > 1 ? arr.get(1) : null}, email: ${arr.size() > 2 ? arr.get(2) : null}, sibling: ${arr.size() > 3 ? arr.get(3) : null}"
}
```

### Ex.2: Use Groovy subscript operator

The previous example looks like there is something wrong with it. Luckily Groovy [overrides index operator
for lists](https://github.com/apache/groovy/blob/GROOVY_2_4_15/src/main/org/codehaus/groovy/runtime/DefaultGroovyMethods.java#L7246) and it makes expressions like `arr[4]` safe from `IndexOutOfBoundsException`.
Thanks to this feature we can simplify the previous example to:

```groovy
def text = '''1;Joe Doe;joedoe@example.com
2;Paul Doe;pauldoe@example.com
3;Mark Doe
4;Clark Doe;clarkdoe@example.com;2
'''

text.eachLine { line ->
    def arr = line.tokenize(';')

    println "id: ${arr[0]}, name: ${arr[1]}, email: ${arr[2]}, sibling: ${arr[3]}"
}
```

### Ex.3: Use Groovy multiple assignment feature

There is even more Groovy way to get this job done - using [multiple assignment](http://groovy-lang.org/semantics.html#_multiple_assignment) feature.
It allows us to forget about that tokenize produces a list and we can assign a result of this operation
directly to a named variables and Groovy will assign `null` if the value for given variable does not exist.

```groovy
def text = '''1;Joe Doe;joedoe@example.com
2;Paul Doe;pauldoe@example.com
3;Mark Doe
4;Clark Doe;clarkdoe@example.com;2
'''

text.eachLine { line ->
    def (id, name, email, sibling) = line.tokenize(';')

    println "id: ${id}, name: ${name}, email: ${email}, sibling: ${sibling}"
}
``` 
