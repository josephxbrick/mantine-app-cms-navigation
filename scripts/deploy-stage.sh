#!/usr/bin/env bash
set -euo pipefail

BUCKET="${AWS_STAGE_BUCKET:-stage.josephbrick.com}"
DIST_DIR="${AWS_STAGE_DIST_DIR:-dist}"
CF_ALIAS="${AWS_CLOUDFRONT_ALIAS:-stage.josephbrick.com}"
CF_DISTRIBUTION_ID="${AWS_CLOUDFRONT_DISTRIBUTION_ID:-}"
INVALIDATION_PATHS="${AWS_CLOUDFRONT_INVALIDATION_PATHS:-/*}"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required but was not found." >&2
  exit 1
fi

if ! command -v aws >/dev/null 2>&1; then
  echo "AWS CLI is required but was not found." >&2
  exit 1
fi

echo "Building production assets..."
npm run build

if [ ! -d "$DIST_DIR" ]; then
  echo "Build output directory '$DIST_DIR' was not found." >&2
  exit 1
fi

if [ -z "$CF_DISTRIBUTION_ID" ]; then
  echo "Looking up CloudFront distribution for alias '$CF_ALIAS'..."
  CF_DISTRIBUTION_ID="$(
    aws cloudfront list-distributions \
      --query "DistributionList.Items[?Aliases.Items && contains(Aliases.Items, '$CF_ALIAS')].Id | [0]" \
      --output text
  )"
fi

if [ -z "$CF_DISTRIBUTION_ID" ] || [ "$CF_DISTRIBUTION_ID" = "None" ]; then
  echo "CloudFront distribution was not found." >&2
  echo "Set AWS_CLOUDFRONT_DISTRIBUTION_ID or AWS_CLOUDFRONT_ALIAS and try again." >&2
  exit 1
fi

echo "Syncing '$DIST_DIR/' to 's3://$BUCKET/' and deleting stale files..."
aws s3 sync "$DIST_DIR/" "s3://$BUCKET/" --delete --acl public-read

echo "Invalidating CloudFront distribution '$CF_DISTRIBUTION_ID' paths: $INVALIDATION_PATHS"
aws cloudfront create-invalidation \
  --distribution-id "$CF_DISTRIBUTION_ID" \
  --paths "$INVALIDATION_PATHS"

echo "Deploy complete."
