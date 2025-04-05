
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { Mail, ArrowLeft, Check, RotateCw } from 'lucide-react';

const Verify = () => {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const { verifyOtp, sendVerificationEmail, users, pendingVerifications } = useApp();
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const decodedEmail = email ? decodeURIComponent(email) : '';
  
  useEffect(() => {
    // Check if email exists and is not already verified
    const user = users.find(u => u.email === decodedEmail);
    
    if (!decodedEmail || !user) {
      toast.error("Invalid verification link");
      navigate("/landing");
      return;
    }
    
    if (user.verified) {
      toast.info("Your email is already verified. Please log in.");
      navigate("/landing");
    }
  }, [decodedEmail, users, navigate]);
  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      toast.error("Please enter the verification code");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await verifyOtp(decodedEmail, otp);
      
      if (success) {
        // Update user verification status
        toast.success("Email verified successfully. You can now log in.");
        navigate("/landing");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResendCode = async () => {
    setResendDisabled(true);
    setCountdown(60); // Disable for 60 seconds
    
    const success = await sendVerificationEmail(decodedEmail);
    
    if (success) {
      toast.success("New verification code sent");
    } else {
      toast.error("Failed to send verification code");
      setResendDisabled(false);
      setCountdown(0);
    }
  };
  
  const handleGoBack = () => {
    navigate("/landing");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <Card className="border border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a verification code to {decodedEmail}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Verify Email
                    </>
                  )}
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Didn't receive a code?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary" 
                onClick={handleResendCode}
                disabled={resendDisabled}
              >
                Resend {countdown > 0 ? `(${countdown}s)` : ''}
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to landing page
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Verify;
