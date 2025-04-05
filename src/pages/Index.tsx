
import React from 'react';
import DocumentUpload from '@/components/DocumentUpload';
import DocumentMatching from '@/components/DocumentMatching';
import MatchResults from '@/components/MatchResults';
import CreditSystem from '@/components/CreditSystem';

const Index = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Document Scanning & Matching System</h1>
        <p className="text-xl text-muted-foreground">
          Upload, match, and analyze documents with smart credit control
        </p>
      </div>
      
      <div className="grid gap-8">
        <DocumentUpload />
        <DocumentMatching />
        <MatchResults />
        <CreditSystem />
      </div>
    </div>
  );
};

export default Index;
