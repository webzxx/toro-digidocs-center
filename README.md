Barangay Bahay Toro Digidocs Center

## Getting Started

First, duplicate `.env.example` and rename it to `.env` and replace the default values to actual secrets/API keys.

Then, run the following commands to install dependencies and setup husky:

```bash
npm i
npm run prepare
```

Then, generate prisma types:

```bash
npx prisma generate
```

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

To check database, run `npx prisma studio`