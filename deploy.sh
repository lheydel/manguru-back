#!/bin/bash
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_LOGIN" --password-stdin 
docker build . --tag=manguru-back
docker tag manguru-back louec/manguru:back-$1
docker push louec/manguru:back-$1