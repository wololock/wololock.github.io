---
title: 'Ratpack: register SessionModule in handler unit test'
date: 2018-06-26 22:55:38
tags:
    - ratpack
    - groovy
    - spock
    - unit tests
categories:
    - Ratpack Cookbook
---

Unit testing Ratpack handlers has many benefits. In the previous post we have learned how to {% post_link ratpack-mocking-Session-object-in-GroovyRequestFixture-test mock Session object %}
to use it with [`GroovyRequestFixture`](https://ratpack.io/manual/1.5.4/api/ratpack/groovy/test/handling/GroovyRequestFixture.html). Today instead of mocking
we will register `SessionModule` and then we will use a real session object.

<!-- more -->
