#!/usr/bin/env bash
# based on https://github.com/wilau2/circleci-commitlint-step/blob/master/commitlint_range.sh

set -euo pipefail

if [ -n "${CIRCLE_PULL_REQUEST}" ]
then
  PULL_REQUEST_NUMBER=$(echo "${CIRCLE_PULL_REQUEST}" | cut -d/ -f7)
  UPSTREAM_PROJECT_USERNAME=$(echo "${CIRCLE_PULL_REQUEST}" | cut -d/ -f4)
  CURL_URL="https://api.github.com/repos/${UPSTREAM_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/pulls/${PULL_REQUEST_NUMBER}"
  PULL_REQUEST_DETAILS=$(curl ${CURL_URL})

  BASE_SHA1=$(echo "${PULL_REQUEST_DETAILS}" | jq -r .base.sha)
  HEAD_SHA1=$(echo "${PULL_REQUEST_DETAILS}" | jq -r .head.sha)

  COMMIT_RANGE="${BASE_SHA1}...${HEAD_SHA1}"
else
  COMMIT_RANGE=$(echo "${CIRCLE_COMPARE_URL}" | cut -d/ -f7)
  FIRST_COMMIT=$(echo "${COMMIT_RANGE}" | cut -d. -f1)
  if ! git cat-file -e ${FIRST_COMMIT}; then
    COMMIT_RANGE=origin/master...${CIRCLE_SHA1}
  fi
fi

git log ${COMMIT_RANGE} --pretty=%B | npx commitlint
