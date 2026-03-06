This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

To run this project, you will need to add the following variables to your `.env.local`:

### Appwrite
- `NEXT_PUBLIC_APPWRITE_ENDPOINT`: Your Appwrite endpoint
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID`: Your Appwrite project ID
- `APPWRITE_API_KEY`: Appwrite Admin API Key (required for server-side operations)

### Database (Turso/LibSQL)
- `DATABASE_URL`: Your database connection URL
- `DATABASE_AUTH_TOKEN`: Your database authentication token

### Razorpay (Payments)
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Your Razorpay Key ID
- `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret
- `RAZORPAY_WEBHOOK_SECRET`: Secure secret for verifying webhooks

## Security & Scalability

This project is built for long-term growth and high traffic:
- **Optimized Queries**: All major tables include indices on `user_id` for fast data retrieval at scale.
- **Secure Payments**: Webhook signature verification prevents fraudulent payment injections.
- **Abuse Prevention**: Rate limiting is integrated into sensitive endpoints (Login, Payments).
- **Data Integrity**: Strict Zod schemas validate all server-side inputs.

## Learn More
...
