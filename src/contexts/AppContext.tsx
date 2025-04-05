import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateWordFrequency, matchDocuments } from '@/utils/documentMatching';
import { useToast } from '@/hooks/use-toast';
import { toast } from "sonner";

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
  email: string;
  isAdmin: boolean;
  credits: number;
  usedCredits: number;
  dailyLimit: number;
  verified: boolean;
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
  // UI State
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  
  // Authentication
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  deleteAccount: () => void;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  sendVerificationEmail: (email: string) => Promise<boolean>;
  
  // Document management
  documents: Document[];
  addDocument: (doc: Omit<Document, 'id' | 'uploadedAt'>) => void;
  matchedDocuments: { doc: Document; similarity: number }[];
  performMatch: (sourceText: string, algorithm: 'frequency' | 'cosine' | 'levenshtein', matchType: 'all' | 'single' | 'text', documentId?: string) => void;
  
  // Credit system
  requestCredits: (amount: number, reason: string) => void;
  creditRequests: CreditRequest[];
  approveCreditRequest: (requestId: string) => void;
  rejectCreditRequest: (requestId: string) => void;
  
  // Stats
  userScans: Record<string, number>;
  totalScansToday: number;
  users: User[];
  
  // Verification data
  pendingVerifications: Record<string, {otp: string, expires: Date, verified: boolean}>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'deepjyotiroy.djr@gmail.com',
    isAdmin: true,
    credits: 100,
    usedCredits: 0,
    dailyLimit: 100,
    verified: true
  },
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    isAdmin: false,
    credits: 20,
    usedCredits: 0,
    dailyLimit: 20,
    verified: true
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

