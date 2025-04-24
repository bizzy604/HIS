import useSWR from 'swr';
import { toast } from './use-toast';

// Define analytics data types
export interface AnalyticsData {
  counts: {
    totalClients: number;
    activeClients: number;
    totalPrograms: number;
    activePrograms: number;
    totalEnrollments: number;
  };
  enrollmentRate: number;
  completionRate: number;
  monthlyEnrollments: Array<{
    month: string;
    count: number;
  }>;
  programDistribution: Array<{
    name: string;
    value: number;
  }>;
  clientStatusDistribution: Array<{
    name: string;
    value: number;
  }>;
  recentActivity: Array<any>; // We'll keep this flexible for now
}

// Configure the fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  
  // If the status code is not in the range 200-299,
  // throw an error with the response
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }
  
  return res.json();
};

// Hook to get analytics data
export function useAnalytics(startDate?: string, endDate?: string) {
  let url = '/api/analytics';
  const params = new URLSearchParams();
  
  if (startDate) {
    params.append('startDate', startDate);
  }
  
  if (endDate) {
    params.append('endDate', endDate);
  }
  
  if (params.toString()) {
    url = `${url}?${params.toString()}`;
  }
  
  const { data, error, isLoading, mutate } = useSWR<AnalyticsData>(url, fetcher, {
    // Refresh analytics data every 5 minutes
    refreshInterval: 5 * 60 * 1000, 
    // Don't revalidate on focus for analytics to reduce API load
    revalidateOnFocus: false
  });
  
  return {
    analytics: data,
    isLoading,
    isError: error,
    mutate
  };
}
