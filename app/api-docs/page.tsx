'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocs() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    // Fetch the OpenAPI specification
    fetch('/api/swagger')
      .then((response) => response.json())
      .then((data) => setSpec(data))
      .catch((error) => console.error('Error loading API spec:', error));
  }, []);

  if (!spec) {
    return <div className="p-8">Loading API documentation...</div>;
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
