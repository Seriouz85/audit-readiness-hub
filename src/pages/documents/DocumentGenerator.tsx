import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileOutput, FileText } from 'lucide-react';

const DocumentGenerator = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Document Generator</h1>
        <Button>
          <FileOutput className="mr-2 h-4 w-4" />
          Generate Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Placeholder for document templates */}
            <div className="flex items-center p-4 border rounded-lg">
              <FileText className="h-6 w-6 mr-4" />
              <div>
                <h3 className="font-medium">Document Template</h3>
                <p className="text-sm text-gray-500">Description of the template</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentGenerator; 