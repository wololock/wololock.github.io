#!/usr/bin/env bash

DOCKER_IMAGE="eprintstacktraceblog:local"

if [[ "$(docker images -q $DOCKER_IMAGE 2> /dev/null)" == "" ]]; then
  docker build -t $DOCKER_IMAGE .
fi

docker run --rm -u $(id -u) -p 4000:4000 -v $(pwd):/home/node/blog $DOCKER_IMAGE hexo "$@"