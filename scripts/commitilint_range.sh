#!/usr/bin/env bash
# based on https://github.com/wilau2/circleci-commitlint-step/blob/master/commitlint_range.sh

set -euo pipefail

PULL_REQUEST_NUMBER=$(echo "${CIRCLE_PULL_REQUEST}" | cut -d/ -f7)
UPSTREAM_PROJECT_USERNAME=$(echo "${CIRCLE_PULL_REQUEST}" | cut -d/ -f4)
CURL_URL="https://api.github.com/repos/${UPSTREAM_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/pulls/${PULL_REQUEST_NUMBER}"
PULL_REQUEST_DETAILS=$(curl ${CURL_URL})

FROM=$(echo "${PULL_REQUEST_DETAILS}" | jq -r .base.sha)
TO=$(echo "${PULL_REQUEST_DETAILS}" | jq -r .head.sha)

yarn commitlint --from "$FROM" --to "$TO"
