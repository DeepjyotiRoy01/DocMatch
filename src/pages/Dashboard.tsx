
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BookOpen, CreditCard, FileText, Search } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, documents, matchedDocuments, userScans } = useApp();
  
  // Filter documents for the current user
  const userDocuments = currentUser 
    ? documents.filter(doc => doc.userId === currentUser.id)
    : [];
  
  // Get user's scan count
  const userScanCount = currentUser ? (userScans[currentUser.id] || 0) : 0;
  
  // Mock data for charts (in real app, this would come from actual user activity)
  const activityData = [
    { name: 'Mon', scans: 4, uploads: 2 },
    { name: 'Tue', scans: 2, uploads: 1 },
    { name: 'Wed', scans: 7, uploads: 3 },
    { name: 'Thu', scans: 5, uploads: 0 },
    { name: 'Fri', scans: 8, uploads: 1 },
    { name: 'Sat', scans: 3, uploads: 2 },
    { name: 'Sun', scans: userScanCount, uploads: userDocuments.length }
  ];
  
  // Calculate average similarity
  const averageSimilarity = matchedDocuments.length
    ? (matchedDocuments.reduce((sum, match) => sum + match.similarity, 0) / matchedDocuments.length * 100).toFixed(1)
    : "N/A";
    
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <div className="flex items-center">
          <div className="bg-primary/10 p-2 rounded-full">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div className="ml-2">
            <p className="text-sm text-muted-foreground">Credits</p>
            <p className="font-semibold">
              {currentUser ? `${currentUser.dailyLimit - currentUser.usedCredits} remaining` : 'N/A'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Documents Uploaded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{userDocuments.length}</div>
              <div className="bg-primary/10 p-2 rounded-full">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Matches Run</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{userScanCount}</div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Search className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Match Similarity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{averageSimilarity}%</div>
              <div className="bg-primary/10 p-2 rounded-full">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Credits Used Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{currentUser?.usedCredits || 0}</div>
              <div className="bg-primary/10 p-2 rounded-full">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your document scanning and upload activity for the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="scans" name="Scans" fill="hsl(var(--primary))" />
                  <Bar dataKey="uploads" name="Uploads" fill="hsl(var(--primary) / 0.5)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Match Quality Trends</CardTitle>
            <CardDescription>
              Average similarity scores from your recent matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { date: 'Mon', similarity: 45 },
                    { date: 'Tue', similarity: 52 },
                    { date: 'Wed', similarity: 60 },
                    { date: 'Thu', similarity: 71 },
                    { date: 'Fri', similarity: 58 },
                    { date: 'Sat', similarity: 63 },
                    { date: 'Sun', similarity: matchedDocuments.length ? parseFloat(averageSimilarity as string) : 65 }
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="similarity" 
                    name="Match %" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>
            Your most recently uploaded documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userDocuments.length > 0 ? (
            <div className="space-y-4">
              {userDocuments.slice(0, 5).map((doc) => (
                <div 
                  key={doc.id} 
                  className="flex justify-between items-center p-3 bg-card/60 rounded-lg border border-border"
                >
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {doc.content.length} chars
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">You haven't uploaded any documents yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
