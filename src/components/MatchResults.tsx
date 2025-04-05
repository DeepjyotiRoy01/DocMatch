
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

const MatchResults: React.FC = () => {
  const { matchedDocuments } = useApp();
  const [minSimilarity, setMinSimilarity] = useState(0);
  const [sortOrder, setSortOrder] = useState<'descending' | 'ascending' | 'date'>('descending');
  
  const handleDownload = (doc: { doc: { name: string; content: string }; similarity: number }) => {
    const blob = new Blob([doc.doc.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.doc.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper function to format similarity as percentage with 2 decimal places
  const formatSimilarity = (similarity: number) => {
    return `${(similarity * 100).toFixed(2)}%`;
  };

  // Helper function for similarity color
  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.7) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (similarity >= 0.4) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (similarity >= 0.2) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };
  
  // Sort and filter results
  const filteredAndSortedResults = [...matchedDocuments]
    .filter(doc => doc.similarity >= minSimilarity)
    .sort((a, b) => {
      if (sortOrder === 'ascending') return a.similarity - b.similarity;
      if (sortOrder === 'descending') return b.similarity - a.similarity;
      // Sort by date
      return new Date(b.doc.uploadedAt).getTime() - new Date(a.doc.uploadedAt).getTime();
    });

  return (
    <Card id="documents" className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Match Results</CardTitle>
          <CardDescription>
            {matchedDocuments.length 
              ? `Found ${matchedDocuments.length} matching documents`
              : 'No matches found yet. Try matching some text.'}
          </CardDescription>
        </div>
        
        {matchedDocuments.length > 0 && (
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <SlidersHorizontal className="h-3.5 w-3.5 mr-2" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Minimum Similarity</h4>
                  <div className="flex items-center space-x-2">
                    <Slider
                      defaultValue={[0]}
                      max={1}
                      step={0.01}
                      value={[minSimilarity]}
                      onValueChange={(values) => setMinSimilarity(values[0])}
                    />
                    <span className="w-12 text-sm font-medium">
                      {Math.round(minSimilarity * 100)}%
                    </span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <ArrowUpDown className="h-3.5 w-3.5 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem 
                  onClick={() => setSortOrder('descending')}
                  className="cursor-pointer"
                >
                  Highest Match First
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortOrder('ascending')}
                  className="cursor-pointer"
                >
                  Lowest Match First
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setSortOrder('date')}
                  className="cursor-pointer"
                >
                  Newest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {filteredAndSortedResults.length > 0 ? (
          <div className="grid gap-4">
            {filteredAndSortedResults.map((doc) => (
              <div 
                key={doc.doc.id} 
                className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{doc.doc.name}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={getSimilarityColor(doc.similarity)}
                      >
                        Match: {formatSimilarity(doc.similarity)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(doc.doc.uploadedAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        {doc.doc.content.length} characters
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDownload(doc)}
                  className="sm:self-start ml-auto sm:ml-0"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        ) : matchedDocuments.length > 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="bg-primary/10 p-6 rounded-full mb-4">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Results Match Your Filter</h3>
            <p className="text-muted-foreground">
              Try lowering the minimum similarity threshold.
            </p>
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
