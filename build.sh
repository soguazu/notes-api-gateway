#!/usr/bin/env bash
# This script is meant to build and compile every protocolbuffer for each
# service declared in this repository (as defined by sub-directories).
# It compiles using docker containers based on Namely's protoc image
# seen here: https://github.com/namely/docker-protoc

set -e

REPOPATH=${REPOPATH-/opt/manifest}
CURRENT_BRANCH=${CIRCLE_BRANCH-"develop"}

# Helper for adding a directory to the stack and echoing the result
function enterDir {
  echo "Entering $1"
  pushd $1 > /dev/null
}

# Helper for popping a directory off the stack and echoing the result
function leaveDir {
  echo "Leaving `pwd`"
  popd > /dev/null
}



function makeChanges {
  target=${1%/}
  reponame="notes-manifest"

  rm -rf $REPOPATH/$reponame

  echo "Cloning repo: git@github.com:namely/$reponame.git"
  
  # Clone the repository down and set the branch to the automated one
  git clone https://${GIT_USERNAME}:${GIT_TOKEN}@github.com/cocoon-letters-limited/$reponame.git $REPOPATH/$reponame
  setupBranch $REPOPATH/$reponame

  echo $IMAGE_TAG

  envsubst < $REPOPATH/$reponame/templates/$target.template > $REPOPATH/$reponame/$target

  git config --global user.email "engineering.backroom@gmail.com"
  git config --global user.name "Admin"


  commitAndPush $REPOPATH/$reponame
   
}

function updateManifest {
  echo "Buidling service's protocol buffers"
  mkdir -p ./$REPOPATH

  makeChanges 'api-gateway.yml'
  
}

function setupBranch {
  enterDir $1

  echo "Creating branch"

  if ! git show-branch $CURRENT_BRANCH; then
    git branch $CURRENT_BRANCH
  fi

  git checkout $CURRENT_BRANCH

  if git ls-remote --heads --exit-code origin $CURRENT_BRANCH; then
    echo "Branch exists on remote, pulling latest changes"
    git pull origin $CURRENT_BRANCH
  fi

  leaveDir
}

function commitAndPush {
  enterDir $1

  git add -N .

  if ! git diff --exit-code > /dev/null; then
    git add .
    git commit -m "Updating manifest"
    git push origin HEAD
  else
    echo "No changes detected for $1"
  fi

  leaveDir
}


updateManifest