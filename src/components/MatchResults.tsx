
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const MatchResults: React.FC = () => {
  const { matchedDocuments } = useApp();
  
  const handleDownload = (doc: { doc: { name: string; content: string }; similarity: number }) => {
    const blob = new Blob([doc.doc.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.doc.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper function to format similarity as percentage
  const formatSimilarity = (similarity: number) => {
    return `${Math.round(similarity * 100)}%`;
  };

  // Helper function for similarity color
  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.7) return 'bg-green-100 text-green-800';
    if (similarity >= 0.4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card id="documents" className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Match Results</CardTitle>
        <CardDescription>
          {matchedDocuments.length 
            ? `Found ${matchedDocuments.length} matching documents`
            : 'No matches found yet. Try matching some text.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {matchedDocuments.length > 0 ? (
          <div className="grid gap-4">
            {matchedDocuments.map((doc, index) => (
              <div 
                key={doc.doc.id} 
                className="p-4 border rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{doc.doc.name}</h4>
                    <div className="flex items-center mt-1">
                      <Badge 
                        variant="outline" 
                        className={getSimilarityColor(doc.similarity)}
                      >
                        Match: {formatSimilarity(doc.similarity)}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">
                        {new Date(doc.doc.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDownload(doc)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="bg-primary/10 p-6 rounded-full mb-4">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Match Results Yet</h3>
            <p className="text-muted-foreground">
              Upload documents and try matching text against them to see results here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchResults;
