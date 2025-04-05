
import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateWordFrequency, matchDocuments } from '@/utils/documentMatching';
import { useToast } from '@/hooks/use-toast';

export type Document = {
  id: string;
  name: string;
  content: string;
  uploadedAt: Date;
  userId: string;
};

export type User = {
  id: string;
  name: string;
  isAdmin: boolean;
  credits: number;
  usedCredits: number;
  dailyLimit: number;
};

export type CreditRequest = {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
};

type AppContextType = {
  // User management
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Document management
  documents: Document[];
  addDocument: (doc: Omit<Document, 'id' | 'uploadedAt'>) => void;
  matchedDocuments: { doc: Document; similarity: number }[];
  performMatch: (sourceText: string, algorithm: 'frequency' | 'cosine' | 'levenshtein') => void;
  
  // Credit system
  requestCredits: (amount: number, reason: string) => void;
  creditRequests: CreditRequest[];
  approveCreditRequest: (requestId: string) => void;
  rejectCreditRequest: (requestId: string) => void;
  
  // Stats
  userScans: Record<string, number>;
  totalScansToday: number;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    isAdmin: false,
    credits: 20,
    usedCredits: 0,
    dailyLimit: 20
  },
  {
    id: 'admin1',
    name: 'Admin User',
    isAdmin: true,
    credits: 100,
    usedCredits: 0,
    dailyLimit: 100
  }
];

const mockDocuments: Document[] = [
  {
    id: 'doc1',
    name: 'Sample Report 1',
    content: 'This is a sample document about artificial intelligence and machine learning.',
    uploadedAt: new Date('2023-01-15'),
    userId: 'user1'
  },
  {
    id: 'doc2',
    name: 'Sample Report 2',
    content: 'Machine learning is a subset of artificial intelligence that focuses on data analysis.',
    uploadedAt: new Date('2023-02-20'),
    userId: 'user1'
  },
  {
    id: 'doc3',
    name: 'Technical Document',
    content: 'The document scanning system uses word frequency comparison for matching documents.',
    uploadedAt: new Date('2023-03-10'),
    userId: 'admin1'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [matchedDocuments, setMatchedDocuments] = useState<{ doc: Document; similarity: number }[]>([]);
  const [creditRequests, setCreditRequests] = useState<CreditRequest[]>([]);
  const [userScans, setUserScans] = useState<Record<string, number>>({});
  const [totalScansToday, setTotalScansToday] = useState(0);
  
  const { toast } = useToast();

  // Generate a simple ID
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add a new document
  const addDocument = (doc: Omit<Document, 'id' | 'uploadedAt'>) => {
    const newDoc: Document = {
      ...doc,
      id: generateId(),
      uploadedAt: new Date()
    };
    
    setDocuments(prev => [...prev, newDoc]);
    toast({
      title: "Document Added",
      description: `${doc.name} has been uploaded successfully.`
    });
  };

  // Perform document matching
  const performMatch = (sourceText: string, algorithm: 'frequency' | 'cosine' | 'levenshtein') => {
    if (!currentUser) return;
    
    // Check if user has credits
    if (currentUser.usedCredits >= currentUser.dailyLimit && !currentUser.isAdmin) {
      toast({
        title: "Daily Limit Reached",
        description: "You've reached your daily scan limit. Request more credits.",
        variant: "destructive"
      });
      return;
    }
    
    // Perform matching
    const results = matchDocuments(
      sourceText, 
      documents.map(doc => ({ id: doc.id, content: doc.content })), 
      algorithm
    );
    
    const matchedDocs = results.map(result => ({
      doc: documents.find(doc => doc.id === result.id)!,
      similarity: result.similarity
    }));
    
    setMatchedDocuments(matchedDocs);
    
    // Update user credits
    if (!currentUser.isAdmin) {
      setCurrentUser({
        ...currentUser,
        usedCredits: currentUser.usedCredits + 1
      });
    }
    
    // Update stats
    setUserScans(prev => ({
      ...prev,
      [currentUser.id]: (prev[currentUser.id] || 0) + 1
    }));
    
    setTotalScansToday(prev => prev + 1);
    
    toast({
      title: "Match Completed",
      description: `Found ${matchedDocs.length} matching documents.`
    });
  };

  // Request additional credits
  const requestCredits = (amount: number, reason: string) => {
    if (!currentUser) return;
    
    const newRequest: CreditRequest = {
      id: generateId(),
      userId: currentUser.id,
      userName: currentUser.name,
      amount,
      reason,
      status: 'pending',
      createdAt: new Date()
    };
    
    setCreditRequests(prev => [...prev, newRequest]);
    
    toast({
      title: "Credit Request Submitted",
      description: `Your request for ${amount} credits has been submitted.`
    });
  };

  // Approve a credit request
  const approveCreditRequest = (requestId: string) => {
    const request = creditRequests.find(req => req.id === requestId);
    if (!request) return;
    
    // Update request status
    setCreditRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' } : req
    ));
    
    // Add credits to user
    const userId = request.userId;
    const userToUpdate = mockUsers.find(user => user.id === userId);
    
    if (userToUpdate) {
      userToUpdate.credits += request.amount;
      // If it's the current user, update state
      if (currentUser && currentUser.id === userId) {
        setCurrentUser({
          ...currentUser,
          credits: currentUser.credits + request.amount
        });
      }
    }
    
    toast({
      title: "Credit Request Approved",
      description: `Added ${request.amount} credits to ${request.userName}.`
    });
  };

  // Reject a credit request
  const rejectCreditRequest = (requestId: string) => {
    setCreditRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' } : req
    ));
    
    const request = creditRequests.find(req => req.id === requestId);
    
    toast({
      title: "Credit Request Rejected",
      description: `Rejected request from ${request?.userName}.`
    });
  };

  const value = {
    currentUser,
    setCurrentUser,
    documents,
    addDocument,
    matchedDocuments,
    performMatch,
    requestCredits,
    creditRequests,
    approveCreditRequest,
    rejectCreditRequest,
    userScans,
    totalScansToday
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
