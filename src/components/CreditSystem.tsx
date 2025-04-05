
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, Plus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const CreditSystem: React.FC = () => {
  const { currentUser, requestCredits } = useApp();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(10);
  const [reason, setReason] = useState('');
  
  const handleRequestCredits = () => {
    if (amount <= 0 || !reason.trim()) return;
    
    requestCredits(amount, reason);
    setOpen(false);
    setAmount(10);
    setReason('');
  };

  // Calculate credits usage progress
  const creditsUsed = currentUser?.usedCredits || 0;
  const creditsTotal = currentUser?.dailyLimit || 20;
  const creditsPercentage = Math.min(100, Math.round((creditsUsed / creditsTotal) * 100));

  return (
    <Card id="credits" className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Credits System</CardTitle>
        <CardDescription>
          {currentUser?.isAdmin 
            ? 'As an admin, you have unlimited scanning credits' 
            : 'Monitor your document scanning credits and request more if needed'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!currentUser?.isAdmin && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Daily Usage</span>
                <span className="text-sm text-muted-foreground">
                  {creditsUsed} of {creditsTotal} credits used
                </span>
              </div>
              <Progress value={creditsPercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="border rounded-lg p-4 text-center">
                <span className="text-2xl font-bold text-primary">{creditsTotal - creditsUsed}</span>
                <p className="text-sm text-muted-foreground mt-1">Credits Remaining</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <span className="text-2xl font-bold">{creditsUsed}</span>
                <p className="text-sm text-muted-foreground mt-1">Scans Performed</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        {!currentUser?.isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Request More Credits
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Additional Credits</DialogTitle>
                <DialogDescription>
                  Submit a request for more document scanning credits.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="amount" className="text-right text-sm font-medium col-span-1">
                    Amount
                  </label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 0))}
                    min={1}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="reason" className="text-right text-sm font-medium col-span-1">
                    Reason
                  </label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explain why you need additional credits..."
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRequestCredits} disabled={amount <= 0 || !reason.trim()}>
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
};

export default CreditSystem;
