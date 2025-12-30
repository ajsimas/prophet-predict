# How This Works

## What This Calculates

The probability that each apostle will serve as President (Prophet) of The Church of Jesus Christ of Latter-Day Saints on any given date over the next 30 years.

## How It Works

An apostle becomes President when:

1. All apostles ordained before them have passed away
2. They are still living

For each apostle, we calculate the probability of both conditions being met for each day over the next 30 years.

## Data Sources

- **Ordination dates**: Publicly available church records
- **Birth dates**: Publicly available church records
- **Mortality data**: Social Security Administration actuarial tables for U.S. males

## Key Assumptions

- Succession follows seniority by ordination date
- No early resignations or unforeseen circumstances
- Individual health follows average mortality patterns

## Limitations

- Statistical model cannot account for individual health conditions
- Shows probabilities, not predictions
- Cannot predict unforeseen circumstances

## Technical Information
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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
