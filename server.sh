#!/usr/bin/env bash

CMD="hexo"

if ! hash $CMD 2>/dev/null; then
    CMD="./hexo.sh"
fi

$CMD server --config _config.yml,_config.local.yml
