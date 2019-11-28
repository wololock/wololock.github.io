FROM node:10-slim

RUN apt-get update \
    && apt-get install -y git openssh-client libpng-dev \
    && npm --version \
    && npm install -g hexo-cli

WORKDIR /home/node/blog
