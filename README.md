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

## User Roles & Personas

The HIS system is designed with the following user roles:

### Doctor (Primary User)
The main user of the system with full access to all features:
- **Authentication**: Sign in via Clerk authentication
- **Profile**: Name, email, specialization, license number, consultation fee
- **Capabilities**:
  - Manage clients (patients)
  - Create and manage health programs
  - Schedule and manage appointments
  - Conduct medical visits (SOAP notes)
  - Write prescriptions
  - Order lab tests
  - Generate billing
  - View analytics and reports
- **Data Isolation**: Each doctor only sees their own clients and data (row-level security)

### Client (Patient)
Managed by doctors in the system:
- **Profile**: MRN (Medical Record Number), demographics, contact info, medical history
- **Medical Information**: 
  - Date of birth, gender, blood group
  - Allergies
  - Emergency contact
  - Insurance details
- **Status**: Active/Inactive
- **Associated Records**:
  - Program enrollments
  - Appointments
  - Medical visits
  - Vital signs
  - Prescriptions (via medical visits)
  - Lab orders and results
  - Billing records

### System Entities

While not user personas, these are key entities managed in the system:

- **Programs**: Health programs (e.g., Diabetes Management, Hypertension Control)
- **Appointments**: Scheduled visits (OPD, Follow-up, Emergency)
- **Medical Visits**: SOAP format documentation (Subjective, Objective, Assessment, Plan)
- **Prescriptions**: Medicine prescriptions with dosage and frequency
- **Lab Orders**: Laboratory test orders and results
- **Billing**: Financial transactions and invoicing
- **Vitals**: Patient vital signs (BP, heart rate, temperature, etc.)
- **Medicines**: Inventory of medicines with batches and expiry tracking
- **Audit Logs**: System activity tracking for compliance

## Workflows & System Interactions

### Doctor Workflows

#### 1. Client Registration & Onboarding
```
Sign In → Dashboard → Clients Page → Add New Client
↓
Enter client demographics (name, email, phone, DOB, gender, blood group)
↓
Add medical information (allergies, emergency contact, insurance details)
↓
System generates unique MRN (Medical Record Number)
↓
Client created and appears in clients list
```

#### 2. Program Enrollment
```
Navigate to Programs → Create Program (e.g., "Diabetes Management")
↓
Set program details (name, description, duration, cost)
↓
Enroll clients into program
↓
Track enrollment status and progress
```

#### 3. Appointment Scheduling
```
Clients Page → Select Client → Schedule Appointment
↓
Choose appointment type (OPD/Follow-up/Emergency)
↓
Set date, time, and reason
↓
Appointment created with status: SCHEDULED
↓
Status transitions: SCHEDULED → WAITING → IN_PROGRESS → COMPLETED
```

#### 4. Medical Visit (Consultation)
```
Appointments → Select appointment → Start Visit
↓
Record vital signs (BP, heart rate, temperature, weight, height, BMI, oxygen saturation)
↓
Document SOAP notes:
  - Subjective: Chief complaint, patient's description
  - Objective: Physical examination findings
  - Assessment: Diagnosis and clinical impression
  - Plan: Treatment plan and follow-up
↓
Change appointment status to IN_PROGRESS → COMPLETED
```

#### 5. Prescription Workflow
```
During/After Medical Visit → Create Prescription
↓
Add medicines from inventory
↓
Specify dosage, frequency, duration, and instructions
↓
Save prescription (linked to medical visit and client)
↓
Prescription available in client's medical history
```

#### 6. Lab Order Management
```
Medical Visit → Order Lab Tests
↓
Select tests (e.g., Blood Sugar, HbA1c, Lipid Profile)
↓
Set urgency (Routine/Urgent/STAT)
↓
Lab order created with status: PENDING
↓
Status flow: PENDING → SAMPLE_COLLECTED → IN_PROGRESS → COMPLETED
↓
Record lab results when available
↓
Results visible in client's medical records
```

