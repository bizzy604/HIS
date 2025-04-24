'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, ChevronDown, ChevronRight, Code } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

type ApiDoc = {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
  };
};

export default function ApiDocsPage() {
  const [apiDocs, setApiDocs] = useState<ApiDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApiDocs() {
      try {
        const response = await fetch('/api/docs');
        if (!response.ok) {
          throw new Error('Failed to fetch API documentation');
        }
        const data = await response.json();
        setApiDocs(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchApiDocs();
  }, []);

  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'get':
        return 'bg-blue-100 text-blue-800';
      case 'post':
        return 'bg-green-100 text-green-800';
      case 'put':
        return 'bg-amber-100 text-amber-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderParameters = (parameters: any[]) => {
    if (!parameters || parameters.length === 0) {
      return <p className="text-gray-500 italic">No parameters</p>;
    }

    return (
      <div className="space-y-4">
        {parameters.map((param, index) => (
          <div key={index} className="border-b pb-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">
                  {param.name}
                  {param.required && <span className="text-red-500 ml-1">*</span>}
                </p>
                <p className="text-sm text-gray-500">
                  {param.in} • {param.schema?.type || 'any'}
                </p>
              </div>
              {param.required && (
                <Badge variant="outline" className="text-red-500 border-red-200">
                  Required
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm">{param.description}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderRequestBody = (requestBody: any) => {
    if (!requestBody) return null;

    const content = requestBody.content?.['application/json'];
    if (!content) return null;

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Request Body</h4>
          {requestBody.required && (
            <Badge variant="outline" className="text-red-500 border-red-200">
              Required
            </Badge>
          )}
        </div>
        {content.schema?.properties && (
          <div className="space-y-3">
            {Object.entries(content.schema.properties).map(([name, prop]: [string, any]) => (
              <div key={name} className="border-b pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">
                      {name}
                      {content.schema?.required?.includes(name) && <span className="text-red-500 ml-1">*</span>}
                    </p>
                    <p className="text-sm text-gray-500">{prop.type}</p>
                  </div>
                  {content.schema?.required?.includes(name) && (
                    <Badge variant="outline" className="text-red-500 border-red-200">
                      Required
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-sm">{prop.description}</p>
                {prop.enum && (
                  <div className="mt-1">
                    <p className="text-xs text-gray-500">Possible values:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {prop.enum.map((value: string) => (
                        <Badge key={value} variant="secondary" className="text-xs">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {content.example && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Example</h4>
            <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto">
              {JSON.stringify(content.example, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  const renderResponses = (responses: any) => {
    if (!responses) return null;

    return (
      <div className="space-y-2">
        {Object.entries(responses).map(([code, response]: [string, any]) => (
          <div key={code} className="border rounded-md overflow-hidden">
            <div
              className={`px-3 py-2 flex justify-between items-center ${
                code.startsWith('2') ? 'bg-green-50' : code.startsWith('4') ? 'bg-amber-50' : 'bg-red-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Badge
                  className={
                    code.startsWith('2')
                      ? 'bg-green-100 text-green-800'
                      : code.startsWith('4')
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }
                >
                  {code}
                </Badge>
                <span className="text-sm font-medium">{response.description}</span>
              </div>
            </div>
            {response.content?.['application/json']?.schema && (
              <div className="p-3 text-sm">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="schema">
                    <AccordionTrigger className="text-xs py-2">Response Schema</AccordionTrigger>
                    <AccordionContent>
                      <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto">
                        {JSON.stringify(response.content['application/json'].schema, null, 2)}
                      </pre>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!apiDocs) {
    return (
      <div className="container mx-auto p-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Documentation</AlertTitle>
          <AlertDescription>No API documentation available.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{apiDocs.info.title}</h1>
        <p className="text-gray-500">Version: {apiDocs.info.version}</p>
        <p className="mt-2">{apiDocs.info.description}</p>
        <div className="mt-4">
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <Tabs defaultValue="endpoints" className="mb-8">
        <TabsList>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="schemas">Schemas</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-6">
          {Object.entries(apiDocs.paths).map(([path, methods]: [string, any]) => (
            <Card key={path}>
              <CardHeader>
                <CardTitle className="text-lg font-mono">{path}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(methods).map(([method, details]: [string, any]) => (
                  <Accordion type="single" collapsible key={method}>
                    <AccordionItem value={`${path}-${method}`}>
                      <AccordionTrigger>
                        <div className="flex items-center space-x-3">
                          <Badge className={getMethodColor(method)}>{method.toUpperCase()}</Badge>
                          <span>{details.summary}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 px-4">
                        <p>{details.description}</p>

                        <Tabs defaultValue="params" className="w-full">
                          <TabsList className="w-full justify-start">
                            <TabsTrigger value="params">Parameters</TabsTrigger>
                            {details.requestBody && <TabsTrigger value="body">Request Body</TabsTrigger>}
                            <TabsTrigger value="responses">Responses</TabsTrigger>
                          </TabsList>

                          <TabsContent value="params" className="space-y-4 mt-4">
                            {renderParameters(details.parameters)}
                          </TabsContent>

                          {details.requestBody && (
                            <TabsContent value="body" className="space-y-4 mt-4">
                              {renderRequestBody(details.requestBody)}
                            </TabsContent>
                          )}

                          <TabsContent value="responses" className="space-y-4 mt-4">
                            {renderResponses(details.responses)}
                          </TabsContent>
                        </Tabs>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="schemas" className="space-y-6">
          {Object.entries(apiDocs.components.schemas).map(([name, schema]: [string, any]) => (
            <Card key={name}>
              <CardHeader>
                <CardTitle className="text-lg font-mono">{name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value={name}>
                    <AccordionTrigger>
                      <div className="flex items-center space-x-2">
                        <Code className="h-4 w-4" />
                        <span>Schema Definition</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto">
                        {JSON.stringify(schema, null, 2)}
                      </pre>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {schema.properties && (
                  <div className="mt-4 space-y-3">
                    <h3 className="text-sm font-medium">Properties</h3>
                    <div className="border rounded-md divide-y">
                      {Object.entries(schema.properties).map(([propName, propDetails]: [string, any]) => (
                        <div key={propName} className="p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">
                                {propName}
                                {schema.required?.includes(propName) && <span className="text-red-500 ml-1">*</span>}
                              </p>
                              <p className="text-sm text-gray-500">
                                {propDetails.type}
                                {propDetails.format && ` (${propDetails.format})`}
                                {propDetails.nullable && ' • nullable'}
                              </p>
                            </div>
                            {schema.required?.includes(propName) && (
                              <Badge variant="outline" className="text-red-500 border-red-200">
                                Required
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm">{propDetails.description}</p>
                          {propDetails.enum && (
                            <div className="mt-1">
                              <p className="text-xs text-gray-500">Possible values:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {propDetails.enum.map((value: string) => (
                                  <Badge key={value} variant="secondary" className="text-xs">
                                    {value}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
