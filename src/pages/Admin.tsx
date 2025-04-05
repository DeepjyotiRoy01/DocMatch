
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Check, X, User } from 'lucide-react';

const Admin = () => {
  const { 
    creditRequests, 
    approveCreditRequest, 
    rejectCreditRequest,
    userScans,
    totalScansToday
  } = useApp();
  
  const pendingRequests = creditRequests.filter(req => req.status === 'pending');
  const processedRequests = creditRequests.filter(req => req.status !== 'pending');
  
  // Prepare data for user scan chart
  const userScanData = Object.entries(userScans).map(([userId, count]) => ({
    userId,
    scans: count,
    name: userId === 'admin1' ? 'Admin User' : 'John Doe' // In a real app, get the actual user names
  }));
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Scans Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalScansToday}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Credit Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingRequests.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Object.keys(userScans).length}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="creditRequests">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="creditRequests">Credit Requests</TabsTrigger>
          <TabsTrigger value="userActivity">User Activity</TabsTrigger>
        </TabsList>
        
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
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => approveCreditRequest(request.id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 border-red-600 hover:bg-red-50"
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
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
