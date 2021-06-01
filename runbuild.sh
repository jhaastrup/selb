#!/usr/bin/env bash

set -e

folder=.
BASE=gcr.io/sendbox-go
while getopts v:b:c:d: option
do
 case "${option}" in
  b) BASE=${OPTARG};;
  v) VERSION=${OPTARG};;
  c) CACHE=${OPTARG};;
  d) PULL=${OPTARG};;
 esac
done

case ${VERSION-} in '') echo "$0: VERSION is mission. Please provide a valid version with -v" >&2; exit 1;; esac

case ${CACHE-} in '--no-cache') echo "$CACHE: Using No Cache";; esac
case ${PULL-} in '--pull') echo "$PULL: pulling clean";; esac

cache=${CACHE-}
pull=${PULL-}

a="webapp"
name="$(echo $a | tr '[A-Z]' '[a-z]')"
echo $name

#cd $filename
tag=gcr.io/sendbox-go/webapp:$VERSION
echo "Building" $tag
git stash
git pull
comm="build . -t $tag $cache $pull"
echo $comm
docker build . -t $tag $cache $pull
docker push $tag
cd ..

