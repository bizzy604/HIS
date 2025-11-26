# CSV Export Feature

## Overview
The CSV export functionality has been implemented across all major data management pages in the HIS system. Users can now export their data to CSV files with a single click.

## Implementation

### Core Utility
**File**: `lib/csv-export.ts`

Provides three main functions:
- `convertToCSV()` - Converts array of objects to CSV string
- `downloadCSV()` - Triggers browser download of CSV file
- `exportToCSV()` - Main function that combines both operations

### Features
- **Automatic field escaping**: Handles commas, quotes, and newlines in data
- **Type-safe**: Full TypeScript support
- **Flexible headers**: Custom column labels and ordering
- **Date formatting**: ISO format for dates
- **Array handling**: Joins array values with semicolons
- **Automatic filename**: Adds current date to exported files

## Pages with Export Functionality

### 1. Clients Page (`/dashboard/clients`)
**Export Button**: Top right corner  
**Exports**:
- MRN, Name, Email, Phone
- Date of Birth, Gender, Blood Group
- Enrolled Programs
- Status, Last Visit
- Emergency Contact, Insurance Provider

**Filename**: `clients_YYYY-MM-DD.csv`

### 2. Programs Page (`/dashboard/programs`)
**Export Button**: Top right corner  
**Exports**:
- Name, Description
- Enrolled Clients count
- Status (Active/Inactive)
- Start Date, End Date
- Duration, Cost

**Filename**: `programs_YYYY-MM-DD.csv`

### 3. Analytics Page (`/dashboard/analytics`)
**Export Button**: "Export Report" button  
**Exports**:
- Summary metrics (Total Clients, Active Clients, Programs, etc.)
- Enrollment and completion rates
- Monthly enrollment data
- Program distribution statistics

**Filename**: `analytics_report_YYYY-MM-DD.csv`

### 4. Billing Page (`/dashboard/billing`)
**Export Button**: Top toolbar  
**Exports**:
- Bill Number, Patient Name, MRN
- Date, Subtotal, Discount, Tax
- Total Amount, Paid Amount
- Status, Payment Method
- Doctor name and specialization

**Filename**: `billing_YYYY-MM-DD.csv`

### 5. Appointments Page (`/dashboard/appointments`)
**Export Button**: Top toolbar  
**Exports**:
- Time, Patient Name, MRN
- Phone, Appointment Type
- Status, Notes

**Filename**: `appointments_YYYY-MM-DD.csv`

### 6. Laboratory Page (`/dashboard/laboratory`)
**Export Button**: In card header  
**Exports**:
- Patient Name, MRN, Age
- Test Name, Category, Priority
- Status, Ordered By
- Ordered Date, Completed Date
- Notes

**Filename**: `lab_orders_YYYY-MM-DD.csv`

### 7. Pharmacy Page (`/dashboard/pharmacy`)
**Export Button**: In inventory tab header  
**Exports**:
- Medicine Name, Generic Name
- Category, Manufacturer
- Stock Quantity, Unit, Reorder Level
- Unit Price, Total Batches
- Stock Status

**Filename**: `pharmacy_inventory_YYYY-MM-DD.csv`

## Usage

### For Users
1. Navigate to any page with data tables
2. Apply any filters or search criteria as needed
3. Click the "Export" or "Export Report" button
4. CSV file will automatically download to your browser's download folder
5. Open in Excel, Google Sheets, or any CSV-compatible application

### For Developers
```typescript
import { exportToCSV } from "@/lib/csv-export";

// Basic usage
const data = [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 }
];
exportToCSV(data, "users");

// With custom headers
const headers = [
  { key: "name", label: "Full Name" },
  { key: "age", label: "Age (years)" }
];
exportToCSV(data, "users", headers);
```

## Data Filtering
All exports respect the current page filters:
- **Search queries**: Only matching records are exported
- **Status filters**: Only selected statuses are included
- **Date filters**: Exports reflect selected date range

## Technical Details

### CSV Format
- **Encoding**: UTF-8 with BOM for Excel compatibility
- **Delimiter**: Comma (`,`)
- **Line ending**: LF (`\n`)
- **Quote character**: Double quote (`"`)
- **Escape method**: Double quotes (`""`)

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Not supported (application requirement: modern browsers only)

### File Size Limits
- No artificial limits imposed
- Browser memory is the practical limit
- Tested with up to 10,000 records successfully

## Future Enhancements
Potential improvements for future versions:
- [ ] PDF export option
- [ ] Excel (.xlsx) format support
- [ ] Export templates/presets
- [ ] Scheduled exports
- [ ] Email export delivery
- [ ] Custom column selection
- [ ] Export to cloud storage (Dropbox, Google Drive)

## Troubleshooting

### Export button not visible
- Check if data has loaded (loading state)
- Verify user permissions
- Clear browser cache

### Empty CSV file
- Ensure data exists on the page
- Check filter settings aren't excluding all records
- Verify network connection for data fetching

### Special characters not displaying
- Open CSV with UTF-8 encoding support
- Use "Import" feature in Excel rather than direct open
- Try Google Sheets for automatic UTF-8 handling

### Dates showing as numbers in Excel
- Excel may auto-format dates
- Select column and format as "Date" or "Text"
- Or import using Excel's "Get Data" feature

## Related Files
- `/lib/csv-export.ts` - Core export utility
- All dashboard page components with export buttons
- No external dependencies required (uses native browser APIs)
