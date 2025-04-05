
import React from 'react';
import DocumentUpload from '@/components/DocumentUpload';
import DocumentMatching from '@/components/DocumentMatching';
import MatchResults from '@/components/MatchResults';
import CreditSystem from '@/components/CreditSystem';
import { FileUp, Search, BarChart3, CreditCard } from 'lucide-react';

const Index = () => {
  return (
    <div className="space-y-12">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-4 text-gradient">Document Scanning and Matching</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload, match, and analyze documents with our intelligent system
        </p>
      </div>
      
      <div className="grid gap-8">
        <section id="upload" className="rounded-xl p-1 bg-gradient-to-r from-primary/30 to-accent/30">
          <div className="bg-card rounded-lg p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                <FileUp className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Document Upload</h2>
            </div>
            <DocumentUpload />
          </div>
        </section>
        
        <section id="match" className="rounded-xl p-1 bg-gradient-to-r from-accent/30 to-primary/30">
          <div className="bg-card rounded-lg p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Document Matching</h2>
            </div>
            <DocumentMatching />
          </div>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section id="results" className="rounded-xl p-1 glass-card">
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Match Results</h2>
              </div>
              <MatchResults />
            </div>
          </section>
          
          <section id="credits" className="rounded-xl p-1 glass-card">
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Credit System</h2>
              </div>
              <CreditSystem />
            </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-1/6 bg-gradient-to-t from-primary/10 to-transparent -z-10"></div>
      <div className="fixed top-0 right-0 w-1/4 h-screen bg-gradient-to-l from-primary/5 to-transparent -z-10"></div>
    </div>
  );
};

export default Index;
