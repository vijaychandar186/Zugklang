#!/bin/bash

set -e

script_dir=$(dirname "$(readlink -f "$BASH_SOURCE")")
target=${1:-cpu}
shift || true

case "$target" in
    cpu)
        docker build --build-arg TARGET="" -t kaladin:latest "$script_dir"
        docker run -it --rm --network=host --name=kaladin kaladin:latest "$@"
        ;;
    gpu)
        docker build --build-arg TARGET="-gpu" -t kaladin:gpu "$script_dir"
        docker run -it --rm --network=host --gpus all --name=kaladin kaladin:gpu "$@"
        ;;
    dev)
        docker build --build-arg TARGET="" -t kaladin:latest "$script_dir"
        docker run -it --rm --network=host --name=kaladin --entrypoint bash kaladin:latest
        ;;
    *)
        echo "Usage: $0 [cpu|gpu|dev]"
        exit 1
        ;;
esac
