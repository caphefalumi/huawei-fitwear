# Security Policy

VoocHealth handles authentication and personal health data, so security reports are taken seriously.

## Supported versions

Only the latest commit on `main` is supported. There are no maintained release branches; fixes land on `main` and are deployed from there.

## Reporting a vulnerability

**Do not open a public issue, pull request, or discussion for a security problem.**

Report it privately through GitHub Security Advisories:

1. Go to the [Security tab](https://github.com/caphefalumi/huawei-fitwear/security/advisories/new).
2. Describe the issue, affected component (`apps/mobile`, `apps/backend`, `apps/watch`, or CI), impact, and reproduction steps.
3. Include proof-of-concept details only if they are needed to reproduce the issue. Do not include real user data or credentials.

If GitHub Advisories is unavailable, email **dangduytoan13l@gmail.com** with the subject `Security report: huawei-fitwear`.

## What to expect

- Acknowledgment of the report within 7 days.
- An assessment of severity and a proposed fix timeline after triage.
- Credit in the advisory once a fix is published, unless you ask to remain anonymous.

Please give a reasonable window to ship a fix before disclosing the issue publicly.

## Scope

In scope:

- Authentication and session handling in `apps/backend`
- Authorization or data-isolation flaws exposing another user's records
- Secrets, tokens, or credentials committed to the repository or leaked by CI
- Injection, SSRF, or unsafe deserialization in API handlers
- Client-side storage of health data in `apps/mobile` and `apps/watch`

Out of scope:

- Vulnerabilities in third-party services (Cloudflare, Expo, Huawei) — report those upstream
- Social engineering, physical access, or denial of service through traffic volume
- Reports produced only by automated scanners with no demonstrated impact
- Missing hardening headers with no exploitable path

## Handling secrets

Never paste secret values into an issue, PR, or advisory. If a secret is committed, rotate it first, then report so history and caches can be cleaned up.
