#!/bin/bash

VER=7.0
REPO="default-route-openshift-image-registry.apps.cp4apps.cloudpak.site/default"

docker build -t webserver-files:${VER} -f Dockerfile-file .
docker build -t webserver-env:${VER} -f Dockerfile-env .
docker tag webserver-files:${VER} ${REPO}/webserver-files:${VER}
docker tag webserver-env:${VER} ${REPO}/webserver-env:${VER}

docker push ${REPO}/webserver-files:${VER}
docker push ${REPO}/webserver-env:${VER}