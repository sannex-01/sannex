import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import ScratchCard from '@/components/ScratchCard';
import WordByWord from '@/components/WordByWord';
import { fetchTopClientData, findClientByIdentifier } from '@/utils/topClientData';
import { TopClientData, FeedbackFormData } from '@/types/topClient';
import { ChevronRight, Heart, TrendingUp, Calendar, Gift, Send, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';
import { useCountUp } from '@/hooks/useCountUp';
import { submitFeedback, ensureFeedbackTable } from '@/lib/supabase';

const TopClients = () => {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  
  // Constants
  const SUMMARY_VIEW = 8;
  const MAX_AUTO_ADVANCE_VIEW = 7;
  const AUTO_ADVANCE_DURATION = 15000; // 15 seconds
  const TOTAL_VIEWS = 7; // Total number of views with progress bars (1-7)
  
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
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Counter animations for View 3 - must be at top level
  const animatedAmount = useCountUp({ 
    end: clientData?.total_amount_spent || 0, 
    duration: 2000,
    trigger: currentView === 3 // Only animate when on View 3
  });
  const animatedPercentage = useCountUp({ 
    end: clientData?.percentage_contribution || 0,
    duration: 2000,
    trigger: currentView === 3 // Only animate when on View 3
  });

  useEffect(() => {
    if (year) {
      fetchTopClientData(year).then(setAllClients);
    }
  }, [year]);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('https://cdn.pixabay.com/audio/2025/04/01/audio_02ca8fbc5a.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Auto-advance and progress tracking
  useEffect(() => {
    // Don't auto-advance on View 7 (feedback form) - wait for user submission
    if (currentView > 0 && currentView < MAX_AUTO_ADVANCE_VIEW && !isPaused) {
      // Reset progress
      setProgress(0);
      
      // Start progress animation
      const startTime = Date.now();
      
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / AUTO_ADVANCE_DURATION) * 100, 100);
        setProgress(newProgress);
        
        if (newProgress >= 100) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
        }
      }, 100);

      // Auto-advance after duration (but not on View 7)
      autoAdvanceTimeoutRef.current = setTimeout(() => {
        if (currentView < MAX_AUTO_ADVANCE_VIEW - 1) {
          setCurrentView(currentView + 1);
        }
      }, AUTO_ADVANCE_DURATION);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, [currentView, isPaused]);

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
      
      // Start music when entering slideshow
      if (audioRef.current) {
        audioRef.current.play().catch(err => console.log('Background music autoplay blocked by browser policy:', err));
      }
    } else {
      toast.error('We couldn\'t find your information. Please check and try again.');
    }
    
    setIsLoading(false);
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientData) return;
    
    setIsLoading(true);
    
    try {
      // Ensure table exists (on first try, it will log creation instructions)
      await ensureFeedbackTable();
      
      // Submit feedback to Supabase
      const result = await submitFeedback({
        client_email: clientData.email || identifier.includes('@') ? identifier : undefined,
        client_phone: clientData.phone || !identifier.includes('@') ? identifier : undefined,
        client_name: clientData.client_name,
        year: year || '2025',
        question1: feedbackForm.question1,
        question2: feedbackForm.question2,
        general_feedback: feedbackForm.generalFeedback,
      });
      
      if (result.success) {
        toast.success('Thank you for your feedback! We truly appreciate it.');
        // Move to summary view
        setCurrentView(SUMMARY_VIEW);
      } else {
        toast.error(`Failed to submit feedback: ${result.error}. Please try again.`);
      }
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextView = () => {
    if (currentView < SUMMARY_VIEW) {
      setCurrentView(currentView + 1);
    }
  };

  const prevView = () => {
    if (currentView > 1) {
      setCurrentView(currentView - 1);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    
    // Pause/resume music when pause button is clicked
    if (audioRef.current) {
      if (!isPaused) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log('Audio play error:', err));
      }
    }
  };

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button, input, textarea, select, a, canvas')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    // Left third of screen = previous, right two-thirds = next
    if (clickX < width / 3) {
      prevView();
    } else {
      nextView();
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
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
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
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 font-cursive tracking-cursive">
              {year} Year Wrap
            </h1>
            <p className="text-xl text-muted-foreground">
              Let's celebrate your journey with SANNEX
            </p>
          </div>

          <form onSubmit={handleSubmitIdentifier} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-lg font-handwriting">
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

  // Progress bar component for views 1-7 (WhatsApp-style with multiple bars)
  const ProgressBar = () => {
    if (currentView === 0 || currentView === SUMMARY_VIEW) return null;
    
    const handleBarClick = (viewIndex: number) => {
      setCurrentView(viewIndex);
      setProgress(0);
    };
    
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="flex-1 flex gap-1">
            {Array.from({ length: TOTAL_VIEWS }, (_, i) => {
              const viewIndex = i + 1;
              const isActive = viewIndex === currentView;
              const isCompleted = viewIndex < currentView;
              
              return (
                <button
                  key={viewIndex}
                  onClick={() => handleBarClick(viewIndex)}
                  className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer hover:bg-white/40 transition-colors"
                  aria-label={`Go to view ${viewIndex}`}
                >
                  <div 
                    className={`h-full transition-all duration-100 ${
                      isCompleted ? 'bg-white w-full' : isActive ? 'bg-white' : 'bg-transparent'
                    }`}
                    style={{ 
                      width: isActive ? `${progress}%` : isCompleted ? '100%' : '0%' 
                    }}
                  />
                </button>
              );
            })}
          </div>
          <button
            onClick={togglePause}
            className="text-white hover:text-primary transition-colors"
            aria-label={isPaused ? 'Play' : 'Pause'}
          >
            {isPaused ? (
              <Play className="w-6 h-6" />
            ) : (
              <Pause className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    );
  };

  // View 1: Thank You
  if (currentView === 1) {
    const joinDate = new Date(clientData.join_date);
    const joinYear = isNaN(joinDate.getTime()) ? 0 : joinDate.getFullYear();
    const currentYear = parseInt(year || '2025');
    const actionText = joinYear === currentYear ? 'joining us' : 'continuing with us';
    
    return (
      <>
        <ProgressBar />
        <div 
          className="min-h-screen flex items-center justify-center p-4 pt-24 bg-gradient-to-br from-primary/10 via-background to-primary/5 cursor-pointer"
          onClick={handleScreenClick}
        >
          <div className="w-full max-w-2xl text-center space-y-8 pointer-events-none">
            <Heart className="w-24 h-24 mx-auto text-primary animate-pulse animate-slide-up-1" />
            <h1 className="text-5xl md:text-7xl font-cursive tracking-cursive leading-tight animate-slide-up-2">
              <WordByWord text="Thank You," delay={80} />
              <span className="block text-primary font-handwriting mt-4 animate-slide-up-3">
                <WordByWord text={`${clientData.client_name}!`} delay={80} />
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground leading-relaxed animate-slide-up-4">
              <WordByWord text={`For ${actionText} this year`} delay={60} />
            </p>
          </div>
        </div>
      </>
    );
  }

  // View 2: Join Date
  if (currentView === 2) {
    return (
      <>
        <ProgressBar />
        <div 
          className="min-h-screen flex items-center justify-center p-4 pt-24 bg-gradient-to-br from-primary/10 via-background to-primary/5 cursor-pointer"
          onClick={handleScreenClick}
        >
          <div className="w-full max-w-2xl text-center space-y-8 pointer-events-none">
            <Calendar className="w-24 h-24 mx-auto text-primary animate-slide-up-1" />
            <h1 className="text-4xl md:text-6xl font-cursive tracking-cursive leading-tight animate-slide-up-2">
              <WordByWord text="Your Journey Started" delay={80} />
            </h1>
            <p className="text-5xl md:text-7xl font-bold text-primary font-handwriting animate-slide-up-3">
              <WordByWord text={formatDate(clientData.join_date)} delay={100} />
            </p>
            <p className="text-2xl md:text-3xl text-muted-foreground leading-relaxed animate-slide-up-4">
              <WordByWord text="That's when you put your trust in SANNEX" delay={60} />
            </p>
          </div>
        </div>
      </>
    );
  }

  // View 3: Contribution Stats
  if (currentView === 3) {
    return (
      <>
        <ProgressBar />
        <div 
          className="min-h-screen flex items-center justify-center p-4 pt-24 bg-gradient-to-br from-primary/10 via-background to-primary/5 cursor-pointer"
          onClick={handleScreenClick}
        >
          <div className="w-full max-w-2xl text-center space-y-8 pointer-events-none">
            <TrendingUp className="w-24 h-24 mx-auto text-primary animate-slide-up-1" />
            <h1 className="text-4xl md:text-5xl font-cursive tracking-cursive leading-tight animate-slide-up-2">
              <WordByWord text="Your Impact on SANNEX" delay={80} />
            </h1>
            
            <div className="space-y-6 bg-card p-8 rounded-2xl shadow-xl animate-slide-up-3">
              <div>
                <p className="text-xl text-muted-foreground mb-2">
                  <WordByWord text="Total Investment" delay={80} />
                </p>
                <p className="text-5xl md:text-6xl font-bold text-primary font-handwriting">
                  {formatCurrency(Math.round(animatedAmount))}
                </p>
              </div>
              
              <div className="pt-6">
                <p className="text-xl text-muted-foreground mb-4">
                  <WordByWord text="You contributed" delay={80} />
                </p>
                <div className="space-y-4">
                  <p className="text-6xl md:text-7xl font-bold text-primary font-handwriting">
                    {animatedPercentage.toFixed(1)}%
                  </p>
                  <p className="text-xl text-muted-foreground">
                    <WordByWord text={`to SANNEX's growth in ${year}`} delay={60} />
                  </p>
                  <Progress value={animatedPercentage} className="h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // View 4: Project Showcase
  if (currentView === 4) {
    return (
      <>
        <ProgressBar />
        <div 
          className="min-h-screen flex items-center justify-center p-4 pt-24 bg-gradient-to-br from-primary/10 via-background to-primary/5 cursor-pointer"
          onClick={handleScreenClick}
        >
          <div className="w-full max-w-2xl text-center space-y-8 pointer-events-none">
            <h1 className="text-4xl md:text-5xl font-cursive tracking-cursive leading-tight animate-slide-up-1">
              What We Built Together
            </h1>
            
            <div className="bg-card p-8 rounded-2xl shadow-xl text-left space-y-4 animate-slide-up-2">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-handwriting">
                <WordByWord text={clientData.project_name} delay={80} />
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                <WordByWord text={clientData.project_description} delay={50} />
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
          </div>
        </div>
      </>
    );
  }

  // View 5: Next Steps
  if (currentView === 5) {
    return (
      <>
        <ProgressBar />
        <div 
          className="min-h-screen flex items-center justify-center p-4 pt-24 bg-gradient-to-br from-primary/10 via-background to-primary/5 cursor-pointer"
          onClick={handleScreenClick}
        >
          <div className="w-full max-w-2xl text-center space-y-8 pointer-events-none">
            <h1 className="text-4xl md:text-5xl font-cursive tracking-cursive leading-tight animate-slide-up-1">
              Looking Ahead
            </h1>
            
            {clientData.project_status === 'completed' ? (
              <div className="bg-card p-8 rounded-2xl shadow-xl space-y-6 animate-slide-up-2">
                <p className="text-2xl md:text-3xl leading-relaxed animate-slide-up-3">
                  We'd love to see you <span className="text-primary font-handwriting font-bold">use and grow</span> your project!
                </p>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed animate-slide-up-4">
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
              <div className="bg-card p-8 rounded-2xl shadow-xl space-y-6 animate-slide-up-2">
                <p className="text-2xl md:text-3xl leading-relaxed animate-slide-up-3">
                  We're <span className="text-primary font-handwriting font-bold">excited</span> to continue building with you!
                </p>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed animate-slide-up-4">
                  Let's move to the next phase of your project by
                </p>
                <p className="text-4xl md:text-5xl font-bold text-primary font-handwriting">
                  January 2026
                </p>
                <p className="text-xl text-muted-foreground">
                  Together, we'll make it even better.
                </p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // View 6: Company Registration Announcement
  if (currentView === 6) {
    return (
      <>
        <ProgressBar />
        <div 
          className="min-h-screen flex items-center justify-center p-4 pt-24 bg-gradient-to-br from-primary/10 via-background to-primary/5 cursor-pointer"
          onClick={handleScreenClick}
        >
          <div className="w-full max-w-2xl text-center space-y-8 pointer-events-none">
            <Gift className="w-24 h-24 mx-auto text-primary animate-pulse animate-slide-up-1" />
            <h1 className="text-4xl md:text-6xl font-cursive tracking-cursive leading-tight animate-slide-up-2">
              Special Announcement! 🎉
            </h1>
            
            <div className="bg-card p-8 rounded-2xl shadow-xl space-y-6 animate-slide-up-3">
              <p className="text-2xl md:text-3xl leading-relaxed">
                On <span className="text-primary font-handwriting font-bold">December 21st, 2025</span>
              </p>
              <p className="text-xl md:text-2xl leading-relaxed">
                We officially registered SANNEX with the
              </p>
              <p className="text-2xl md:text-3xl font-bold text-primary font-handwriting">
                Corporate Affairs Commission (CAC)
              </p>
              <p className="text-xl text-muted-foreground">
                This is a huge milestone for us, and you've been part of this journey!
              </p>

              <div className="pt-6 space-y-4">
                <p className="text-2xl font-semibold">
                  To celebrate, mark this date:
                </p>
                <p className="text-4xl md:text-5xl font-bold text-primary font-handwriting">
                  {formatDate(clientData.surprise_date)}
                </p>
                <p className="text-xl text-muted-foreground">
                  Something special is coming your way!
                </p>
              </div>

              <div className="pt-8 pointer-events-auto">
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
          </div>
        </div>
      </>
    );
  }

  // View 7: Feedback Form
  if (currentView === 7) {
    return (
      <>
        <ProgressBar />
        <div 
          className="min-h-screen flex items-center justify-center p-4 pt-24 bg-gradient-to-br from-primary/10 via-background to-primary/5"
        >
          <div className="w-full max-w-2xl space-y-8">
            <h1 className="text-4xl md:text-5xl font-cursive tracking-cursive text-center leading-tight animate-slide-up-1">
              We Value Your Feedback
            </h1>
            <p className="text-xl md:text-2xl text-center text-muted-foreground animate-slide-up-2">
              Help us serve you better in 2026
            </p>

            <Card className="p-8 animate-slide-up-3">
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
                  <Button type="submit" size="lg" className="text-xl px-8 py-6">
                    Submit Feedback
                    <Send className="ml-2" />
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // View 8: Summary Overview (Stagnant - no progress bar)
  if (currentView === 8) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="w-full max-w-4xl space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-cursive tracking-cursive text-center leading-tight text-primary">
            Your 2025 Journey
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Summary Card 1: Client Info */}
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-cursive tracking-cursive text-primary">About You</h2>
              <div className="space-y-2">
                <p className="text-lg"><span className="font-semibold">Name:</span> {clientData.client_name}</p>
                <p className="text-lg"><span className="font-semibold">Joined:</span> {formatDate(clientData.join_date)}</p>
              </div>
            </Card>

            {/* Summary Card 2: Contribution */}
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-cursive tracking-cursive text-primary">Your Contribution</h2>
              <div className="space-y-2">
                <p className="text-lg"><span className="font-semibold">Investment:</span> {formatCurrency(clientData.total_amount_spent)}</p>
                <p className="text-lg"><span className="font-semibold">Impact:</span> <span className="text-primary font-handwriting text-2xl">{clientData.percentage_contribution}%</span> of our growth</p>
              </div>
            </Card>

            {/* Summary Card 3: Project */}
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-cursive tracking-cursive text-primary">Your Project</h2>
              <div className="space-y-2">
                <p className="text-lg font-semibold">{clientData.project_name}</p>
                <p className="text-muted-foreground">{clientData.project_description}</p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  clientData.project_status === 'completed' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-yellow-500 text-white'
                }`}>
                  {clientData.project_status === 'completed' ? '✓ Completed' : '⏳ Ongoing'}
                </span>
              </div>
            </Card>

            {/* Summary Card 4: Special Gift */}
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-cursive tracking-cursive text-primary">Your Gift</h2>
              <div className="space-y-2">
                <p className="text-lg"><span className="font-semibold">Surprise Date:</span> {formatDate(clientData.surprise_date)}</p>
                <p className="text-lg"><span className="font-semibold">Gift Code:</span> <span className="text-primary font-handwriting text-xl">{clientData.gift_code}</span></p>
              </div>
            </Card>
          </div>

          <Card className="p-8 bg-primary/5 border-primary/20">
            <p className="text-2xl md:text-3xl text-center leading-relaxed">
              Thank you for being part of our journey in 2025! 
              <span className="block text-primary font-handwriting text-4xl mt-4">We can't wait to build more with you in 2026! 🚀</span>
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default TopClients;