#### 7. Billing & Payment
```
After Services Rendered → Create Bill
↓
Add billing items:
  - Consultation fee
  - Procedures
  - Medicines
  - Lab tests
↓
Calculate total with insurance adjustments
↓
Generate invoice
↓
Record payment (full/partial)
↓
Track payment status and outstanding balance
```

#### 8. Analytics & Reporting
```
Dashboard → View Analytics
↓
Monitor:
  - Client statistics (total, active, by status)
  - Appointment trends (daily, weekly, monthly)
  - Program enrollment distribution
  - Revenue and billing metrics
  - Monthly activity patterns
↓
Export reports for compliance or review
```

### Client Journey Through the System

#### Initial Registration
```
Doctor creates client profile → MRN assigned → Client becomes "Active"
```

#### Ongoing Care Cycle
```
1. Enrolled in health program (e.g., Diabetes Management)
   ↓
2. Scheduled appointment (OPD/Follow-up)
   ↓
3. Arrival: Appointment status → WAITING
   ↓
4. Vitals recorded by staff
   ↓
5. Consultation: Medical visit documented (SOAP notes)
   ↓
6. Prescription created (if needed)
   ↓
7. Lab tests ordered (if needed)
   ↓
8. Bill generated and payment processed
   ↓
9. Follow-up appointment scheduled (if needed)
   ↓
10. Lab results added when available
   ↓
[Cycle repeats for ongoing care]
```

#### Client Records Accumulation
Over time, each client accumulates:
- **Medical history**: All past visits with SOAP notes
- **Prescription history**: All medicines prescribed
- **Vital signs trends**: Blood pressure, weight, BMI over time
- **Lab results**: Complete laboratory test history
- **Billing history**: All invoices and payments
- **Program enrollments**: Current and past programs

### System Integration Points

#### Data Relationships
```
Doctor (1) ←→ (Many) Clients
Doctor (1) ←→ (Many) Programs
Client (1) ←→ (Many) Program Enrollments
Client (1) ←→ (Many) Appointments
Appointment (1) ←→ (1) Medical Visit
Medical Visit (1) ←→ (Many) Prescriptions
Medical Visit (1) ←→ (Many) Lab Orders
Client (1) ←→ (Many) Vitals
Client (1) ←→ (Many) Billing Records
Medicine (1) ←→ (Many) Medicine Batches
Prescription (1) ←→ (Many) Prescription Items
Lab Order (1) ←→ (Many) Lab Results
Billing (1) ←→ (Many) Billing Items
```

#### Authentication Flow
```
Doctor attempts access → Clerk authentication challenge
↓
Sign in with credentials
↓
Clerk validates and creates session
↓
Middleware checks authentication on each request
↓
User data fetched by clerkId
↓
Row-level security: Only doctor's own data accessible
```

#### Audit Trail
Every action is logged:
- **Who**: Doctor (clerkId)
- **What**: Action performed (CREATE, UPDATE, DELETE)
- **When**: Timestamp
- **Where**: Entity type and entity ID
- **Details**: Old and new values (for updates)

## Features

- **Authentication**: Secure user authentication and authorization through Clerk
- **Client Management**: Add, edit, view, and delete client records with comprehensive medical history
- **Program Management**: Create and manage health programs with enrollments
- **Enrollment System**: Enroll clients in various health programs with tracking
- **Appointment Scheduling**: Manage appointments with status tracking (Scheduled, Waiting, In Progress, Completed)
- **Medical Visits**: Document visits using SOAP format (Subjective, Objective, Assessment, Plan)
- **Prescription Management**: Create and manage medicine prescriptions with dosage tracking
- **Lab Orders & Results**: Order laboratory tests and record results
- **Billing System**: Generate bills, track payments, and manage insurance claims
- **Vital Signs Tracking**: Record and monitor patient vital signs over time
- **Medicine Inventory**: Manage medicine stock with batch and expiry tracking
- **Analytics Dashboard**: View visualizations of important metrics and KPIs
- **Audit Logging**: Comprehensive activity logging for compliance
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
