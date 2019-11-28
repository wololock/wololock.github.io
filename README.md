[![CircleCI](https://badgen.net/circleci/github/wololock/wololock.github.io/master?icon=circleci&label)](https://circleci.com/gh/wololock/wololock.github.io/tree/develop)
[![GitHub last commit](https://badgen.net/github/last-commit/wololock/wololock.github.io)](https://github.com/wololock/wololock.github.io/commits/develop)
[![Uptime Robot ration (1 month)](https://badgen.net/uptime-robot/month/m780633622-b567414a67adfeceaedce453)](https://status.printstacktrace.blog/)
[![Uptime Robot response time](https://badgen.net/uptime-robot/response/m780633622-b567414a67adfeceaedce453)](https://status.printstacktrace.blog/)
[![Twitter](https://badgen.net/twitter/follow/wololock)](https://twitter.com/wololock)
[![Keybase](https://badgen.net/keybase/pgp/wololock)](https://keybase.io/wololock)

# e.printstacktrace.blog 

This repository contains a source code of my blog [https://e.printstacktrace.blog](https://e.printstacktrace.blog)

![](https://i.imgur.com/SmwJVRyl.png)

## Running local blog using Docker

You can start Hexo server using Docker container with the following command:

```
$ ./hexo.sh server --config _config.yml,_config.local.yml
```

It will check if the docker image `eprinstacktraceblog:local` exists, and if not, it will generate one.

```
$ docker images eprintstacktraceblog:local   
REPOSITORY             TAG                 IMAGE ID            CREATED             SIZE
eprintstacktraceblog   local               eb7311f8fca5        2 minutes ago       268 MB
```

```
$ ./hexo.sh server --config _config.yml,_config.local.yml
INFO  Config based on 2 files
[Browsersync] Access URLs:
 ----------------------------------
          UI: http://localhost:3001
 ----------------------------------
 UI External: http://localhost:3001
 ----------------------------------
INFO  Start processing
INFO  Hexo is running at http://localhost:4000 . Press Ctrl+C to stop.
```



