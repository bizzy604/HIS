/**
 * CSV Export Utility
 * Provides functions to export data to CSV format
 */

/**
 * Convert array of objects to CSV string
 */
export function convertToCSV<T extends Record<string, any>>(
  data: T[],
  headers?: { key: keyof T; label: string }[]
): string {
  if (data.length === 0) return "";

  // If headers not provided, use all keys from first object
  const csvHeaders = headers || Object.keys(data[0]).map(key => ({ key, label: key }));
  
  // Create header row
  const headerRow = csvHeaders.map(h => escapeCSVValue(h.label)).join(",");
  
  // Create data rows
  const dataRows = data.map(row => {
    return csvHeaders
      .map(header => {
        const value = row[header.key];
        return escapeCSVValue(formatValue(value));
      })
      .join(",");
  });
  
  return [headerRow, ...dataRows].join("\n");
}

/**
 * Escape CSV values that contain special characters
 */
function escapeCSVValue(value: string): string {
  if (value === null || value === undefined) return "";
  
  const stringValue = String(value);
  
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Format values for CSV export
 */
function formatValue(value: any): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object" && value !== null) {
    // Handle arrays
    if (Array.isArray(value)) {
      return value.join("; ");
    }
    // Handle dates
    if (value instanceof Date) {
      return value.toISOString();
    }
    // Handle other objects (try to stringify)
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Download CSV file to browser
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  
  if (link.download !== undefined) {
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    URL.revokeObjectURL(url);
  }
}

/**
 * Export data to CSV file
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: { key: keyof T; label: string }[]
): void {
  const csvContent = convertToCSV(data, headers);
  const timestamp = new Date().toISOString().split("T")[0];
  const fullFilename = `${filename}_${timestamp}.csv`;
  downloadCSV(csvContent, fullFilename);
}
