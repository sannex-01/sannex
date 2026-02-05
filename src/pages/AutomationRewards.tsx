import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { automationSystems } from '@/data/automationSystems';
import { AutomationSystem } from '@/types/automationRewards';
import { 
  authenticateGiftCode, 
  scanForExistingReservation, 
  retrieveReservationHistory,
  finalizeSystemReservation 
} from '@/lib/supabase';
import { Lock, Sparkles, CheckCircle2, AlertCircle, Flame, Eye, Clock, Trophy } from 'lucide-react';
import { toast } from 'sonner';

type RewardsStage = 'hero' | 'codeEntry' | 'vault' | 'preview' | 'countdown' | 'ticket';

const AutomationRewards2025 = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<RewardsStage>('hero');
  const [codeInput, setKeyInput] = useState('');
  const [vipIdentity, setVipIdentity] = useState('');
  const [vaultOpen, setVaultOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<AutomationSystem | null>(null);
  const [systemsState, setSystemsState] = useState(automationSystems);
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [countdown, setCountdown] = useState(10);
  const [ticketId, setTicketId] = useState('');
  const [currentViewers] = useState(Math.floor(Math.random() * 5) + 2);
  const [slotsRemaining, setSlotsRemaining] = useState(20);
  const [reservedSlot, setReservedSlot] = useState<number | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const reservationRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter animation for hero
  const [heroLine1, setHeroLine1] = useState('');
  const [heroLine2, setHeroLine2] = useState('');
  const [heroLine3, setHeroLine3] = useState('');
  const [heroLine4, setHeroLine4] = useState('');
  const heroLines = [
    '2025 Top Clients Only',
    'One pick each.',
    '20 automation systems. Limited slots.',
    'First come, first claimed.'
  ];

  // Typewriter effect
  useEffect(() => {
    if (stage !== 'hero') return;
    
    const typewriterSequence = async () => {
      await typeText(heroLines[0], setHeroLine1, 50);
      await new Promise(r => setTimeout(r, 300));
      await typeText(heroLines[1], setHeroLine2, 50);
      await new Promise(r => setTimeout(r, 300));
      await typeText(heroLines[2], setHeroLine3, 50);
      await new Promise(r => setTimeout(r, 300));
      await typeText(heroLines[3], setHeroLine4, 50);
    };
    
    typewriterSequence();
  }, [stage]);

  const typeText = async (text: string, setter: (val: string) => void, delay: number) => {
    for (let i = 0; i <= text.length; i++) {
      setter(text.substring(0, i));
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  };

  // Load claims and update availability
  useEffect(() => {
    loadClaimsData();
    const interval = setInterval(loadClaimsData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadClaimsData = async () => {
    const claims = await retrieveReservationHistory();
    setLiveFeed(claims);
    setSlotsRemaining(20 - claims.length);
    
    const updatedSystems = automationSystems.map(sys => {
      const claimed = claims.find((c: any) => c.system_id === sys.id);
      return claimed 
        ? { ...sys, status: 'claimed' as const, claimedBy: claimed.client_name }
        : sys;
    });
    setSystemsState(updatedSystems);
  };

  const handleKeySubmission = async () => {
    if (!codeInput.trim()) {
      toast.error('Please enter your access code');
      return;
    }

    // Check if already claimed
    const existingCheck = await scanForExistingReservation(codeInput);
    if (existingCheck.hasReservation) {
      toast.error('😂 Omo, one pick only. Your slot is locked.');
      setVipIdentity(existingCheck.reservationDetails.client_name);
      setSelectedSystem(systemsState.find(s => s.id === existingCheck.reservationDetails.system_id) || null);
      setTicketId(existingCheck.reservationDetails.ticket_id);
      setStage('ticket');
      return;
    }

    // Validate key
    const authResult = await authenticateGiftCode(codeInput);
    if (!authResult.authenticated) {
      toast.error(authResult.reason || 'Invalid access code');
      return;
    }

    setVipIdentity(authResult.clientIdentity || '');
    toast.success(`ACCESS GRANTED`, {
      description: `Welcome, ${authResult.clientIdentity}`
    });
    
    setTimeout(() => {
      setStage('vault');
      setTimeout(() => setVaultOpen(true), 500);
    }, 1500);
  };

  const handleSystemSelection = (system: AutomationSystem) => {
    if (system.status === 'claimed') {
      toast.error('This system has already been claimed');
      return;
    }
    
    if (reservedSlot && reservedSlot !== system.id) {
      toast.info('You have another system reserved. Switching...');
      clearReservation();
    }
    
    setSelectedSystem(system);
    setReservedSlot(system.id);
    setStage('preview');
    
    // 5-minute reservation
    reservationRef.current = setTimeout(() => {
      toast.warning('Your 5-minute reservation expired');
      clearReservation();
    }, 300000);
  };

  const clearReservation = () => {
    if (reservationRef.current) {
      clearTimeout(reservationRef.current);
      reservationRef.current = null;
    }
    setReservedSlot(null);
  };

  const handleLockIn = () => {
    setStage('countdown');
    setCountdown(10);
    
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          processFinalization();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const processFinalization = async () => {
    if (!selectedSystem) return;
    
    const generatedTicketId = `SANNEX-VIP-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    
    const result = await finalizeSystemReservation({
      clientFullName: vipIdentity,
      giftCode: codeInput,
      automationId: selectedSystem.id,
      automationTitle: selectedSystem.title,
      certificateCode: generatedTicketId,
    });

    if (!result.finalized) {
      toast.error(result.failureReason || 'Failed to lock in your selection');
      setStage('vault');
      return;
    }

    setTicketId(generatedTicketId);
    clearReservation();
    toast.success('🎉 CLAIMED!', {
      description: 'Your automation system is locked in'
    });
    
    setTimeout(() => setStage('ticket'), 1000);
    loadClaimsData();
  };

  const renderHeroStage = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'gridFloat 20s linear infinite'
        }} />
      </div>

      <div className="relative z-10 text-center max-w-3xl">
        {/* Glowing SANNEX emblem */}
        <div className="mb-12 inline-block">
          <div className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent animate-pulse">
            <Sparkles className="inline-block w-16 h-16 text-yellow-400 mr-4" />
            SANNEX
            <Sparkles className="inline-block w-16 h-16 text-yellow-400 ml-4" />
          </div>
          <div className="text-2xl text-yellow-500 mt-2 tracking-widest">VIP DRAFT NIGHT</div>
        </div>

        {/* Typewriter text */}
        <div className="space-y-4 mb-12 text-white">
          <div className="text-3xl font-bold h-12">{heroLine1}</div>
          <div className="text-3xl font-bold h-12">{heroLine2}</div>
          <div className="text-2xl h-10">{heroLine3}</div>
          <div className="text-2xl h-10">{heroLine4}</div>
        </div>

        {/* Live stats */}
        <div className="flex justify-center gap-8 mb-12 text-white">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <span className="text-xl">Slots left: <span className="font-bold text-yellow-400">{slotsRemaining}/20</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xl">Rewards are live</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-blue-400" />
            <span className="text-xl">Viewing: {currentViewers}</span>
          </div>
        </div>

        <Button 
          onClick={() => setStage('codeEntry')} 
          size="lg"
          className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold text-xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all"
        >
          Enter Rewards <Lock className="ml-2 w-6 h-6" />
        </Button>

        <div className="mt-8">
          <Button
            onClick={() => navigate('/rewards/board')}
            variant="ghost"
            className="text-yellow-400 hover:text-yellow-300"
          >
            <Trophy className="mr-2 w-5 h-5" />
            View Rewards Board
          </Button>
        </div>
      </div>
    </div>
  );

  const renderKeyEntry = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 bg-gray-800/80 backdrop-blur-xl border-yellow-500/30">
        <div className="text-center mb-8">
          <Lock className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Access Key Required</h2>
          <p className="text-gray-400">Enter your VIP code to unlock the vault</p>
        </div>

        <div className="space-y-4">
          <Input
            value={codeInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="ENTER-YOUR-CODE"
            className="text-center text-xl tracking-widest font-mono bg-gray-900 border-yellow-500/50 text-white uppercase"
            onKeyPress={(e) => e.key === 'Enter' && handleKeySubmission()}
          />

          <Button
            onClick={handleKeySubmission}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-6 text-lg"
          >
            Scan Access Key
          </Button>

          <Button
            onClick={() => setStage('hero')}
            variant="ghost"
            className="w-full text-gray-400"
          >
            Back
          </Button>
        </div>
      </Card>
    </div>
  );

  // More stages to be rendered...
  const renderVault = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome, {vipIdentity}
          </h1>
          <p className="text-yellow-400 text-xl">Select Your One System</p>
          <div className="mt-4 flex justify-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span>{slotsRemaining} Available</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>{20 - slotsRemaining} Claimed</span>
            </div>
          </div>
        </div>

        {/* Grid of systems */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 ${vaultOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {systemsState.map((system, idx) => (
            <Card
              key={system.id}
              onClick={() => handleSystemSelection(system)}
              className={`p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                system.status === 'claimed' 
                  ? 'bg-gray-800/50 opacity-50 cursor-not-allowed' 
                  : reservedSlot === system.id
                  ? 'bg-yellow-500/20 border-yellow-500 border-2'
                  : 'bg-gray-800/80 border-gray-700 hover:border-yellow-500'
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-white">{system.title}</h3>
                {system.status === 'claimed' ? (
                  <Badge variant="secondary" className="bg-red-500/20 text-red-400">Claimed</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">Available</Badge>
                )}
              </div>

              <p className="text-yellow-400 font-bold mb-3">{system.worth}</p>
              
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{system.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {system.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>

              {system.status === 'claimed' && system.claimedBy && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-500">Claimed by: <span className="text-yellow-500">{system.claimedBy}</span></p>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Live Feed Sidebar */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-4">📢 Live Claim Feed</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {liveFeed.slice(0, 10).map((claim, idx) => (
              <div key={idx} className="bg-gray-800/60 p-3 rounded flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-white">{claim.client_name} claimed: <span className="text-yellow-400">{claim.system_title}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => {
    if (!selectedSystem) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full p-8 bg-gray-800/90 backdrop-blur-xl border-yellow-500">
          <div className="text-center mb-8">
            <AlertCircle className="w-16 h-16 mx-auto text-yellow-400 mb-4 animate-pulse" />
            <h2 className="text-3xl font-bold text-white mb-4">Lock-In Preview</h2>
            <p className="text-xl text-gray-300">You're about to lock in your ONE pick:</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg mb-6 border-2 border-yellow-500">
            <h3 className="text-2xl font-bold text-yellow-400 mb-3">{selectedSystem.title}</h3>
            <p className="text-lg text-white mb-3">{selectedSystem.worth}</p>
            <p className="text-gray-400 mb-4">{selectedSystem.description}</p>
            
            {/* Mini pipeline preview */}
            <div className="bg-gray-800 p-4 rounded">
              <div className="flex items-center justify-between text-sm">
                <div className="text-center flex-1">
                  <div className="font-bold text-green-400">Trigger</div>
                  <div className="text-gray-400 mt-1">Input Event</div>
                </div>
                <div className="text-yellow-400 text-2xl">→</div>
                <div className="text-center flex-1">
                  <div className="font-bold text-blue-400">Automation</div>
                  <div className="text-gray-400 mt-1">Process</div>
                </div>
                <div className="text-yellow-400 text-2xl">→</div>
                <div className="text-center flex-1">
                  <div className="font-bold text-purple-400">Outcome</div>
                  <div className="text-gray-400 mt-1">Result</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/50 rounded p-4 mb-6">
            <p className="text-red-400 text-center font-bold">
              ⚠️ Once you lock this in, you can't pick another.
            </p>
          </div>

          {reservedSlot === selectedSystem.id && (
            <div className="bg-green-500/10 border border-green-500/50 rounded p-3 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm">Reserved for 5 minutes</span>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={handleLockIn}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-6 text-lg"
            >
              LOCK IN MY PICK
            </Button>
            <Button
              onClick={() => {
                clearReservation();
                setStage('vault');
                setSelectedSystem(null);
              }}
              variant="outline"
              className="px-8"
            >
              Back
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  const renderCountdown = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
      <div className="text-center">
        <div className="text-9xl font-bold text-yellow-400 mb-8 animate-pulse">
          {countdown}
        </div>
        <p className="text-3xl text-white mb-4">Confirming claim...</p>
        <div className="animate-spin mx-auto w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full" />
      </div>
    </div>
  );

  const renderTicket = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-10 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 backdrop-blur-xl border-2 border-yellow-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Your SANNEX Build Ticket</h1>
          <p className="text-yellow-400 text-xl">✅ CLAIMED</p>
        </div>

        <div className="bg-gray-900/80 p-8 rounded-lg space-y-4 mb-8">
          <div className="grid grid-cols-2 gap-4 text-white">
            <div>
              <p className="text-gray-400 text-sm">Ticket ID</p>
              <p className="font-mono font-bold text-yellow-400">{ticketId}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Client Name</p>
              <p className="font-bold">{vipIdentity}</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Selected System</p>
            <p className="text-xl font-bold text-yellow-400">{selectedSystem?.title}</p>
            <p className="text-gray-400 mt-2">{selectedSystem?.description}</p>
          </div>

          <div className="pt-4 border-t border-gray-700 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Build window:</span>
              <span className="text-white">1–2 weeks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Free run:</span>
              <span className="text-white">4 weeks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Ops sponsored by:</span>
              <span className="text-yellow-400 font-bold">SANNEX TECH LTD ✅</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4">
            Book Kickoff Call
          </Button>
          <Button variant="outline" className="flex-1 border-yellow-500 text-yellow-400 py-4">
            Download Certificate
          </Button>
        </div>

        <p className="text-center text-gray-400 mt-6 text-sm italic">
          🔒 Your account is now locked. You already claimed your one pick.
        </p>
      </Card>
    </div>
  );

  // Main render
  return (
    <div>
      <style>{`
        @keyframes gridFloat {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
      `}</style>
      
      {stage === 'hero' && renderHeroStage()}
      {stage === 'codeEntry' && renderKeyEntry()}
      {stage === 'vault' && renderVault()}
      {stage === 'preview' && renderPreview()}
      {stage === 'countdown' && renderCountdown()}
      {stage === 'ticket' && renderTicket()}
    </div>
  );
};

export default AutomationRewards2025;
