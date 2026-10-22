# How This Works

## What This Calculates

The probability that each apostle will serve as President (Prophet) of The Church of Jesus Christ of Latter-Day Saints on any given date over the next 30 years.

The grey line, "A future apostle," is the probability that every current apostle has passed away by then, so the President is someone not yet called as an apostle.

## How It Works

An apostle becomes President when:

1. All apostles senior to them have passed away
2. They are still living

For each apostle, we calculate the probability of both conditions being met on dates 90 days apart over the next 30 years.

## Data Sources

- **Ordination dates**: Publicly available church records
- **Birth dates**: Publicly available church records
- **Mortality data**: Social Security Administration [2023 period life table](https://www.ssa.gov/oact/STATS/table4c6.html) for U.S. males, from the 2026 Trustees Report

## Key Assumptions

- Succession follows apostolic seniority, the order in which the apostles were ordained
- No early resignations or unforeseen circumstances
- Apostles die at lower rates than U.S. men their age. The gap is widest in their 60s and 70s and closes by about age 98, which fits their record: from 1995 to 2026, 14 apostles died where U.S. rates would predict about 31
- Each apostle's death is independent of the others

## Limitations

- Statistical model cannot account for individual health conditions
- Shows probabilities, not predictions
- Cannot predict unforeseen circumstances

## Technical Information
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### How the code is organized

- `src/data/apostles.json`: the living apostles, ranked by seniority, with the date the list was last checked (`asOf`)
- `src/data/actuarialLifeTable.json`: SSA male death probabilities by age
- `src/lib/roster.ts`: loads and checks the apostle list
- `src/lib/mortality.ts`: survival probabilities from the life table, scaled for apostles
- `src/lib/forecast.ts`: each apostle's probability of being President on each date
- `src/app/api/results/graph/route.ts`: serves the forecast to the chart, refreshed daily

### Updating the apostle list

When an apostle dies or a new one is called, edit `src/data/apostles.json`: remove or add the apostle, renumber `seniority` so it runs 1, 2, 3, ... from the most senior, and set `asOf` to the date you checked. Apostles ordained on the same day are ranked in the order they were ordained. The list is checked when the app loads it, and `npm test` fails if it is inconsistent.

### Tests

```bash
npm test
```

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
