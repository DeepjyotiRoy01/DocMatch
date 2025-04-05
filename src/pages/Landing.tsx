
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useTheme } from '@/contexts/ThemeContext';
import { useApp } from '@/contexts/AppContext';
import { ArrowRight, Sun, Moon, FileText, Search, BarChart3, Check, Shield, Zap, ChevronDown } from 'lucide-react';
import AuthDialog from '@/components/auth/AuthDialog';

const Landing = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useApp();
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
    }

    // Add scroll event listener
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isAuthenticated, navigate]);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: FileText,
      title: 'Document Management',
      description: 'Upload and manage your documents securely with smart storage and organization.'
    },
    {
      icon: Search,
      title: 'Advanced Matching',
      description: 'Match documents using multiple algorithms with granular percentage matching results.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Get detailed insights and visualizations about your document comparison activities.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Industry-leading security ensures your sensitive documents remain private.'
    },
    {
      icon: Check,
      title: 'Multiple Comparison Methods',
      description: 'Choose from word frequency, cosine similarity, or Levenshtein distance for best results.'
    },
    {
      icon: Zap,
      title: 'Fast & Efficient',
      description: 'Our optimized algorithms provide quick matching even with large document libraries.'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background to-primary/5"></div>
        <div className="absolute -top-64 -right-64 w-[40rem] h-[40rem] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute top-1/4 -left-64 w-[30rem] h-[30rem] rounded-full bg-primary/10 blur-3xl"></div>
        
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="absolute left-1/3 top-0 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
        <div className="absolute left-2/3 top-0 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
      </div>

      {/* Navigation */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-2 backdrop-blur-md bg-background/80 shadow' : 'py-4'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <BarChart3 className="w-6 h-6 text-primary mr-2" />
            <h1 className="text-xl font-bold text-gradient tracking-tight">DocMatch</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="rounded-full"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <Dialog open={authOpen} onOpenChange={setAuthOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="hidden sm:flex">
                  Login / Sign Up
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <AuthDialog onClose={() => setAuthOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 relative z-10">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Document Matching</span> <br />
            <span className="text-3xl md:text-5xl">Powered by Advanced Algorithms</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Compare and match documents with precision using our intelligent document analysis system.
            Upload documents, analyze content, and identify similarities with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Dialog open={authOpen} onOpenChange={setAuthOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <AuthDialog onClose={() => setAuthOpen(false)} />
              </DialogContent>
            </Dialog>
            
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={scrollToFeatures}>
              Explore Features <ChevronDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-20 relative">
            <div className="w-full h-[400px] bg-card rounded-lg shadow-xl overflow-hidden border border-primary/20 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-card"></div>
              <div className="absolute inset-0 p-6 flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-primary mb-4 mx-auto" />
                    <h2 className="text-2xl font-bold mb-2">DocMatch Platform</h2>
                    <p className="text-muted-foreground">
                      Document matching and comparison with exceptional accuracy
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-[80%] h-10 bg-primary/10 blur-xl rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative z-10">
        <div className="container mx-auto text-center max-w-4xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground">
            Discover what makes DocMatch the premier solution for document analysis and comparison
          </p>
        </div>
        
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-card border border-primary/10 rounded-lg p-6 hover:border-primary/30 transition-all hover:shadow-lg hover-scale"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="container mx-auto mt-16 text-center">
          <Dialog open={authOpen} onOpenChange={setAuthOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <AuthDialog onClose={() => setAuthOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-card/50 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our simple three-step process makes document matching and analysis straightforward
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Upload</h3>
              <p className="text-muted-foreground">
                Upload your documents to our secure platform for analysis and storage
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Match</h3>
              <p className="text-muted-foreground">
                Select your matching algorithm and document comparison settings
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Analyze</h3>
              <p className="text-muted-foreground">
                Review detailed percentage-based match results and document insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl bg-primary/10 rounded-2xl p-10 border border-primary/20">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of users leveraging DocMatch to analyze and compare documents with precision
            </p>
            
            <Dialog open={authOpen} onOpenChange={setAuthOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg px-8 py-6">
                  Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <AuthDialog onClose={() => setAuthOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-muted">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <BarChart3 className="w-6 h-6 text-primary mr-2" />
            <h1 className="text-xl font-bold text-gradient tracking-tight">DocMatch</h1>
          </div>
          
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DocMatch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
