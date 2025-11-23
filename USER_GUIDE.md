# Hospital Information System - User Guide

## Welcome to Your Complete Hospital Management System

This guide explains all the features of your Hospital Information System in simple, easy-to-understand terms. No technical knowledge required!

---

## 📋 Table of Contents

1. [Dashboard Overview](#dashboard-overview)
2. [Patient Registration](#patient-registration)
3. [Appointments](#appointments)
4. [Patient Queue](#patient-queue)
5. [Electronic Medical Records (EMR)](#electronic-medical-records-emr)
6. [Vital Signs Recording](#vital-signs-recording)
7. [Laboratory Tests](#laboratory-tests)
8. [Prescriptions](#prescriptions)
9. [Pharmacy & Inventory](#pharmacy--inventory)
10. [Billing & Payments](#billing--payments)
11. [Analytics & Reports](#analytics--reports)

---

## Dashboard Overview

When you log in, you'll see the main dashboard with a summary of your hospital's activities:

- **Total number of patients** registered in the system
- **Number of appointments** scheduled for today
- **Active programs** your hospital is running
- **Recent patient activities** and consultations

**Navigation Menu** (on the left side):
- Dashboard - Main overview page
- Queue - Patients waiting to be seen
- Appointments - Schedule and view appointments
- Clients - Patient records
- Pharmacy - Medicine inventory
- Laboratory - Lab tests and results
- Billing - Invoices and payments
- Programs - Health programs
- Analytics - Reports and statistics

---

## Patient Registration

### What is it?
Before a patient can receive any services, they need to be registered in the system. Think of it like creating a patient file.

### How to Register a New Patient:

1. Click **"Clients"** in the left menu
2. Click the **"Add Client"** button (blue button with + sign)
3. Fill in the patient information:
   - **First Name & Last Name** (required)
   - **Date of Birth** - Used to calculate age automatically
   - **Gender** - Male, Female, or Other
   - **Phone Number** - For contacting the patient
   - **Email** - Optional
   - **Address** - Patient's home address
   - **Blood Group** - A+, B+, O+, AB+, etc.
   - **Allergies** - Important! List any allergies to medicines or food
   - **Insurance Information** - Provider name and policy number
   - **Emergency Contact** - Name and phone number

4. Click **"Add Client"** to save

### What Happens Next?
- The system automatically creates a unique **Medical Record Number (MRN)** for the patient
- Format: MRN-20251123-0001 (includes today's date and a sequential number)
- This MRN is used throughout the system to identify the patient

---

## Appointments

### What is it?
The appointment system helps you schedule when patients should visit the hospital.

### Booking an Appointment:

1. Click **"Appointments"** in the left menu
2. Click **"Schedule Appointment"** button
3. Fill in the details:
   - **Select Patient** - Choose from registered patients
   - **Appointment Type** - Consultation, Follow-up, Check-up, Procedure, Emergency
   - **Date & Time** - When the patient should come
   - **Duration** - How long (in minutes)
   - **Notes** - Any special instructions

4. Click **"Schedule"** to save

### Viewing Appointments:

The system shows appointments in three tabs:
- **Today** - All appointments for today
- **Upcoming** - Future appointments
- **All** - Complete history

### Appointment Status Colors:
- **Yellow (Scheduled)** - Appointment is booked
- **Blue (Waiting)** - Patient has arrived and is waiting
- **Green (In Progress)** - Doctor is seeing the patient
- **Gray (Completed)** - Consultation finished
- **Red (Cancelled)** - Appointment was cancelled

### Managing Appointments:

For each appointment, you can:
- **Start Consultation** - Moves patient to the queue
- **Reschedule** - Change date/time
- **Cancel** - Cancel the appointment

---

## Patient Queue

### What is it?
The queue shows all patients who are currently waiting to be seen by a doctor. It's like a waiting room list.

### How it Works:

1. When a patient arrives for their appointment, click **"Start Consultation"**
2. The patient appears in the queue with status **"Waiting"**
3. The queue updates automatically every 30 seconds

### Queue Display:

For each patient, you can see:
- Patient name and MRN
- Age and gender
- Appointment type (Consultation, Follow-up, etc.)
- Time they arrived
- Current status

### Starting a Consultation:

1. Find the patient in the queue
2. Click **"Start Consultation"** button
3. You'll be taken to the Electronic Medical Records page
4. Status changes to **"In Progress"** (blue badge)

---

## Electronic Medical Records (EMR)

### What is it?
The EMR is where doctors document everything about a patient's visit. It uses a medical format called **SOAP Notes**.

### SOAP Notes Explained:

#### **S - Subjective** (What the patient tells you)
- Chief Complaint - Why did the patient come?
- Patient's symptoms in their own words
- How long they've been feeling this way
- What makes it better or worse

**Example:** "Patient reports headache for 3 days, worse in the morning, relieved by rest"

#### **O - Objective** (What you observe and measure)
- Physical examination findings
- Vital signs (blood pressure, temperature, etc.)
- Test results
- What you can see, hear, or feel

**Example:** "Temperature: 38.5°C, Blood pressure: 120/80, No visible swelling"

#### **A - Assessment** (Your medical opinion)
- Your diagnosis based on the information
- Medical codes (like ICD-10) if applicable
- List possible conditions

**Example:** "Diagnosis: Tension headache, Rule out migraine"

#### **P - Plan** (What you're going to do)
- Treatment plan
- Medications prescribed
- Tests to order
- Follow-up instructions

**Example:** "Prescribe pain medication, Order blood tests, Follow-up in 1 week"

### Additional Features:

**Additional Notes** - Anything else important:
- Patient education provided
- Special observations
- Instructions given to patient

### Action Buttons:

- **Order Lab Test** - Request laboratory tests
- **Prescription** - Create prescriptions for medicines
- **Save & Complete** - Saves all information and marks consultation as complete

### What Happens When You Save:
- Medical visit record is created
- Appointment status changes to "Completed"
- Patient record is updated
- Doctor can move to next patient

---

## Vital Signs Recording

### What is it?
Vital signs are basic measurements that show how the body is functioning. They're usually taken before seeing the doctor.

### How to Record Vitals:

1. Go to **"Clients"** menu
2. Find the patient and click their name
3. Click the **"Vitals"** tab
4. Click **"Record Vitals"** button
5. Enter the measurements:

   - **Blood Pressure** (e.g., 120/80 mmHg)
     - First number = Systolic (when heart beats)
     - Second number = Diastolic (when heart rests)
   
   - **Heart Rate** (e.g., 72 bpm - beats per minute)
     - Normal range: 60-100 bpm
   
   - **Temperature** (e.g., 37°C or 98.6°F)
     - Normal: Around 37°C (98.6°F)
   
   - **Respiratory Rate** (breaths per minute)
     - Normal: 12-20 breaths/minute
   
   - **Oxygen Saturation** (SpO2 - percentage)
     - Normal: 95-100%
   
   - **Weight** (in kilograms)
   
   - **Height** (in centimeters)

6. Click **"Record Vitals"**

### Automatic Calculations:

**BMI (Body Mass Index)** is calculated automatically:
- Uses the formula: Weight ÷ (Height in meters)²
- Shows if patient is underweight, normal, overweight, or obese

### Viewing Vitals History:

The system shows:
- All previous vital signs in a table
- Date and time of each recording
- Trends over time (getting better or worse)
- BMI category for each visit

---

## Laboratory Tests

### What is it?
The laboratory system manages all medical tests ordered by doctors.

### Ordering a Lab Test:

**From EMR Page:**
1. While documenting a patient consultation
2. Click **"Order Lab Test"** button
3. Fill in the form:
   - **Test Name** - What test to run (e.g., Complete Blood Count)
   - **Category** - Hematology, Clinical Chemistry, Microbiology, etc.
   - **Specimen Type** - Blood, Urine, Stool, etc.
   - **Urgency** - Routine, Urgent, or STAT (immediate)
   - **Clinical Notes** - Why the test is needed

4. Click **"Create Lab Order"**

### Laboratory Workflow:

1. **Ordered** (Yellow badge) - Doctor has requested the test
2. **In Progress** (Blue badge) - Sample collected, test being performed
3. **Completed** (Green badge) - Results are ready

### Viewing Lab Orders:

Go to **"Laboratory"** in the menu to see:
- **Pending Tab** - Tests waiting to be done
- **Completed Tab** - Tests with results
- **All Orders Tab** - Everything

### Entering Lab Results:

1. Find the lab order
2. Click **"Enter Results"** button
3. Fill in:
   - **Results Data** - Test findings (can use JSON format for structured data)
   - **Interpretation** - What the results mean clinically
   - **Additional Notes** - Any observations
   - **Performed By** - Lab technician's name

4. Click **"Save Results"**

### Information Shown:

For each lab order, you can see:
- Patient name, MRN, and age
- Test name and category
- Urgency level
- Doctor who ordered it
- Date ordered
- Status

---

## Prescriptions

### What is it?
The prescription system (also called CPOE - Computerized Physician Order Entry) helps doctors prescribe medicines safely.

### Creating a Prescription:

**From EMR Page:**
1. While seeing a patient, click **"Prescription"** button
2. Click **"Add Medicine"** for each drug needed
3. For each medicine, enter:

   - **Medicine Name** - Select from available medicines
   - **Dosage** - How much (e.g., 500mg, 10ml)
   - **Frequency** - How often to take it:
     - Once daily
     - Twice daily
     - Three times daily
     - Every 4/6/8 hours
     - Before/After meals
     - At bedtime
     - As needed
   
   - **Duration** - How long (e.g., 7 days, 2 weeks)
   - **Quantity** - Total number of pills/bottles
   - **Instructions** - Special directions for the patient

4. Add **General Notes** if needed (warnings, precautions)
5. Click **"Create Prescription"**

### What Happens Automatically:

- Medicine stock in pharmacy is reduced by the quantity prescribed
- Prescription is linked to the medical visit
- Patient can take the prescription to pharmacy

### Example Prescription:

**Medicine:** Paracetamol 500mg
**Dosage:** 500mg
**Frequency:** Three times daily
**Duration:** 5 days
**Quantity:** 15 tablets
**Instructions:** Take after meals with water

---

## Pharmacy & Inventory

### What is it?
The pharmacy module manages all medicines in your hospital, tracks stock levels, and alerts you when supplies are low.

### Medicine Management:

#### Adding a New Medicine:

1. Go to **"Pharmacy"** in the menu
2. Click **"Add Medicine"** button
3. Enter medicine details:
   - **Brand Name** - Commercial name (e.g., Panadol)
   - **Generic Name** - Scientific name (e.g., Paracetamol)
   - **Category** - Type of medicine:
     - Antibiotic
     - Analgesic (pain relief)
     - Antiviral
     - Cardiovascular
     - Gastrointestinal
     - And more...
   
   - **Manufacturer** - Company that makes it
   - **Unit Price** - Price per tablet/bottle
   - **Unit** - tablet, capsule, ml, mg, etc.
   - **Reorder Level** - Minimum stock before alert
   - **Description** - Additional information

4. Click **"Add Medicine"**

#### Adding Stock (Medicine Batches):

When you receive new medicines:

1. Find the medicine in the list
2. Click **"Add Batch"** button
3. Enter batch information:
   - **Batch Number** - Unique identifier on the package
   - **Expiry Date** - When medicine expires
   - **Quantity** - How many units received
   - **Purchase Price** - What you paid
   - **Selling Price** - What you'll charge

4. Click **"Add Batch"**

**What happens:** Stock quantity automatically increases

### Viewing Inventory:

The pharmacy page has three tabs:

#### **Inventory Tab** (All medicines)
Shows complete list with:
- Medicine name
- Generic name
- Category
- Current stock quantity
- Unit price
- Status badge (In Stock, Low Stock, Out of Stock)

#### **Low Stock Tab** (Medicines running low)
Shows medicines where:
- Current stock ≤ Reorder level
- Displayed with orange warning
- Action button to add stock

#### **Expiring Tab** (Medicines expiring soon)
Shows batches that:
- Expire within 3 months
- Listed with red warning
- Shows batch number and expiry date

### Stock Status Colors:

- **Green (In Stock)** - Sufficient quantity
- **Orange (Low Stock)** - Below reorder level, need to order more
- **Red (Out of Stock)** - No stock available, urgent reorder needed

### Search Feature:

Use the search box to find medicines by:
- Brand name
- Generic name
- Category

---

## Billing & Payments

### What is it?
The billing system creates invoices for hospital services and tracks payments.

### Creating a Bill:

1. Go to **"Billing"** in the menu
2. Click **"Create Bill"** button
3. Select **Patient** from the list
4. Add billing items by clicking **"Add Item"**

For each item:
- **Description** - What service (e.g., Consultation, X-ray, Medicine)
- **Quantity** - How many
- **Unit Price** - Cost per item
- **Type** - Category:
  - Consultation
  - Medicine
  - Lab Test
  - Procedure
  - Service

5. Add more items as needed
6. Enter **Discount** percentage if applicable
7. Add any **Notes**
8. Click **"Create Bill"**

### Bill Number Format:

Each bill gets a unique number: **BILL-20251123-0001**
- Contains date
- Sequential number for the day

### How Costs are Calculated:

1. **Subtotal** = Sum of all (Quantity × Unit Price)
2. **Discount** = Percentage off subtotal (if any)
3. **Tax** = 15% of (Subtotal - Discount)
4. **Total Amount** = Subtotal - Discount + Tax

### Example Bill:

| Item | Qty | Price | Total |
|------|-----|-------|-------|
| Consultation | 1 | $50.00 | $50.00 |
| Blood Test | 1 | $30.00 | $30.00 |
| Medicine | 10 | $2.00 | $20.00 |

- Subtotal: $100.00
- Discount (10%): -$10.00
- Tax (15%): $13.50
- **Total: $103.50**

### Recording Payments:

1. Find the bill in the billing list
2. Click **"Record Payment"** button
3. View the bill details and total amount
4. Enter:
   - **Payment Amount** - How much patient is paying
   - **Payment Method** - How they're paying:
     - Cash
     - Card
     - Insurance
     - Mobile Money
     - Bank Transfer

5. Click **"Record Payment"**

### Payment Status:

- **Yellow (Pending)** - Not paid yet
- **Orange (Partial)** - Some payment made, balance remaining
- **Green (Paid)** - Fully paid

### Partial Payments:

If a patient can't pay the full amount:
1. Enter the amount they can pay now
2. System calculates remaining balance
3. Status shows as "Partial"
4. Patient can make additional payments later

### Viewing Bills:

Three tabs available:
- **Pending** - Unpaid or partially paid bills
- **Paid** - Fully paid invoices
- **All Bills** - Complete history

### Statistics Shown:

- **Total Bills** - Number of invoices created
- **Total Revenue** - Money received from paid bills
- **Pending Amount** - Money still owed
- **Paid Bills** - Count of fully paid invoices

---

## Analytics & Reports

### What is it?
The analytics page provides visual reports and statistics about your hospital's activities.

### Available Reports:

#### **Dashboard Statistics:**
- Total number of patients
- Appointments scheduled
- Active programs
- Recent activities

#### **Client Demographics:**
Shows breakdown of patients by:
- Age groups
- Gender distribution
- Blood groups

#### **Program Enrollment:**
- Pie chart showing patient distribution across programs
- Number of clients per program
- Enrollment trends

#### **Monthly Activity:**
- Line chart showing patient visits over time
- Helps identify busy periods
- Tracks growth

---

## Tips for Using the System

### General Best Practices:

1. **Always verify patient identity** using their MRN before any action
2. **Record vital signs** before doctor consultation
3. **Check medicine expiry dates** before dispensing
4. **Monitor low stock alerts** regularly to avoid running out
5. **Process payments promptly** to maintain accurate records

### Search & Filter Features:

Most pages have search boxes that let you find information by:
- Patient name or MRN
- Medicine name
- Bill number
- Date ranges

### Status Indicators:

The system uses color-coded badges throughout:
- **Green** = Completed, Available, OK
- **Blue** = In Progress, Active
- **Yellow/Orange** = Pending, Warning, Low Stock
- **Red** = Urgent, Cancelled, Out of Stock, Expired

### Data Safety:

- All patient information is secured
- Medical records are confidential
- System tracks who made each change (audit log)
- Complies with healthcare privacy standards (HIPAA)

---

## Getting Help

### If You Encounter Issues:

1. **Check required fields** - Items marked with * must be filled
2. **Verify patient selection** - Make sure you selected the correct patient
3. **Look for error messages** - Red text will explain what's wrong
4. **Refresh the page** - Sometimes helps with display issues

### Common Tasks Quick Reference:

- **Register patient** → Clients → Add Client
- **Book appointment** → Appointments → Schedule Appointment
- **See patient** → Queue → Start Consultation
- **Record vitals** → Clients → Select patient → Vitals tab → Record Vitals
- **Order lab test** → EMR page → Order Lab Test button
- **Prescribe medicine** → EMR page → Prescription button
- **Enter lab results** → Laboratory → Enter Results button
- **Create bill** → Billing → Create Bill
- **Record payment** → Billing → Record Payment button
- **Add medicine** → Pharmacy → Add Medicine
- **Add stock** → Pharmacy → Add Batch button

---

## Workflow Summary

### Complete Patient Journey:

1. **Registration** - Create patient record (gets MRN)
2. **Appointment** - Schedule visit
3. **Arrival** - Patient checks in (added to queue)
4. **Vitals** - Nurse records vital signs
5. **Consultation** - Doctor documents in EMR
6. **Lab Tests** - If needed, order tests
7. **Prescriptions** - Doctor prescribes medicines
8. **Laboratory** - Tests performed, results entered
9. **Pharmacy** - Medicines dispensed
10. **Billing** - Invoice created
11. **Payment** - Patient pays bill
12. **Follow-up** - Schedule next appointment if needed

### Data Connections:

Everything is linked together:
- Patient record connects to appointments
- Appointments connect to medical visits
- Medical visits connect to prescriptions and lab orders
- Prescriptions connect to pharmacy inventory
- All services connect to billing

This ensures:
- Complete patient history in one place
- No duplication of information
- Accurate tracking and reporting
- Better patient care

---

## Conclusion

Your Hospital Information System is designed to make healthcare management easier and more efficient. By following the patient journey from appointment to payment, the system ensures nothing is missed and everything is properly documented.

Remember: The system is here to help you provide better patient care by organizing information, reducing errors, and saving time. The more you use it, the more comfortable you'll become!

**For additional training or support, contact your system administrator.**

---

*Last Updated: November 23, 2025*
