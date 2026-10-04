# Muji Hotel

A modern hotel booking platform built with Next.js, Sanity CMS, and Stripe for payments.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Security

This project maintains security best practices with regular dependency audits.

### Running Security Audits

```bash
# Quick summary of vulnerabilities by severity
npm run audit:summary

# Full audit report
npm run audit:full

# Check for moderate+ severity issues (recommended for CI/CD)
npm run audit:check
```

The current dependency tree is checked in with patched `adm-zip` and `smol-toml`
transitive dependencies. npm still reports high-severity advisories for the
current compatible Sanity and Next.js ESLint dependency ranges, including
`braces` through `chokidar` and `micromatch`. The current npm release of
`braces` is `3.0.3`, which is also the version required by those packages, so
there is no compatible upstream fix to apply without a breaking downgrade.
Re-run the audit commands after dependency updates and remove this note when
the upstream packages release compatible fixes.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
