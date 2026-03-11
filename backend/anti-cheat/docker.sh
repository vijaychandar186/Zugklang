#!/bin/bash

target=${1:-cpu}
shift
docker_dir=$(dirname "$(readlink -f "$BASH_SOURCE")")

if [ "$target" = "cpu" ]
then
    docker build -t anti-cheat "$docker_dir" && \
    docker run -it --rm \
        --network=host \
        --name=anti-cheat \
        anti-cheat "$@"
elif [ "$target" = "gpu" ]
then
    docker build -f Dockerfile.gpu -t anti-cheat-gpu "$docker_dir" && \
    docker run -it --rm \
        --network=host \
        --gpus all \
        --name=anti-cheat \
        anti-cheat-gpu "$@"
else
    echo "target can only be cpu or gpu, not $target"
    exit 1
fi
