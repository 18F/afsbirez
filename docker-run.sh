# After docker-build-image.sh creates a Docker image, use this to run it
# defaults to running image `afsbirez`, but uses arg instead if supplied
DOCKER_IMAGE=$1
docker run --rm -ti -e DISPLAY=$DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix -v $PWD:/home/developer/app ${DOCKER_IMAGE:="afsbirez"} /bin/bash
