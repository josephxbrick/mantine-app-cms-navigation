---
name: deploy-stage
description: Use when the user asks to deploy this repo to the stage/staging site, run the staging deploy, or deploy to AWS stage; exports the stage-cms AWS profile and runs npm run deploy:stage.
---

# Deploy Stage

Use this skill to deploy the current repo to the stage site.

## Workflow

1. Inspect repo state.
   - Run `git status --short --branch`.
   - If there are unexpected uncommitted source or docs changes, pause and ask before deploying.
   - Known local demo image artifacts may be left uncommitted if already identified by the user/session.

2. Confirm the AWS CLI profile works when needed.
   - Use profile `stage-cms`.
   - If AWS identity has not been checked in this session, run:
     `aws sts get-caller-identity --profile stage-cms`
   - Do not print secrets. It is okay to summarize that identity lookup returned a user/account/ARN.

3. Deploy.
   - Run:
     `AWS_PROFILE=stage-cms npm run deploy:stage`
   - The repo deploy script defaults to `stage.josephbrick.com` for the S3 bucket and CloudFront alias.
   - Do not set `AWS_STAGE_BUCKET` or `AWS_CLOUDFRONT_ALIAS` unless the user explicitly asks for a different target.

4. Verify and report.
   - Report whether build, S3 sync, and CloudFront invalidation succeeded.
   - Include the deployed URL: `https://stage.josephbrick.com`.
   - If the deploy creates or changes tracked build artifacts, inspect `git status --short --branch` and ask before committing anything.

## Guardrails

- Do not deploy if the branch has unexpected uncommitted source changes.
- Do not deploy to production from this skill.
- Do not expose AWS access keys, secret keys, session tokens, or full credential file contents.
