import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { automationSystems } from '@/data/automationSystems';
import { AutomationSystem } from '@/types/automationRewards';
import { retrieveReservationHistory } from '@/lib/supabase';
import { Trophy, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RewardsBoard = () => {
  const navigate = useNavigate();
  const [systemsState, setSystemsState] = useState(automationSystems);
  const [claimedCount, setClaimedCount] = useState(0);
  const totalSystems = 20;

  useEffect(() => {
    loadBoardData();
    const interval = setInterval(loadBoardData, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadBoardData = async () => {
    const claims = await retrieveReservationHistory();
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

  const progressPercentage = (claimedCount / totalSystems) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-black py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-yellow-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              2025 Top Clients Rewards Board
            </h1>
            <Sparkles className="w-12 h-12 text-yellow-400" />
          </div>
          <p className="text-xl text-gray-300 mb-8">
            VIP Automation Systems - One Pick
          </p>

          {/* Progress tracker */}
          <div className="max-w-2xl mx-auto bg-gray-800/80 backdrop-blur-xl p-6 rounded-lg border border-yellow-500/30">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white font-bold">Draft Progress</span>
              <span className="text-yellow-400 font-bold text-lg">
                {claimedCount} / {totalSystems} Claimed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-gray-700" />
            <p className="text-gray-400 text-sm mt-2">
              {totalSystems - claimedCount} slots remaining
            </p>
          </div>
        </div>

        {/* Systems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {systemsState.map((system) => (
            <Card
              key={system.id}
              className={`p-6 transition-all duration-300 ${
                system.status === 'claimed'
                  ? 'bg-gray-800/70 border-green-500/30'
                  : 'bg-gray-800/90 border-yellow-500/30 shadow-lg shadow-yellow-500/10'
              }`}
            >
              {/* System number badge */}
              <div className="flex justify-between items-start mb-3">
                <Badge 
                  variant="outline" 
                  className="text-xs font-mono bg-gray-900/50"
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

              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                {system.title}
              </h3>

              <p className="text-yellow-400 font-bold text-sm mb-3">
                Worth: {system.worth}
              </p>

              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {system.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {system.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs bg-emerald-500/20 text-emerald-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {system.status === 'claimed' && system.claimedBy && (
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-1">Claimed by</p>
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
          <Card className="inline-block p-8 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 backdrop-blur-xl border-2 border-yellow-500/50">
            <h2 className="text-2xl font-bold text-white mb-4">
              Have a VIP Access Code?
            </h2>
            <p className="text-gray-300 mb-6 max-w-md">
              Enter the draft and claim your automation system. One pick only!
            </p>
            <Button
              onClick={() => navigate('/rewards')}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold px-8 py-6 text-lg"
            >
              <Lock className="mr-2 w-5 h-5" />
              Enter VIP Rewards
            </Button>
          </Card>
        </div>

        {/* Positioning info */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="p-8 bg-gray-800/80 backdrop-blur-xl border border-gray-700">
            <h3 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
              🎯 What Each Top Client Gets
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-white">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold">One system (pick only one)</p>
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
};

export default RewardsBoard;
