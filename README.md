# Next.js Boilerplate with Better Auth

This is a Next.js boilerplate designed to kickstart your projects with a robust authentication system, internationalization, and a modern tech stack. It's built with scalability and developer experience in mind.

## Features

- **Secure Authentication**: Powered by `better-auth` for a secure and flexible authentication system.
- **Internationalization (i18n)**: `next-intl` is set up for multilingual support out-of-the-box.
- **Type-Safe Database ORM**: Uses `Drizzle ORM` for a type-safe and powerful database interface.
- **UI Components**: `Shadcn UI` for a set of accessible and customizable React components.
- **Validation**: `Zod` for schema validation and type safety.
- **Emailing**: `Resend` and `@react-email/components` for building and sending emails.
- **Styling**: `Tailwind CSS` for a utility-first CSS framework.
- **Linting and Formatting**: `ESLint` and `Prettier` are configured to ensure code quality.

## Tech Stack

- [Next.js](https://nextjs.org/) – React Framework
- [React](https://react.dev/) – JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) – Typed superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework
- [Drizzle ORM](https://orm.drizzle.team/) – TypeScript ORM for SQL databases
- [better-auth](https://www.npmjs.com/package/better-auth) – Authentication library
- [next-intl](https://next-intl-docs.vercel.app/) – Internationalization for Next.js
- [Zod](https://zod.dev/) – TypeScript-first schema validation
- [Shadcn UI](https://ui.shadcn.com/) – Accessible and customizable components

## Project Structure

```
.
├── src
│   ├── app
│   │   ├── [locale]
│   │   └── api
│   ├── components
│   │   ├── auth
│   │   └── ui
│   ├── db
│   │   ├── drizzle.ts
│   │   └── schema.ts
│   ├── i18n
│   └── lib
│       ├── auth.ts
│       └── schemas
├── public
├── messages
│   ├── en.json
│   └── fr.json
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm, yarn, pnpm, or bun

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repo-url>
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```
3.  Set up your environment variables by copying `.env.example` to `.env` and filling in the required values.
    ```bash
    cp .env.example .env
    ```

### Running the Development Server

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

## Learn More

To learn more about the technologies used in this boilerplate, refer to their respective documentation:

- [Next.js Documentation](https://nextjs.org/docs)
- [better-auth Documentation](https://www.npmjs.com/package/better-auth)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/docs)
