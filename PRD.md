Comprehensive Product Requirements Document (PRD) & System Architecture

Hospital Management System (HMS) - Enterprise Edition

Version: 2.0
Architect: System Architect (AI)
Tech Stack Target: Next.js 15, PostgreSQL, TypeScript
Date: November 23, 2025

1. System Architecture Overview

1.1. High-Level Design

The system follows a Monolithic Modular Architecture optimized for Next.js 15. While microservices are popular, a modular monolith is preferred here to maintain strict type safety across the boundary between database and frontend, reducing latency in critical hospital workflows.

Frontend: Next.js 15 (App Router).

UI Strategy: Server Components for data fetching (Dashboards, Patient Lists) to reduce client bundle size. Client Components for interactive elements (Forms, Real-time Charts).

State Management: URL-based state (Nuqs) for filter/search, combined with React Context/Zustand for session data.

Backend Layer: Next.js Server Actions.

Direct database mutation without separate API routes for 90% of CRUD operations.

Route Handlers (app/api/...) reserved for external integrations (Webhooks, IoT device data from labs).

Database: PostgreSQL.

Why SQL? Healthcare data is highly relational (A patient has appointments, which have prescriptions, which have medicines). Consistency (ACID) is non-negotiable.

Infrastructure: Vercel (Frontend/Edge) + Neon/Supabase (Serverless Postgres) + AWS S3 (Medical Imaging storage).

1.2. Tech Stack Specifications

Framework: Next.js 15 (Stable)

Language: TypeScript (Strict mode)

ORM: Prisma ORM or Drizzle (Drizzle recommended for Next.js serverless performance)

Auth: Auth.js (formerly NextAuth) v5 - Handling RBAC.

Styling: Tailwind CSS + Shadcn/UI (Radix Primitives).

Real-time: Pusher or Socket.io (for Emergency alerts/Queue management).

2. Core Modules & Features

Module A: Authentication & RBAC (Role-Based Access Control)

Goal: Secure the system based on strict hierarchy.

Roles: Super Admin, Doctor, Nurse, Pharmacist, Lab Technician, Receptionist, Patient.

Features:

Secure Login (MFA support for Doctors/Admins).

Audit Logs: Track who viewed which patient record (HIPAA requirement).

Session Timeout: Auto-logout after 15 mins of inactivity.

Module B: Patient Management (The "Master Index")

Goal: Centralized patient identity.

Features:

Registration: Demographics, Insurance, Emergency Contacts.

OPD vs IPD: Flagging if patient is Outpatient (Walk-in) or Inpatient (Admitted).

Barcode/QR Generation: Generate wristband codes for admitted patients.

Module C: Doctor Station (Clinical Workbench)

Goal: The workspace you have started, expanded.

Features:

Queue Management: Real-time list of waiting patients.

EMR (Electronic Medical Record):

SOAP Notes (Subjective, Objective, Assessment, Plan).

Diagnosis (ICD-10 Code search integration).

CPOE (Computerized Physician Order Entry): Digital prescriptions and Lab requests. Safety Check: Alert if prescribed med conflicts with patient allergies.

Module D: Pharmacy Management

Goal: Inventory control and dispensing.

Features:

Prescription Sync: Auto-fetch prescriptions from Doctor Station.

Inventory Tracking: Real-time stock decrement upon dispensing.

Batch Management: Track expiry dates; FIFO (First-In-First-Out) dispensing logic.

Low Stock Alerts: Automated notifications to Admin.

Module E: Laboratory & Pathology

Goal: Diagnostic workflow.

Features:

Sample Collection: Track sample ID and status (Collected, Processing, Verified).

Result Entry: Structured data entry or PDF upload.

Reference Ranges: Auto-flag abnormal results (High/Low) in red.

Module F: Billing & Insurance

Goal: Revenue Cycle Management.

Features:

Auto-Billing: Triggers charges based on Consultations + Lab Tests + Pharmacy items.

Insurance Claims: Generate claim forms.

Discharge Summary: Block discharge if bills are pending.

3. Database Design (Schema Strategy)

We will use a relational schema. Below is the high-level Entity Relationship logic.

3.1. Core Tables

1. Users & Roles

