#!/usr/bin/env bash

aws cloudformation deploy --template-file template.yml --stack-name dev-oc-papersubmission-angular-ui --parameter-override GithubToken="${GITHUB_TOKEN}" UIBucket="${UI_BUCKET}" --capabilities CAPABILITY_NAMED_IAM
