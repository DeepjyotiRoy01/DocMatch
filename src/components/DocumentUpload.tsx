
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, LogIn } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { toast } from "sonner";

const DocumentUpload: React.FC = () => {
  const { addDocument, currentUser } = useApp();
  const [docName, setDocName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [fileContent, setFileContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setDocName(file.name);
    
    // Read .txt file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
    };
    reader.readAsText(file);
  };

  const handleUpload = () => {
    if (!docName || !fileContent || !currentUser) {
      if (!currentUser) {
        toast.error("You need to log in to upload documents");
      }
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      addDocument({
        name: docName,
        content: fileContent,
        userId: currentUser.id
      });
      
      // Reset form
      setDocName('');
      setFileContent('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setIsUploading(false);
    }, 1000);
  };

  if (!currentUser) {
    return (
      <Card id="upload" className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Document Upload</CardTitle>
          <CardDescription>
            Please log in to upload documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="bg-primary/10 p-6 rounded-full inline-block mb-4">
              <LogIn className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
            <p className="text-muted-foreground mb-4">
              You need to be logged in to upload documents to the system.
            </p>
            <Button>
              <LogIn className="h-4 w-4 mr-2" />
              Login to Upload
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="upload" className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Document Upload</CardTitle>
        <CardDescription>
          Upload .txt files to add to the document database (No credit deduction)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="file" className="text-sm font-medium">
                Select File (.txt)
              </label>
              <Input
                ref={fileInputRef}
                id="file"
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Document Name
              </label>
              <Input
                id="name"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Enter document name"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleUpload} 
            disabled={!docName || !fileContent || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              <span className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
