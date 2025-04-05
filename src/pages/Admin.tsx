
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Check, X, User, Users, CreditCard, Search, FileText } from 'lucide-react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const { 
    creditRequests, 
    approveCreditRequest, 
    rejectCreditRequest,
    userScans,
    totalScansToday,
    users,
    currentUser,
    documents
  } = useApp();
  
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  
  // Redirect if not admin
  React.useEffect(() => {
    if (!currentUser?.isAdmin) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  const pendingRequests = creditRequests.filter(req => req.status === 'pending');
  const processedRequests = creditRequests.filter(req => req.status !== 'pending');
  
  // Prepare data for user scan chart
  const userScanData = Object.entries(userScans).map(([userId, count]) => {
    const user = users.find(u => u.id === userId);
    return {
      userId,
      scans: count,
      name: user ? user.name : 'Unknown User'
    };
  });
  
  // Pie chart data
  const pieChartData = [
    { name: 'Active Users', value: users.filter(u => u.verified).length },
    { name: 'Pending Verification', value: users.filter(u => !u.verified).length }
  ];
  const COLORS = ['#0088FE', '#FFBB28'];
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Scans Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{totalScansToday}</div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Search className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Credit Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{pendingRequests.length}</div>
              <div className="bg-primary/10 p-2 rounded-full">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{users.length}</div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{documents.length}</div>
              <div className="bg-primary/10 p-2 rounded-full">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="creditRequests">Credit Requests</TabsTrigger>
          <TabsTrigger value="userActivity">User Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage registered users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {users.map((user) => (
                  <Collapsible 
                    key={user.id} 
                    open={expandedUser === user.id} 
                    onOpenChange={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                    className="border rounded-lg overflow-hidden"
                  >
                    <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.verified ? "default" : "outline"}>
                          {user.verified ? "Verified" : "Unverified"}
                        </Badge>
                        <Badge variant={user.isAdmin ? "default" : "outline"} className={user.isAdmin ? "bg-amber-500" : ""}>
                          {user.isAdmin ? "Admin" : "User"}
                        </Badge>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 border-t bg-muted/20">
                      <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium mb-1">User ID</p>
                            <p className="text-sm text-muted-foreground">{user.id}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Status</p>
                            <p className="text-sm text-muted-foreground">{user.isAdmin ? "Administrator" : "Standard User"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Daily Limit</p>
                            <p className="text-sm text-muted-foreground">{user.dailyLimit} credits</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Used Today</p>
                            <p className="text-sm text-muted-foreground">{user.usedCredits} credits</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Documents</p>
                            <p className="text-sm text-muted-foreground">
                              {documents.filter(doc => doc.userId === user.id).length} uploaded
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Scan Activity</p>
                            <p className="text-sm text-muted-foreground">
                              {userScans[user.id] || 0} scans performed
                            </p>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="creditRequests" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Credit Requests</CardTitle>
              <CardDescription>
                Review and manage credit requests from users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 && processedRequests.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No credit requests available</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingRequests.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Pending Requests</h3>
                      <div className="space-y-3">
                        {pendingRequests.map(request => (
                          <div 
                            key={request.id} 
                            className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between"
                          >
                            <div className="mb-3 sm:mb-0">
                              <div className="flex items-center">
                                <div className="bg-primary/10 p-2 rounded-full mr-3">
                                  <User className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{request.userName}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Requested {request.amount} credits
                                  </p>
                                </div>
                              </div>
                              <p className="mt-2 text-sm border-l-2 border-muted pl-3 ml-9">
                                "{request.reason}"
                              </p>
                            </div>
                            <div className="flex space-x-2 sm:self-start">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                                onClick={() => approveCreditRequest(request.id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                onClick={() => rejectCreditRequest(request.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {processedRequests.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Processed Requests</h3>
                      <div className="space-y-3">
                        {processedRequests.map(request => (
                          <div 
                            key={request.id} 
                            className="p-4 border rounded-lg flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <div className="bg-primary/10 p-2 rounded-full mr-3">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">{request.userName}</h4>
                                <div className="flex items-center mt-1">
                                  <span className="text-sm text-muted-foreground mr-2">
                                    {request.amount} credits
                                  </span>
                                  <Badge variant={request.status === 'approved' ? 'default' : 'destructive'}>
                                    {request.status === 'approved' ? 'Approved' : 'Rejected'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="userActivity" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Scan Activity</CardTitle>
                <CardDescription>
                  Track scan activity by user
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {userScanData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={userScanData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="scans" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No scan activity recorded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Verification Status</CardTitle>
                <CardDescription>
                  Overview of verified vs unverified users
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} users`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