const USERS_STORAGE_KEY = 'docmatch_users';
const DOCUMENTS_STORAGE_KEY = 'docmatch_documents';
const CREDIT_REQUESTS_STORAGE_KEY = 'docmatch_credit_requests';
const USER_SCANS_STORAGE_KEY = 'docmatch_user_scans';
const CURRENT_USER_STORAGE_KEY = 'docmatch_current_user';
const PENDING_VERIFICATIONS_KEY = 'docmatch_pending_verifications';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pendingVerifications, setPendingVerifications] = useState<Record<string, {otp: string, expires: Date, verified: boolean}>>({});
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [matchedDocuments, setMatchedDocuments] = useState<{ doc: Document; similarity: number }[]>([]);
  const [creditRequests, setCreditRequests] = useState<CreditRequest[]>([]);
  const [userScans, setUserScans] = useState<Record<string, number>>({});
  const [totalScansToday, setTotalScansToday] = useState(0);
  
  useEffect(() => {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(mockUsers);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mockUsers));
    }
    
    const storedDocuments = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    if (storedDocuments) {
      setDocuments(JSON.parse(storedDocuments).map((doc: any) => ({
        ...doc,
        uploadedAt: new Date(doc.uploadedAt)
      })));
    } else {
      setDocuments(mockDocuments);
      localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(mockDocuments));
    }
    
    const storedCreditRequests = localStorage.getItem(CREDIT_REQUESTS_STORAGE_KEY);
    if (storedCreditRequests) {
      setCreditRequests(JSON.parse(storedCreditRequests).map((req: any) => ({
        ...req,
        createdAt: new Date(req.createdAt)
      })));
    }
    
    const storedUserScans = localStorage.getItem(USER_SCANS_STORAGE_KEY);
    if (storedUserScans) {
      try {
        const parsedUserScans = JSON.parse(storedUserScans) as Record<string, number>;
        setUserScans(parsedUserScans);
        
        const scansTotal = Object.values(parsedUserScans).reduce(
          (acc: number, val: number) => acc + val, 
          0
        );
        
        setTotalScansToday(() => scansTotal);
      } catch (error) {
        console.error("Error parsing user scans data:", error);
        setUserScans({});
        setTotalScansToday(0);
      }
    }
    
    const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
    
    const storedVerifications = localStorage.getItem(PENDING_VERIFICATIONS_KEY);
    if (storedVerifications) {
      const verifications = JSON.parse(storedVerifications);
      Object.keys(verifications).forEach(key => {
        verifications[key].expires = new Date(verifications[key].expires);
      });
      setPendingVerifications(verifications);
    }
  }, []);
  
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  }, [users]);
  
  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
    }
  }, [documents]);
  
  useEffect(() => {
    localStorage.setItem(CREDIT_REQUESTS_STORAGE_KEY, JSON.stringify(creditRequests));
  }, [creditRequests]);
  
  useEffect(() => {
    localStorage.setItem(USER_SCANS_STORAGE_KEY, JSON.stringify(userScans));
  }, [userScans]);
  
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  }, [currentUser]);
  
  useEffect(() => {
    localStorage.setItem(PENDING_VERIFICATIONS_KEY, JSON.stringify(pendingVerifications));
  }, [pendingVerifications]);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      const otp = generateOtp();
      const expiry = new Date();
      expiry.setMinutes(expiry.getMinutes() + 10);
      
      setPendingVerifications(prev => ({
        ...prev,
        [email]: {
          otp,
          expires: expiry,
          verified: false
        }
      }));
      
      console.log(`Verification OTP for ${email}: ${otp}`);
      toast.success(`Verification code sent to ${email}. Check the console for the OTP.`);
      return true;
    } catch (error) {
      console.error("Error sending verification email:", error);
      return false;
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    const verification = pendingVerifications[email];
    if (!verification) {
      toast.error("No verification pending for this email");
      return false;
    }
    
    if (new Date() > verification.expires) {
      toast.error("Verification code has expired");
      return false;
    }
    
    if (verification.otp !== otp) {
      toast.error("Invalid verification code");
      return false;
    }
    
    setPendingVerifications(prev => ({
      ...prev,
      [email]: {
        ...prev[email],
        verified: true
      }
    }));
    
    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === "deepjyotiroy.djr@gmail.com" && password === "DJR@123456") {
      const admin = users.find(u => u.email === email);
      if (admin) {
        setCurrentUser(admin);
        setIsAuthenticated(true);
        toast.success("Admin login successful!");
        return true;
      }
    }
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      toast.error("User not found");
      return false;
    }
    
    if (!user.verified) {
      toast.error("Please verify your email first");
      return false;
    }
    
    setCurrentUser(user);
    setIsAuthenticated(true);
    toast.success("Login successful!");
    return true;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    if (users.some(u => u.email === email)) {
      toast.error("User with this email already exists");
      return false;
    }
    
    const newUser: User = {
      id: generateId(),
      name,
      email,
      isAdmin: false,
      credits: 20,
      usedCredits: 0,
      dailyLimit: 20,
      verified: false
    };
    
    setUsers(prev => [...prev, newUser]);
    
    await sendVerificationEmail(email);
    
    toast.success("Account created! Please verify your email address");
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };

  const deleteAccount = () => {
    if (!currentUser) return;
    
    setUsers(prev => prev.filter(u => u.id !== currentUser.id));
    setDocuments(prev => prev.filter(d => d.userId !== currentUser.id));
    setCreditRequests(prev => prev.filter(r => r.userId !== currentUser.id));
    
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    toast.success("Account deleted successfully");
  };

  const addDocument = (doc: Omit<Document, 'id' | 'uploadedAt'>) => {
    const newDoc: Document = {
      ...doc,
      id: generateId(),
      uploadedAt: new Date()
    };
    
    setDocuments(prev => [...prev, newDoc]);
    toast.success(`${doc.name} has been uploaded successfully.`);
  };

  const performMatch = (sourceText: string, algorithm: 'frequency' | 'cosine' | 'levenshtein', matchType: 'all' | 'single' | 'text', documentId?: string) => {
    if (!currentUser) return;
    
    if (currentUser.usedCredits >= currentUser.dailyLimit && !currentUser.isAdmin) {
      toast.error("You've reached your daily scan limit. Request more credits.");
      return;
    }
    
    let docsToMatch = [];
    
    if (matchType === 'all') {
      docsToMatch = documents;
    } else if (matchType === 'single' && documentId) {
      const doc = documents.find(d => d.id === documentId);
      if (doc) {
        docsToMatch = [doc];
      }
    }
    
    const results = matchDocuments(
      sourceText, 
      docsToMatch.map(doc => ({ id: doc.id, content: doc.content })), 
      algorithm
    );
    
    const matchedDocs = results.map(result => ({
      doc: documents.find(doc => doc.id === result.id)!,
      similarity: result.similarity
    }));
    
    setMatchedDocuments(matchedDocs);
    
    if (!currentUser.isAdmin) {
      setCurrentUser({
        ...currentUser,
        usedCredits: currentUser.usedCredits + 1
      });
      
      setUsers(prev => prev.map(user => 
        user.id === currentUser.id 
          ? { ...user, usedCredits: user.usedCredits + 1 }
          : user
      ));
    }
    
    setUserScans(prev => ({
      ...prev,
      [currentUser.id]: (prev[currentUser.id] || 0) + 1
    }));
    
    setTotalScansToday(prev => prev + 1);
    
    toast.success(`Found ${matchedDocs.length} matching documents.`);
  };

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
    
    toast.success(`Your request for ${amount} credits has been submitted.`);
  };

  const approveCreditRequest = (requestId: string) => {
    const request = creditRequests.find(req => req.id === requestId);
    if (!request) return;
    
    setCreditRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' } : req
    ));
    
    const userId = request.userId;
    
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, credits: user.credits + request.amount }
        : user
    ));
    
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({
        ...currentUser,
        credits: currentUser.credits + request.amount
      });
    }
    
    toast.success(`Added ${request.amount} credits to ${request.userName}.`);
  };

  const rejectCreditRequest = (requestId: string) => {
    setCreditRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' } : req
    ));
    
    const request = creditRequests.find(req => req.id === requestId);
    
    toast.success(`Rejected request from ${request?.userName}.`);
  };

  const value = {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    
    isAuthenticated,
    currentUser,
    login,
    signup,
    logout,
    deleteAccount,
    verifyOtp,
    sendVerificationEmail,
    
    documents,
    addDocument,
    matchedDocuments,
    performMatch,
    
    requestCredits,
    creditRequests,
    approveCreditRequest,
    rejectCreditRequest,
    
    userScans,
    totalScansToday,
    users,
    
    pendingVerifications
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
