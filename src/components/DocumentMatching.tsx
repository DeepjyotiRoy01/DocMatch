
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const DocumentMatching: React.FC = () => {
  const { performMatch, currentUser } = useApp();
  const [sourceText, setSourceText] = useState('');
  const [algorithm, setAlgorithm] = useState<'frequency' | 'cosine' | 'levenshtein'>('frequency');
  const [isMatching, setIsMatching] = useState(false);
  
  const handleMatch = () => {
    if (!sourceText || !currentUser) return;
    
    setIsMatching(true);
    
    // Simulate processing delay
    setTimeout(() => {
      performMatch(sourceText, algorithm);
      setIsMatching(false);
    }, 1500);
  };

  const creditsRemaining = currentUser ? currentUser.dailyLimit - currentUser.usedCredits : 0;
  const creditStatus = 
    currentUser?.isAdmin 
      ? 'Unlimited (Admin)' 
      : `${creditsRemaining} of ${currentUser?.dailyLimit} remaining`;

  return (
    <Card id="match" className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Document Matching</CardTitle>
        <CardDescription className="flex justify-between">
          <span>Match text against the document database using similarity algorithms</span>
          <span className="font-medium">Credits: {creditStatus}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="algorithm" className="text-sm font-medium">
              Matching Algorithm
            </label>
            <Select
              value={algorithm}
              onValueChange={(value) => setAlgorithm(value as 'frequency' | 'cosine' | 'levenshtein')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select matching algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Algorithms</SelectLabel>
                  <SelectItem value="frequency">Word Frequency Comparison</SelectItem>
                  <SelectItem value="cosine">Cosine Similarity</SelectItem>
                  <SelectItem value="levenshtein">Levenshtein Distance</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="source-text" className="text-sm font-medium">
              Source Text
            </label>
            <Textarea
              id="source-text"
              placeholder="Enter or paste text to match against the database..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              rows={6}
            />
          </div>
          
          <Button 
            onClick={handleMatch} 
            disabled={!sourceText || isMatching || (currentUser?.usedCredits ?? 0) >= (currentUser?.dailyLimit ?? 0) && !currentUser?.isAdmin}
            className="w-full"
          >
            {isMatching ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                Match Documents
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentMatching;
