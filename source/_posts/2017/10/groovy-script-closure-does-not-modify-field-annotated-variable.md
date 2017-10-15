---
title: 'Groovy script: closure does not modify @Field annotated variable'
s: groovy-script-closure-does-not-modify-field-annotated-variable
date: 2017-10-08 09:39:12
tags:
    - groovy
    - groovy-2.4
    - metaprogramming
    - stackoverflow
categories:
    - Tales from debugger
cover: /img/post-debugger.jpg
---

Recently I have answered a few questions on Stack Overflow related to Groovy scripts and how they work in combination with 
closures and delegated objects. Some of use cases may not be intuitive and today I'm gonna show you one of them and
explain what happens under the hood.    

<!-- more -->

Let's consider following Groovy script:

```groovy
import groovy.transform.Field

@Field int number = 15

println "Current number value is ${number}"

def body = {
    number++
    println "n: ${number}"
}

10.times body

println "Current number value is ${number}"

```

Running this script (Groovy 2.4.12) produces following output:

    Current number value is 15
    n: 16
    n: 17
    n: 18
    n: 19
    n: 20
    n: 21
    n: 22
    n: 23
    n: 24
    n: 25
    Current number value is 15

It may look counterintuitive and we could expect last line saying that the current number value is `25`. So what's going on?

## Extending `groovy.lang.Script`

First thing we need to understand is that every Groovy script is compiled to a class that extends [`groovy.lang.Script`](http://docs.groovy-lang.org/2.4.12/html/api/groovy/lang/Script.html).
Assuming that the script I've shown above is named `incrementing_number.groovy` then the compiled Java class would look like this:

```groovy
import groovy.lang.Binding;
import groovy.lang.Closure;
import groovy.lang.Script;
import org.codehaus.groovy.runtime.GStringImpl;
import org.codehaus.groovy.runtime.GeneratedClosure;
import org.codehaus.groovy.runtime.InvokerHelper;
import org.codehaus.groovy.runtime.ScriptBytecodeAdapter;
import org.codehaus.groovy.runtime.callsite.CallSite;

public class incrementing_number extends Script {
    Integer number;

    public incrementing_number() {
        CallSite[] var1 = $getCallSiteArray();
        byte var2 = 0;
        this.number = Integer.valueOf(var2);
    }

    public incrementing_number(Binding context) {
        CallSite[] var2 = $getCallSiteArray();
        super(context);
        byte var3 = 0;
        this.number = Integer.valueOf(var3);
    }

    public static void main(String... args) {
        CallSite[] var1 = $getCallSiteArray();
        var1[0].call(InvokerHelper.class, incrementing_number.class, args);
    }

    public Object run() {
        // implementation of a run() method here
    }
}

``` 

Second thing - in this example we used `@Field` annotation on purpose in line 3. According to [class Javadoc documentation](http://docs.groovy-lang.org/2.4.12/html/gapi/groovy/transform/Field.html):

> Variable annotation used for changing the scope of a variable within a script from being within the run method of the script to being at the class level for the script.
  
> The annotated variable will become a private field of the script class. The type of the field will be the same as the type of the variable. Example usage:
  
>     import groovy.transform.Field
>     @Field List awe = [1, 2, 3]
>     def awesum() { awe.sum() }
>     assert awesum() == 6
   
> In this example, without the annotation, variable awe would be a local script variable (technically speaking it will be a local variable within the run method of the script class). Such a local variable would not be visible inside the `awesum` method. With the annotation, `awe` becomes a private List field in the script class and is visible within the `awesum` method.  

That's why in compiled Java class we can find `Integer number` class field. The rest of the script body gets executed in `Script.run()` method.

## Calling closure inside Groovy script

Now let's investigate why closure `body` increments a `number` but does not modify the variable outside the closure. First thing we need to understand is
that [every closure has an `owner`](http://groovy-lang.org/closures.html#closure-owner) - an enclosing object that defines a closure. In this case `body.owner` property points to `incrementing_number` class instance. 
Closure ownership is also connected to delegation - Groovy's mechanism that allows us e.g. to delegate execution
of non-existing methods to other object by setting `obj.delegate` property. Groovy also defines [delegation strategy](http://groovy-lang.org/closures.html#_delegation_strategy_2) - 
an order in which delegation is resolved. The default strategy is `Closure.OWNER_FIRST` which is important to mention in our case.

Now we have to get back for a moment to `groovy.lang.Script` class. It overrides, inter alia, those two methods:

```groovy
    public Object getProperty(String property) {
        try {
            return binding.getVariable(property);
        } catch (MissingPropertyException e) {
            return super.getProperty(property);
        }
    }

    public void setProperty(String property, Object newValue) {
        if ("binding".equals(property))
            setBinding((Binding) newValue);
        else if("metaClass".equals(property))
            setMetaClass((MetaClass)newValue);
        else
            binding.setVariable(property, newValue);
    }
``` 

<small>*Source: https://github.com/apache/groovy/blob/GROOVY_2_4_X/src/main/groovy/lang/Script.java#L54*</small>

Groovy uses `getProperty(String property)` method any time we try to access class field and uses `setProperty(String property, Object newValue)`
method any time we try to modify class field value. Our script class inherits this behavior. And because closure stored in
`body` variable is owned by script class instance, reading or modifying any variable goes through those two methods.

`groovy.lang.Script` class also introduces a [binding mechanism](http://docs.groovy-lang.org/latest/html/api/groovy/lang/Binding.html).
As you can see both `getProperty` and `setProperty` methods use `binding` field to read and store variables. When trying to read a variable
that does not exist in `binding` internal variables map then it is passed to `GroovyObjectSupport.getProperty(String property)` method which returns a 
value associated to `number` class field. And this is the value that is passed next to `setProperty(String property, Object newValue)`
method and that's how `number` variable shows up in binding object with its initial value. When we iterate 10 times and increment
`numbers` we actually increment the value hold in binding's map and not a class field. That's why this Groovy script shown
in the beginning says in the end that:

    Current number value is 15 
   
I hope this blog post will help you understanding what happens under the hood when using Closures inside a Groovy script.
This post was inspired by following Stack Overflow answer: [Groovy 2.4 variable scope in closure with @Field annotation](https://stackoverflow.com/questions/46579944/groovy-2-4-variable-scope-in-closure-with-field-annotation/46580819#46580819)


