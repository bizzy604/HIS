# Hospital Information System (HIS) Dashboard

A modern, comprehensive hospital information management system built with Next.js and React, featuring client management, program enrollment, and analytics capabilities.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Additional Resources](#additional-resources)
- [Acknowledgments](#acknowledgments)

## Features

- **Authentication**: Secure user authentication and authorization through Clerk
- **Client Management**: Add, edit, view, and delete client records
- **Program Management**: Create and manage health programs
- **Enrollment System**: Enroll clients in various health programs
- **Analytics Dashboard**: View visualizations of important metrics
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Support for theme preferences

## Tech Stack

- **Frontend**: React 19, Next.js 15
- **UI Components**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: Prisma ORM
- **Data Fetching**: SWR
- **Charts**: Recharts
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Jest

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (or any database supported by Prisma)
- Clerk account for authentication

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd his-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install --save-dev --legacy-peer-deps
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   # Database
   DATABASE_URL=""
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   
   # Clerk URLs
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

4. Set up the database:
   ```bash
   npx prisma db push
   # Optional: Seed the database
   npx prisma db seed
   ```

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Building for Production

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

## Project Structure

```
his-dashboard/
├── app/                    # Next.js 15 app directory
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Dashboard routes
│   ├── api/                # API routes
│   ├── globals.css         # Global CSS
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # UI components
│   ├── ui/                 # shadcn UI components
│   └── ...                 # App-specific components
├── lib/                    # Utility functions, hooks, etc.
│   ├── db.ts               # Database client
│   └── utils.ts            # Utility functions
├── prisma/                 # Prisma schema and migrations
├── public/                 # Static assets
└── __tests__/              # Test files
```

## API Routes

The system provides the following API endpoints:

- `/api/clients` - Client management
- `/api/programs` - Program management
- `/api/enrollments` - Enrollment management
- `/api/analytics` - Analytics data

The API is documented using Swagger UI. You can access the interactive API documentation at `/api-docs` when the application is running.

### API Documentation

To explore and test the API endpoints:

1. Start the development server: `npm run dev`
2. Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs) in your browser
3. Use the Swagger UI to view endpoint details and test API calls directly from the browser

All API endpoints require authentication and are protected by Clerk middleware.

## Testing

```bash
# Run all tests
npm test
# or
yarn test

# Run specific test file
npm test -- __tests__/components/client-dialog.test.tsx
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Additional Resources

- [Project Presentation](https://docs.google.com/presentation/d/1k0KZSmtPdvd_yugQWKHj3xVOjZ3JVD4hzCEbLBSY2-A/edit?usp=sharing) - View the PowerPoint presentation for more information about the Hospital Information System
- [Live Demo](https://his-green.vercel.app) - Visit the live deployment of the Healthcare Information System

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Clerk](https://clerk.dev/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
