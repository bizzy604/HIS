'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css'; // Add this import for Swagger UI styles

// Use dynamic import with SSR disabled to prevent build issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { 
  ssr: false,
  loading: () => <div className="p-8">Loading Swagger UI...</div>
});

export default function ApiDocs() {
  const [spec, setSpec] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true);
    
    // Suppress React Strict Mode warnings for Swagger UI
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Don't log UNSAFE_componentWillReceiveProps warnings from Swagger UI
      if (args[0] && typeof args[0] === 'string' && args[0].includes('UNSAFE_componentWillReceiveProps')) {
        return;
      }
      originalConsoleError(...args);
    };
    
    // Fetch the OpenAPI specification
    fetch('/api/swagger')
      .then((response) => response.json())
      .then((data) => setSpec(data))
      .catch((error) => console.error('Error loading API spec:', error));
      
    // Restore original console.error on cleanup
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  if (!isClient) {
    return <div className="p-8">Loading API documentation...</div>;
  }

  if (!spec) {
    return <div className="p-8">Loading API specification...</div>;
  }

  return (
    <div className="swagger-container">
      {/* 
        Note: Swagger UI uses deprecated lifecycle methods like UNSAFE_componentWillReceiveProps
        which trigger warnings in React strict mode. These warnings do not affect functionality.
      */}
      <SwaggerUI spec={spec} />
      <style jsx global>{`
        .swagger-ui .topbar {
          display: none;
        }
        .swagger-container {
          margin: 20px;
        }
        /* Hide console warnings in development */
        .swagger-ui .errors-wrapper {
          display: none;
        }
      `}</style>
    </div>
  );
}
