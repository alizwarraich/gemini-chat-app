# Full Stack Chat Application on Remix.js using Postgres, Prisma, Tailwind CSS, and Shadcn

## Project Setup

**Prerequisites:**

-   Node.js v16.13.2 or higher
-   PostgreSQL database

**Creating the Remix App:**

`npx create-remix@latest my-remix-app`

**Adding Dependencies:**

-   **Postgres:**
    -   `npm install pg`
-   **Prisma:**
    -   `npm install prisma`
-   **Tailwind CSS:**
    -   `npm install tailwindcss postcss autoprefixer`
-   **Shady Components:**
    -   `npm install @shadcn/core`

## Database Setup

### Creating a Postgres Database

-   Create a new database on your PostgreSQL instance.

### Connecting Remix to Postgres

In `app/db.server.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});
```

## Prisma Setup

### Generating the Prisma Schema

-   `npx prisma init`
    -   Select "Postgres" as the database.
    -   Enter your database connection string.

### Creating the Prisma Client

-   `npx prisma generate`

## Styling with Tailwind CSS and Shady Components

### Tailwind CSS Configuration

-   Create `tailwind.config.js`:

```javascript
module.exports = {
    content: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
};
```

-   Add `@tailwindcss/typography` and `@tailwindcss/forms` to your `package.json` dependencies.

### Shady Components Configuration

-   In `tailwind.config.js`, add `@shadcn/core` to the `plugins` array.

## Running the Application

-   `npm run dev`

## Features

-   **Postgres Database:** Data persistence and storage.
-   **Prisma:** Type-safe ORM for Postgres.
-   **Tailwind CSS:** CSS styling with advanced customization.
-   **Shadcn Components:** Reusable and accessible UI components.

## Notes

-   Set the `DATABASE_URL` environment variable to your Postgres database connection string.
-   For more information, refer to the official documentation for Remix.js, Prisma, Tailwind CSS, and Shady Components.
