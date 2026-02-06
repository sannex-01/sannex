import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { automationSystems } from '@/data/automationSystems';
import { AutomationSystem } from '@/types/automationRewards';
import { 
  retrieveReservationHistory,
  authenticateGiftCode, 
  scanForExistingReservation, 
  finalizeSystemReservation 
} from '@/lib/supabase';
import { Trophy, CheckCircle2, Lock, Sparkles, AlertCircle, Flame, Eye, Clock, Download, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

type RewardsStage = 'board' | 'codeEntry' | 'vault' | 'preview' | 'countdown' | 'ticket';

const RewardsBoard = () => {
  const [stage, setStage] = useState<RewardsStage>('board');
  const [codeInput, setCodeInput] = useState('');
  const [vipIdentity, setVipIdentity] = useState('');
  const [vaultOpen, setVaultOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<AutomationSystem | null>(null);
  const [systemsState, setSystemsState] = useState(automationSystems);
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [countdown, setCountdown] = useState(10);
  const [ticketId, setTicketId] = useState('');
  const [currentViewers] = useState(Math.floor(Math.random() * 5) + 2);
  const [claimedCount, setClaimedCount] = useState(0);
  const [reservedSlot, setReservedSlot] = useState<number | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const reservationRef = useRef<NodeJS.Timeout | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  const totalSystems = 20;
  const slotsRemaining = totalSystems - claimedCount;

  // Load claims and update availability
  useEffect(() => {
    loadBoardData();
    const interval = setInterval(loadBoardData, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadBoardData = async () => {
    const claims = await retrieveReservationHistory();
    setLiveFeed(claims);
    setClaimedCount(claims.length);
    
    const updatedSystems = automationSystems.map(sys => {
      const claimed = claims.find((c: any) => c.system_id === sys.id);
      return claimed 
        ? { 
            ...sys, 
            status: 'claimed' as const, 
            claimedBy: claimed.client_name,
            claimedAt: claimed.claimed_at 
          }
        : sys;
    });
    setSystemsState(updatedSystems);
  };

  const handleCodeSubmission = async () => {
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

    // Validate code
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
    loadBoardData();
  };

  const handleDownloadCertificate = async () => {
    if (!ticketRef.current) return;
    
    try {
      toast.info('Generating certificate...');
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `SANNEX-Certificate-${ticketId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success('Certificate downloaded!');
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Failed to generate certificate');
    }
  };

  const handleWhatsAppKickoff = () => {
    const message = encodeURIComponent(
      `Hello SANNEX Team! 🎉\n\nI've claimed my VIP automation system:\n\nTicket ID: ${ticketId}\nSystem: ${selectedSystem?.title}\nClient: ${vipIdentity}\n\nI'd like to schedule my kickoff call to get started!`
    );
    const whatsappUrl = `https://wa.me/2347048706198?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const progressPercentage = (claimedCount / totalSystems) * 100;

  // Render Board Stage (main landing page)
  const renderBoard = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-yellow-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              2025 Top Clients Rewards Claim
            </h1>
            <Sparkles className="w-12 h-12 text-yellow-400" />
          </div>
          <p className="text-xl text-muted-foreground mb-8">
            VIP Automation Systems
          </p>

          {/* Live stats */}
          <div className="flex justify-center gap-8 mb-8 text-foreground flex-wrap">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <span className="text-lg">Slots left: <span className="font-bold text-yellow-400">{slotsRemaining}/20</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-lg">Rewards are live</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-400" />
              <span className="text-lg">Views: {currentViewers}</span>
            </div>
          </div>

          {/* Progress tracker */}
          <Card className="max-w-2xl mx-auto p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-foreground font-bold">Claim Progress</span>
              <span className="text-yellow-400 font-bold text-lg">
                {claimedCount} / {totalSystems} Claimed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-muted-foreground text-sm mt-2">
              {totalSystems - claimedCount} slots remaining
            </p>
          </Card>
        </div>

        {/* Systems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {systemsState.map((system) => (
            <Card
              key={system.id}
              className={`p-6 transition-all duration-300 ${
                system.status === 'claimed'
                  ? 'border-green-500/30'
                  : 'border-yellow-500/30'
              }`}
            >
              {/* System number badge */}
              <div className="flex justify-between items-start mb-3">
                <Badge 
                  variant="outline" 
                  className="text-xs font-mono"
                >
                  #{system.id.toString().padStart(2, '0')}
                </Badge>
                
                {system.status === 'claimed' ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                      Claimed
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4 text-yellow-400" />
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                      Available
                    </Badge>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                {system.title}
              </h3>

              <p className="text-yellow-400 font-bold text-sm mb-3">
                Worth: {system.worth}
              </p>

              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {system.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {system.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs bg-primary/20 text-primary"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {system.status === 'claimed' && system.claimedBy && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-1">Claimed by</p>
                  <p className="text-sm font-bold text-yellow-400 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    {system.claimedBy}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="inline-block p-8 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-2 border-yellow-500/50">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Have your VIP Code?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Enter your VIP access code and claim your automation system. You have only one shot!
            </p>
            <Button
              onClick={() => setStage('codeEntry')}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold px-8 py-6 text-lg"
            >
              <Lock className="mr-2 w-5 h-5" />
              Enter Access Code
            </Button>
          </Card>
        </div>

        {/* Positioning info */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
              🎯 What Each Top Client Gets
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold">One system</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold">Built in 1–2 weeks</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold">Runs free for 4 weeks</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold">Fully hosted & monitored</p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:col-span-2">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold">
                    Sponsored value: $1,500 – $8,000 equivalent build cost by{' '}
                    <span className="text-yellow-400">SANNEX TECH LTD</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  // Render Code Entry Stage
  const renderCodeEntry = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <Lock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-foreground mb-2">Enter Your Access Code</h2>
          <p className="text-muted-foreground">
            Paste your VIP code to unlock the vault
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="SANNEX2025GIFT##"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmission()}
              className="text-center text-lg font-mono tracking-wider"
            />
          </div>

          <Button
            onClick={handleCodeSubmission}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold py-6 text-lg"
          >
            VALIDATE CODE
          </Button>

          <Button
            onClick={() => setStage('board')}
            variant="outline"
            className="w-full"
          >
            Back to Board
          </Button>
        </div>
      </Card>
    </div>
  );

  // Render Vault Stage (system selection)
  const renderVault = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Welcome, {vipIdentity}
          </h2>
          <p className="text-xl text-yellow-400 mb-4">Pick Your ONE Automation System</p>
          <p className="text-muted-foreground">
            Choose wisely – you can only claim one system.
          </p>
        </div>

        {/* Live claim feed */}
        {liveFeed.length > 0 && (
          <Card className="max-w-md mx-auto p-4 mb-8">
            <h3 className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              Recent Claims
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {liveFeed.slice(-5).reverse().map((claim: any, idx: number) => (
                <div key={idx} className="text-sm text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="font-bold">{claim.client_name}</span>
                  <span className="text-muted-foreground">claimed:</span>
                  <span className="text-yellow-400">{claim.system_title}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Systems grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-1000 ${vaultOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {systemsState.map((system, index) => (
            <Card
              key={system.id}
              className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                system.status === 'claimed'
                  ? 'opacity-50 cursor-not-allowed'
                  : reservedSlot === system.id
                  ? 'border-2 border-green-500 ring-2 ring-green-500/50'
                  : 'border-yellow-500/30 hover:border-yellow-500'
              }`}
              onClick={() => system.status !== 'claimed' && handleSystemSelection(system)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-start mb-3">
                <Badge variant="outline" className="text-xs font-mono">
                  #{system.id.toString().padStart(2, '0')}
                </Badge>
                {system.status === 'claimed' ? (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                    Claimed
                  </Badge>
                ) : reservedSlot === system.id ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                    Reserved
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                    Available
                  </Badge>
                )}
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">
                {system.title}
              </h3>

              <p className="text-yellow-400 font-bold text-sm mb-3">
                Worth: {system.worth}
              </p>

              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {system.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {system.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-primary/20 text-primary"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {system.status === 'claimed' && system.claimedBy && (
                <div className="pt-4 mt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-1">Claimed by</p>
                  <p className="text-sm font-bold text-red-400">
                    {system.claimedBy}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Preview Stage
  const renderPreview = () => {
    if (!selectedSystem) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full p-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
            Lock-In Preview
          </h2>

          <div className="mb-6">
            <p className="text-muted-foreground mb-4 text-center">
              You're about to lock in your ONE pick:
            </p>
            <Card className="p-6 border-yellow-500">
              <h3 className="text-2xl font-bold text-yellow-400 mb-3">
                {selectedSystem.title}
              </h3>
              <p className="text-foreground mb-4">{selectedSystem.description}</p>
              <p className="text-yellow-400 font-bold">Worth: {selectedSystem.worth}</p>

              {/* Pipeline preview */}
              <div className="mt-6 p-4 bg-primary/10 rounded">
                <p className="text-sm font-bold text-foreground mb-2">Pipeline Preview:</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded">Trigger</span>
                  <span>→</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded">Automation</span>
                  <span>→</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded">Outcome</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="bg-red-500/10 border border-red-500/50 rounded p-4 mb-6">
            <p className="text-red-400 text-center">
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
              className="px-8 py-6"
            >
              Back
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  // Render Countdown Stage
  const renderCountdown = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="text-9xl font-bold text-yellow-400 mb-8 animate-pulse">
          {countdown}
        </div>
        <p className="text-3xl text-foreground mb-4">Confirming claim...</p>
        <div className="animate-spin mx-auto w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full" />
      </div>
    </div>
  );

  // Render Ticket Stage
  const renderTicket = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-6 px-3">
      <Card className="max-w-2xl w-full px-5 py-10 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-2 border-yellow-500">
        <div ref={ticketRef}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Your SANNEX Build Ticket</h1>
            <p className="text-yellow-400 text-xl">✅ CLAIMED</p>
          </div>

          <Card className="p-8 px-4 space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-4 text-foreground">
              <div>
                <p className="text-muted-foreground text-sm">Ticket ID</p>
                <p className="font-mono font-bold text-yellow-400">{ticketId}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Client</p>
                <p className="font-bold">{vipIdentity}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-muted-foreground text-sm mb-2">Selected System</p>
              <p className="text-xl font-bold text-yellow-400">{selectedSystem?.title}</p>
              <p className="text-muted-foreground mt-2">{selectedSystem?.description}</p>
            </div>

            <div className="pt-4 border-t space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Build window:</span>
                <span className="text-foreground">1–2 weeks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Free run:</span>
                <span className="text-foreground">4 weeks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sponsored by:</span>
                <span className="text-yellow-400 font-bold">SANNEX TECH LTD</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex align-center gap-4">
          <Button 
            onClick={handleWhatsAppKickoff}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4"
          >
            <MessageCircle className="mr-2 w-5 h-5" />
            Book Kickoff Call
          </Button>
        </div>

        <div className="mt-6 text-center">
          <Button
            onClick={() => setStage('board')}
            variant="link"
            className="text-muted-foreground"
          >
            View Rewards Board
          </Button>
        </div>
      </Card>
    </div>
  );

  // Main render based on stage
  if (stage === 'board') return renderBoard();
  if (stage === 'codeEntry') return renderCodeEntry();
  if (stage === 'vault') return renderVault();
  if (stage === 'preview') return renderPreview();
  if (stage === 'countdown') return renderCountdown();
  if (stage === 'ticket') return renderTicket();

  return null;
};

export default RewardsBoard;
