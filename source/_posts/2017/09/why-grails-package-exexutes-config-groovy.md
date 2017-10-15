---
title: Why "grails package" executes Config.groovy file?
s: why-grails-package-exexutes-config-groovy-file
date: 2017-09-30 07:18:20
tags:
    - grails
    - grails-2.4
    - groovy
    - stackoverflow
categories:
    - Tales from debugger
cover: /img/post-debugger.jpg
---
This blog post is inspired by one of my recent Stack Overflow answers to following question: 
[Grails: why is the Config.groovy file executed during compilation?](https://stackoverflow.com/questions/46279525/grails-why-is-the-config-groovy-file-executed-during-compilation/46376893).
Here I'm going to show you step by step what makes `grails package` command executing `Config.groovy` script and how
I've managed to find the answer to that question.

<!-- more -->

### Grails 2.4 configuration files

According to following [Grails 2.4 documentation](http://docs.grails.org/2.4.4/guide/conf.html#config):

> For general configuration Grails provides two files:
>
>  * grails-app/conf/BuildConfig.groovy
>  * grails-app/conf/Config.groovy
>  
> Both of them use Groovy's [`ConfigSlurper`](http://docs.groovy-lang.org/2.4.6/html/gapi/groovy/util/ConfigSlurper.html) syntax. 
> The first, `BuildConfig.groovy`, is for settings that are used when running Grails commands, such as compile, doc, etc. 
> The second file, `Config.groovy`, is for settings that are used when your application is running. This means that 
> `Config.groovy` is packaged with your application, but `BuildConfig.groovy` is not. Don't worry if you're not clear 
> on the distinction: the guide will tell you which file to put a particular setting in. 

After reading such documentation you could run into assumption, that no matter what you put into `Config.groovy` file
it will get executed while running application only. Unfortunately - this is not true.

### Packaging Grails application

Let's investigate together what happens when we call `grails package` command. Every Grails command has a Groovy script 
associated. Those scripts are provided with Grails distribution. `package` command is represented by following Groovy script:

```groovy
/*
 * Copyright 2004-2005 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Gant script that packages a Grails application (note: does not create WAR).
 *
 * @author Graeme Rocher
 *
 * @since 0.4
 */

if (getBinding().variables.containsKey("_grails_package_called")) return
_grails_package_called = true

includeTargets << grailsScript("_GrailsCompile")
includeTargets << grailsScript("_PackagePlugins")

target(createConfig: "Creates the configuration object") {
    if (!binding.variables.containsKey("configLoaded")) {
        config = projectPackager.createConfig()
        configLoaded = true
    }
}

target(packageApp : "Implementation of package target") {
    depends(createStructure)
    grailsConsole.updateStatus "Packaging Grails application"
    profile("compile") {
        compile()
    }

    projectPackager.classLoader = classLoader

    try {
        config = projectPackager.packageApplication()
    }
    catch(e) {
        grailsConsole.error "Error packaging application: $e.message", e
        exit 1
    }

    configureServerContextPath()

    loadPlugins()
    generateWebXml()

    event("PackagingEnd",[])
}

target(configureServerContextPath: "Configuring server context path") {
    serverContextPath = projectPackager.configureServerContextPath()
}

target(startLogging:"Bootstraps logging") {
    depends(createConfig)
    projectPackager.startLogging(config)
}

target(generateWebXml : "Generates the web.xml file") {
    depends(classpath)
    projectPackager.generateWebXml(pluginManager)
}

target(packageTlds:"packages tld definitions for the correct servlet version") {
    projectPackager.packageTlds()
}

recompileCheck = { lastModified, callback ->
 // do nothing, here for compatibility
}
```
<small>*Source: [grails-scripts/src/main/scripts/_GrailsPackage.groovy](https://github.com/grails/grails-core/blob/2.4.x/grails-scripts/src/main/scripts/_GrailsPackage.groovy)*</small>

When you run `grails package` Grails executes target `packageApp` defined in line 38. In line 48 Grails uses 
[`GrailsProjectPackager.packageApplication()`](https://github.com/grails/grails-core/blob/2.4.x/grails-project-api/src/main/groovy/org/codehaus/groovy/grails/project/packaging/GrailsProjectPackager.groovy#L251)
that does the packaging. Inside this method there is a call to a `createConfig()` private method that in line 345 delegates
parsing of a configuration file to a [`ConfigSlurper.parse(configClass)`](https://github.com/grails/grails-core/blob/2.4.x/grails-project-api/src/main/groovy/org/codehaus/groovy/grails/project/packaging/GrailsProjectPackager.groovy#L345) method:

```groovy
config = configSlurper.parse(configClass)
```

<small>*Source: [org/codehaus/groovy/grails/project/packaging/GrailsProjectPackager.groovy](https://github.com/grails/grails-core/blob/2.4.x/grails-project-api/src/main/groovy/org/codehaus/groovy/grails/project/packaging/GrailsProjectPackager.groovy#L345)*</small>
 
`ConfigSlurper` does several things, but there is one line of code we are interested the most:

```groovy
script.run()
```

<small>*Source: [src/main/groovy/util/ConfigSlurper.groovy](https://github.com/groovy/groovy-core/blob/GROOVY_2_4_X/src/main/groovy/util/ConfigSlurper.groovy#L286)*</small>

This is our game changer. There is one thing worth mentioning here as well. `Config.groovy` is compiled to a Java class
that extends `groovy.lang.Script` class. Basically all Groovy scripts are represented that way in the bytecode - this class is 
simply a wrapper that provides `main` method that is executed by JVM. That's why `ConfigSlurper.parse(Script script, URL location)`
is used to parse `Config.groovy` file.

### Side effects

There is only one major side effect of this situation - expect that any business logic inside `Config.groovy` file will be executed.
This is not a problem in most cases, because this file is used mostly for a assigning values to a variables we can access with
`grailsApplication.config` reference. But if you put something like

```groovy
println "Lorem ipsum dolor sit amet"
```  

in the end of `Config.groovy` file, expect to see something like this when you package your Grails application:

    |Loading Grails 2.4.5
    |Configuring classpath
    .
    |Environment set to development
    ................................
    |Packaging Grails application
    ..
    |Compiling 10 source files
    
    ..
    |Compiling 107 source files
    
    .......
    |Compiling 8 source files
    .....Lorem ipsum dolor sit amet
    ...................Lorem ipsum dolor sit amet
    .
