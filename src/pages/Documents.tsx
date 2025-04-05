
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { Download, FileText, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Documents = () => {
  const { documents, currentUser } = useApp();
  
  // Filter documents for the current user if logged in
  const userDocuments = currentUser 
    ? documents.filter(doc => doc.userId === currentUser.id)
    : [];
  
  const handleDownload = (doc: { id: string; name: string; content: string }) => {
    const blob = new Blob([doc.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">My Documents</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>
            {currentUser 
              ? `You have ${userDocuments.length} documents in your library`
              : "Sign in to view your documents"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!currentUser ? (
            <div className="text-center py-10">
              <div className="bg-primary/10 p-6 rounded-full inline-block mb-4">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Sign in to view your documents</h3>
              <p className="text-muted-foreground mb-4">
                You need to be logged in to see your uploaded documents.
              </p>
            </div>
          ) : userDocuments.length > 0 ? (
            <div className="grid gap-4">
              {userDocuments.map((doc) => (
                <div 
                  key={doc.id} 
                  className="p-4 border rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{doc.name}</h4>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-muted-foreground">
                          Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="bg-primary/10 p-6 rounded-full inline-block mb-4">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                You haven't uploaded any documents yet.
              </p>
              <Button asChild>
                <a href="/#upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;
