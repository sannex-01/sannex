import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import ScratchCard from '@/components/ScratchCard';
import { fetchTopClientData, findClientByIdentifier } from '@/utils/topClientData';
import { TopClientData, FeedbackFormData } from '@/types/topClient';
import { ChevronRight, ChevronLeft, Heart, TrendingUp, Calendar, Gift, Send } from 'lucide-react';
import { toast } from 'sonner';

const TopClients = () => {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState(0);
  const [identifier, setIdentifier] = useState('');
  const [clientData, setClientData] = useState<TopClientData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allClients, setAllClients] = useState<TopClientData[]>([]);
  const [feedbackForm, setFeedbackForm] = useState<FeedbackFormData>({
    question1: '',
    question2: '',
    generalFeedback: '',
  });
  const [scratchRevealed, setScratchRevealed] = useState(false);

  useEffect(() => {
    if (year) {
      fetchTopClientData(year).then(setAllClients);
    }
  }, [year]);

  const handleSubmitIdentifier = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const client = findClientByIdentifier(allClients, identifier);
    
    if (client) {
      setClientData(client);
      setCurrentView(1);
      toast.success('Welcome! Let\'s celebrate your journey with us.');
    } else {
      toast.error('We couldn\'t find your information. Please check and try again.');
    }
    
    setIsLoading(false);
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to an API
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('Thank you for your feedback! We truly appreciate it.');
    setTimeout(() => {
      navigate('/en');
    }, 2000);
  };

  const nextView = () => {
    if (currentView < 7) {
      setCurrentView(currentView + 1);
    }
  };

  const prevView = () => {
    if (currentView > 1) {
      setCurrentView(currentView - 1);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  // View 0: Authentication
  if (currentView === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <Card className="w-full max-w-md p-8 space-y-6 shadow-xl animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
              {year} Year Wrap
            </h1>
            <p className="text-xl text-muted-foreground">
              Let's celebrate your journey with SANNEX
            </p>
          </div>

          <form onSubmit={handleSubmitIdentifier} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-lg">
                Enter your Email or Phone Number
              </Label>
              <Input
                id="identifier"
                type="text"
                placeholder="email@example.com or +234..."
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="text-lg p-6"
              />
              <p className="text-sm text-muted-foreground">
                Include country code for phone numbers (e.g., +234)
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full text-lg py-6" 
              disabled={isLoading}
            >
              {isLoading ? 'Checking...' : 'Continue'}
              <ChevronRight className="ml-2" />
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  if (!clientData) return null;

  // View 1: Thank You
  if (currentView === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="w-full max-w-2xl text-center space-y-8 animate-fade-in">
          <Heart className="w-24 h-24 mx-auto text-primary animate-pulse" />
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Thank You,
            <span className="block text-primary mt-4">{clientData.client_name}!</span>
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground leading-relaxed">
            For {new Date(clientData.join_date).getFullYear() === parseInt(year || '2025') 
              ? 'joining us' 
              : 'continuing with us'} this year
          </p>
          <Button onClick={nextView} size="lg" className="text-xl px-8 py-6 mt-8">
            Continue
            <ChevronRight className="ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // View 2: Join Date
  if (currentView === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="w-full max-w-2xl text-center space-y-8 animate-fade-in">
          <Calendar className="w-24 h-24 mx-auto text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Your Journey Started
          </h1>
          <p className="text-5xl md:text-7xl font-bold text-primary">
            {formatDate(clientData.join_date)}
          </p>
          <p className="text-2xl md:text-3xl text-muted-foreground leading-relaxed">
            That's when you put your trust in SANNEX
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={prevView} variant="outline" size="lg" className="text-xl px-8 py-6">
              <ChevronLeft className="mr-2" />
              Back
            </Button>
            <Button onClick={nextView} size="lg" className="text-xl px-8 py-6">
              Continue
              <ChevronRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // View 3: Contribution Stats
  if (currentView === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="w-full max-w-2xl text-center space-y-8 animate-fade-in">
          <TrendingUp className="w-24 h-24 mx-auto text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Your Impact on SANNEX
          </h1>
          
          <div className="space-y-6 bg-card p-8 rounded-2xl shadow-xl">
            <div>
              <p className="text-xl text-muted-foreground mb-2">Total Investment</p>
              <p className="text-5xl md:text-6xl font-bold text-primary">
                {formatCurrency(clientData.total_amount_spent)}
              </p>
            </div>
            
            <div className="pt-6">
              <p className="text-xl text-muted-foreground mb-4">
                You contributed
              </p>
              <div className="space-y-4">
                <p className="text-6xl md:text-7xl font-bold text-primary">
                  {clientData.percentage_contribution}%
                </p>
                <p className="text-xl text-muted-foreground">
                  to SANNEX's growth in {year}
                </p>
                <Progress value={clientData.percentage_contribution} className="h-4" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={prevView} variant="outline" size="lg" className="text-xl px-8 py-6">
              <ChevronLeft className="mr-2" />
              Back
            </Button>
            <Button onClick={nextView} size="lg" className="text-xl px-8 py-6">
              Continue
              <ChevronRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // View 4: Project Showcase
  if (currentView === 4) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="w-full max-w-2xl text-center space-y-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            What We Built Together
          </h1>
          
          <div className="bg-card p-8 rounded-2xl shadow-xl text-left space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              {clientData.project_name}
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              {clientData.project_description}
            </p>
            <div className="pt-4">
              <span className={`inline-block px-6 py-3 rounded-full text-lg font-semibold ${
                clientData.project_status === 'completed' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-yellow-500 text-white'
              }`}>
                {clientData.project_status === 'completed' ? '✓ Completed' : '⏳ Ongoing'}
              </span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={prevView} variant="outline" size="lg" className="text-xl px-8 py-6">
              <ChevronLeft className="mr-2" />
              Back
            </Button>
            <Button onClick={nextView} size="lg" className="text-xl px-8 py-6">
              Continue
              <ChevronRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // View 5: Next Steps
  if (currentView === 5) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="w-full max-w-2xl text-center space-y-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Looking Ahead
          </h1>
          
          {clientData.project_status === 'completed' ? (
            <div className="bg-card p-8 rounded-2xl shadow-xl space-y-6">
              <p className="text-2xl md:text-3xl leading-relaxed">
                We'd love to see you <span className="text-primary font-bold">use and grow</span> your project!
              </p>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Need help taking it to the next level?
              </p>
              <div className="space-y-4 pt-4">
                <p className="text-xl font-semibold">We can help with:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="font-semibold text-lg">📱 Digital Marketing</p>
                    <p className="text-muted-foreground">Reach more customers</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="font-semibold text-lg">🚀 Feature Expansion</p>
                    <p className="text-muted-foreground">Add new capabilities</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="font-semibold text-lg">📊 Analytics & Insights</p>
                    <p className="text-muted-foreground">Data-driven decisions</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="font-semibold text-lg">🔧 Maintenance</p>
                    <p className="text-muted-foreground">Keep it running smoothly</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card p-8 rounded-2xl shadow-xl space-y-6">
              <p className="text-2xl md:text-3xl leading-relaxed">
                We're <span className="text-primary font-bold">excited</span> to continue building with you!
              </p>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Let's move to the next phase of your project by
              </p>
              <p className="text-4xl md:text-5xl font-bold text-primary">
                January 2026
              </p>
              <p className="text-xl text-muted-foreground">
                Together, we'll make it even better.
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Button onClick={prevView} variant="outline" size="lg" className="text-xl px-8 py-6">
              <ChevronLeft className="mr-2" />
              Back
            </Button>
            <Button onClick={nextView} size="lg" className="text-xl px-8 py-6">
              Continue
              <ChevronRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // View 6: Company Registration Announcement
  if (currentView === 6) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="w-full max-w-2xl text-center space-y-8 animate-fade-in">
          <Gift className="w-24 h-24 mx-auto text-primary animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Special Announcement! 🎉
          </h1>
          
          <div className="bg-card p-8 rounded-2xl shadow-xl space-y-6">
            <p className="text-2xl md:text-3xl leading-relaxed">
              On <span className="text-primary font-bold">December 21st, 2025</span>
            </p>
            <p className="text-xl md:text-2xl leading-relaxed">
              We officially registered SANNEX with the
            </p>
            <p className="text-2xl md:text-3xl font-bold text-primary">
              Corporate Affairs Commission (CAC)
            </p>
            <p className="text-xl text-muted-foreground">
              This is a huge milestone for us, and you've been part of this journey!
            </p>

            <div className="pt-6 space-y-4">
              <p className="text-2xl font-semibold">
                To celebrate, mark this date:
              </p>
              <p className="text-4xl md:text-5xl font-bold text-primary">
                {formatDate(clientData.surprise_date)}
              </p>
              <p className="text-xl text-muted-foreground">
                Something special is coming your way!
              </p>
            </div>

            <div className="pt-8">
              <p className="text-xl mb-4 font-semibold">
                Here's your gift code for a special bouquet:
              </p>
              <ScratchCard 
                code={clientData.gift_code} 
                width={300}
                height={150}
                onComplete={() => setScratchRevealed(true)}
              />
              {scratchRevealed && (
                <p className="text-lg text-primary mt-4 animate-fade-in">
                  🎉 Save this code! Use it on the surprise date to claim your gift.
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={prevView} variant="outline" size="lg" className="text-xl px-8 py-6">
              <ChevronLeft className="mr-2" />
              Back
            </Button>
            <Button onClick={nextView} size="lg" className="text-xl px-8 py-6">
              Continue
              <ChevronRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // View 7: Feedback Form
  if (currentView === 7) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="w-full max-w-2xl space-y-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-center leading-tight">
            We Value Your Feedback
          </h1>
          <p className="text-xl md:text-2xl text-center text-muted-foreground">
            Help us serve you better in 2026
          </p>

          <Card className="p-8">
            <form onSubmit={handleSubmitFeedback} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="question1" className="text-xl">
                  1. How satisfied are you with the project delivery?
                </Label>
                <select
                  id="question1"
                  value={feedbackForm.question1}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, question1: e.target.value })}
                  required
                  className="w-full p-4 text-lg border rounded-md bg-background"
                >
                  <option value="">Select...</option>
                  <option value="very-satisfied">Very Satisfied</option>
                  <option value="satisfied">Satisfied</option>
                  <option value="neutral">Neutral</option>
                  <option value="dissatisfied">Dissatisfied</option>
                  <option value="very-dissatisfied">Very Dissatisfied</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question2" className="text-xl">
                  2. How likely are you to recommend SANNEX to others?
                </Label>
                <select
                  id="question2"
                  value={feedbackForm.question2}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, question2: e.target.value })}
                  required
                  className="w-full p-4 text-lg border rounded-md bg-background"
                >
                  <option value="">Select...</option>
                  <option value="very-likely">Very Likely</option>
                  <option value="likely">Likely</option>
                  <option value="neutral">Neutral</option>
                  <option value="unlikely">Unlikely</option>
                  <option value="very-unlikely">Very Unlikely</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="generalFeedback" className="text-xl">
                  3. What feedback do you have for our services in {year}? Any areas for improvement?
                </Label>
                <Textarea
                  id="generalFeedback"
                  value={feedbackForm.generalFeedback}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, generalFeedback: e.target.value })}
                  placeholder="Share your thoughts with us..."
                  required
                  rows={6}
                  className="text-lg p-4"
                />
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <Button type="button" onClick={prevView} variant="outline" size="lg" className="text-xl px-8 py-6">
                  <ChevronLeft className="mr-2" />
                  Back
                </Button>
                <Button type="submit" size="lg" className="text-xl px-8 py-6">
                  Submit Feedback
                  <Send className="ml-2" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default TopClients;