Table User {
  id: UUID (PK)
  email: String (Unique)
  password_hash: String
  role: Enum (DOCTOR, NURSE, ADMIN, ETC)
  is_active: Boolean
  profile_id: UUID (Link to DoctorProfile or StaffProfile)
}

Table DoctorProfile {
  id: UUID (PK)
  user_id: UUID (FK)
  specialization: String
  license_number: String
  consultation_fee: Float
  availability_schedule: JSONB
}


2. Patients & Visits

Table Patient {
  id: UUID (PK)
  mrn: String (Unique Index) -- Medical Record Number
  first_name: String
  last_name: String
  dob: Date
  blood_group: Enum
  allergies: Text[]
  insurance_provider: String
  policy_number: String
}

Table Appointment {
  id: UUID (PK)
  patient_id: UUID (FK)
  doctor_id: UUID (FK)
  status: Enum (SCHEDULED, WAITING, COMPLETED, CANCELLED)
  type: Enum (OPD, FOLLOW_UP, EMERGENCY)
  scheduled_at: DateTime
}

Table MedicalVisit {
  id: UUID (PK)
  appointment_id: UUID (FK)
  doctor_id: UUID (FK)
  patient_id: UUID (FK)
  chief_complaint: Text
  diagnosis: Text
  notes: Text
  created_at: DateTime
}


3. Orders (Pharmacy & Lab)

Table Prescription {
  id: UUID (PK)
  visit_id: UUID (FK)
  status: Enum (PENDING, DISPENSED)
}

Table PrescriptionItem {
  id: UUID (PK)
  prescription_id: UUID (FK)
  medicine_id: UUID (FK)
  dosage: String (e.g., "10mg")
  frequency: String (e.g., "1-0-1")
  duration: String (e.g., "5 Days")
}

Table MedicineInventory {
  id: UUID (PK)
  name: String
  generic_name: String
  batch_number: String
  expiry_date: Date
  stock_count: Integer
  unit_price: Float
}


4. Next.js 15 Implementation Strategy

4.1. Folder Structure (App Router)

/app
  /login
  /dashboard
    layout.tsx       # Sidebar & Header (Role aware)
    page.tsx         # Metric Widgets (Admissions today, Revenue)
    /reception
      /registration  # Patient Forms
      /appointments  # Calendar View
    /doctor
      /queue         # Real-time patient list
      /emr/[patientId] # Dynamic Route for treating patients
    /pharmacy
      /inventory
      /dispense
    /admin
      /users
      /settings


4.2. Data Fetching Pattern (RSC)

We will avoid useEffect for initial data loads.

Pattern: Fetch data directly in page.tsx (Server Component) using typed DB calls.

Benefit: Zero client-side waterfall, faster Time-to-First-Byte (TTFB), and SEO (if public pages exist).

// app/doctor/queue/page.tsx
export default async function DoctorQueuePage() {
  const session = await auth();
  const queue = await db.appointment.findMany({
    where: { 
      doctorId: session.user.id, 
      status: 'WAITING',
      date: today 
    },
    include: { patient: true }
  });

  return <QueueTable data={queue} />;
}


4.3. Mutation Pattern (Server Actions)

For forms (Registration, Prescribing), we use Server Actions.

Pattern: Define async functions in actions.ts and call them from forms.

Validation: Use Zod schemas inside the action to validate data before it hits the DB.

5. Roadmap & Milestones

Phase 1: The Foundation (Weeks 1-4)

Setup Next.js 15 + Postgres.

Implement Auth (NextAuth) + Role Middleware.

Build Admin (User creation) and Reception (Patient Registration) modules.

Phase 2: Clinical Core (Weeks 5-8)

Build Doctor Dashboard (Queue + EMR).

Integrate Appointment Scheduling.

Vitals Module: Allow nurses to add BP/Weight before doctor sees patient.

Phase 3: Ancillary Services (Weeks 9-12)

Pharmacy Module: Link prescriptions to inventory.

Billing Module: Auto-calculate costs.

Lab Module: Basic test result uploading.

Phase 4: Polish & Security (Weeks 13-14)

Audit Logs implementation.

Data encryption verification.

Load testing.