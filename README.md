# Ingeniux CMS Navigation Prototype

This is a Vite, React, TypeScript, and Mantine prototype for exploring a redesigned Ingeniux CMS navigation shell.

## Local Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run build
npm run lint
```

## Staging Deploy

Deploy the current prototype to the staging CloudFront/S3 site:

```bash
npm run deploy:stage
```

The script:

- runs `npm run build`;
- syncs `dist/` to `s3://stage.josephbrick.com/` with stale files deleted;
- uploads objects with `public-read` ACLs because the CloudFront origin uses the S3 website endpoint;
- looks up the CloudFront distribution by the `stage.josephbrick.com` alias;
- invalidates `/*`.

The deploy assumes AWS CLI v2 is installed and configured. The deploy IAM policy needs S3 permissions for `ListBucket`, `PutObject`, `PutObjectAcl`, and `DeleteObject` on `stage.josephbrick.com`, plus CloudFront permissions for `ListDistributions`, `CreateInvalidation`, and `GetInvalidation`.

Optional overrides:

```bash
AWS_CLOUDFRONT_DISTRIBUTION_ID=ES6M0K6KPAGL3 npm run deploy:stage
AWS_STAGE_BUCKET=stage.josephbrick.com AWS_CLOUDFRONT_ALIAS=stage.josephbrick.com npm run deploy:stage
```
