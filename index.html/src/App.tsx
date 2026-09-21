import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType, ExplorationData } from './types';
import { getExplorations, getMembershipStatus, syncMembershipStatus, MembershipData } from './utils/storage';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { HomeHeroDashboard } from './components/HomeHeroDashboard';
import { SoulAgenda } from './components/SoulAgenda';
import { DailyCheckIn } from './components/DailyCheckIn';
import { WeeklyReleases } from './components/WeeklyReleases';
import { DailyOracleCard } from './components/DailyOracleCard';
import { MoreHub } from './components/MoreHub';
import { DailyAnchors } from './components/DailyAnchors';
import { CortisolCalm } from './components/CortisolCalm';
import { GuiltReframing } from './components/GuiltReframing';
import { BelongingPath } from './components/BelongingPath';
import { LifeSituations } from './components/LifeSituations';
import { MediaLibrary } from './components/MediaLibrary';
import { PracticesModal } from './components/PracticesModal';
import { MirrorDashboard } from './components/MirrorDashboard';
import { ExplorationFlow } from './components/ExplorationFlow';
import { AiCompanion } from './components/AiCompanion';
import { JourneyHistory } from './components/JourneyHistory';
import { PremiumModal } from './components/PremiumModal';
import { PatternIndex } from './components/PatternIndex';
import { FireRitual } from './components/FireRitual';
import { ExpiredNoticeScreen } from './components/ExpiredNoticeScreen';
import { InstallGuideModal } from './components/InstallGuideModal';
import { InsightsView } from './components/InsightsView';
import { RelaxingSoundsView } from './components/RelaxingSoundsView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [explorations, setExplorations] = useState<ExplorationData[]>([]);
  const [focusPatternId, setFocusPatternId] = useState<string | undefined>(undefined);
  const [activeExpForAi, setActiveExpForAi] = useState<ExplorationData | null>(null);
  const [targetCaseId, setTargetCaseId] = useState<string | null>(null);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');
  const [initialBurdenForFire, setInitialBurdenForFire] = useState<string>('');

  // Membership status and automated expiration validation
  const [membership, setMembership] = useState<MembershipData>(() => getMembershipStatus());
  const [showExpiredScreen, setShowExpiredScreen] = useState<boolean>(false);

  // Automated expiration validation on load and when membership updates
  useEffect(() => {
    const validateExpiration = (status: MembershipData) => {
      setMembership(status);
      // If membership exists but has expired, redirect user to the renewal screen
      if (status.isExpired) {
        setShowExpiredScreen(true);
      } else {
        setShowExpiredScreen(false);
      }
    };

    // 1. Initial local validation
    const initialStatus = getMembershipStatus();
    validateExpiration(initialStatus);

    // 2. Automated server-synchronized verification against current server time
    syncMembershipStatus().then((synced) => {
      validateExpiration(synced);
    });

    // 3. Listen to any code activation or membership change events in the session
    const handleMembershipChange = () => {
      const updated = getMembershipStatus();
      validateExpiration(updated);
    };

    window.addEventListener('vishuda_membership_updated', handleMembershipChange);
    return () => {
      window.removeEventListener('vishuda_membership_updated', handleMembershipChange);
    };
  }, []);

  // Load explorations
  const refreshExplorations = () => {
    setExplorations(getExplorations());
  };

  useEffect(() => {
    refreshExplorations();
  }, []);

  const handleStartExplorationWithPattern = (patternId?: string) => {
    setFocusPatternId(patternId);
    setCurrentView('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAiWithContext = (exp: ExplorationData) => {
    setActiveExpForAi(exp);
    setAiInitialPrompt('');
    setCurrentView('ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAiWithCase = (c: any) => {
    if (c && c.title) {
      setAiInitialPrompt(
        `Situación cotidiana con la que me identifico: "${c.title}" (${c.category || 'cotidiana'}). Síntoma frecuente: "${c.sintoma || ''}". Mecanismo defensivo: "${c.mecanismo || ''}". Quisiera autoindagar cómo se está detonando este patrón en lo que viví hoy:`
      );
    }
    setActiveExpForAi(null);
    setCurrentView('ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAiWithPrompt = (prompt: string) => {
    setAiInitialPrompt(prompt);
    setActiveExpForAi(null);
    setCurrentView('ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCaseById = (caseId: string) => {
    setTargetCaseId(caseId);
    setCurrentView('cases');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoFireWithBurden = (burden: string) => {
    setInitialBurdenForFire(burden);
    setCurrentView('fire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: ViewType) => {
    if (view === 'calm') {
      setCurrentView('home');
      return;
    }
    if (view !== 'cases') {
      setTargetCaseId(null);
    }
    if (view !== 'ai') {
      setAiInitialPrompt('');
    }
    if (view !== 'fire') {
      setInitialBurdenForFire('');
    }
    setShowExpiredScreen(false);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f6f0] text-[#1f2b33] flex flex-col items-center selection:bg-[#c5a059] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Maximum Mobile-First Width Container */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#faf8f3] shadow-2xl relative border-x border-[#e8dfd2] overflow-x-hidden">
        {/* Sticky Global App Header */}
        <Header
          currentView={currentView}
          onNavigate={handleNavigate}
          onGoHome={() => handleNavigate('home')}
          onOpenPremium={() => handleNavigate('premium')}
          onOpenWeekly={() => handleNavigate('weekly')}
          onOpenAi={() => handleNavigate('ai')}
          onOpenMedia={() => handleNavigate('media')}
        />

        {/* Main Content View Container */}
        <main className="flex-1 px-3.5 sm:px-4 pt-3.5 sm:pt-4 overflow-y-auto overflow-x-hidden pb-24">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={showExpiredScreen ? 'expired' : currentView}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="w-full"
            >
              {/* EXPIRED MEMBERSHIP AUTOMATED REDIRECTION SCREEN */}
              {showExpiredScreen ? (
                <ExpiredNoticeScreen
                  membership={membership}
                  onGoToActivation={() => {
                    setShowExpiredScreen(false);
                    handleNavigate('premium');
                  }}
                  onDismissToExploreFree={() => setShowExpiredScreen(false)}
                />
              ) : (
                <>
                  {/* 1. HOME HERO DASHBOARD (Exact layout from preview.webp) */}
                  {currentView === 'home' && (
                    <HomeHeroDashboard
                      onNavigate={handleNavigate}
                      onStartExploration={handleStartExplorationWithPattern}
                      explorations={explorations}
                      onOpenAi={() => handleNavigate('ai')}
                    />
                  )}

          {/* 2. AGENDA PARA EL ALMA (The entire 79-page book digitalized) */}
          {currentView === 'agenda' && (
            <SoulAgenda
              onBack={() => handleNavigate('home')}
              onOpenPremium={() => handleNavigate('premium')}
              onStartExploration={handleStartExplorationWithPattern}
            />
          )}

          {/* 3. WEEKLY RELEASES VIEW ("LUNES DE ALMA") */}
          {currentView === 'weekly' && (
            <WeeklyReleases
              onBack={() => handleNavigate('home')}
              onOpenPremium={() => handleNavigate('premium')}
              onExplorePattern={(patternId) => handleStartExplorationWithPattern(patternId)}
            />
          )}

          {/* 4. ORACLE VIEW ("ORÁCULO DE INTENCIÓN / RONDA DEL DÍA") */}
          {(currentView === 'oracle' || currentView === 'oraculo') && (
            <DailyOracleCard onGoHome={() => handleNavigate('home')} />
          )}

          {/* 5. CHECK-IN DEDICATED VIEW */}
          {currentView === 'checkin' && (
            <div className="space-y-4">
              <button
                onClick={() => handleNavigate('home')}
                className="text-xs font-bold text-[#1e5f6e] hover:underline flex items-center gap-1"
              >
                ← Volver al inicio
              </button>
              <DailyCheckIn
                onProceedToExplore={() => handleNavigate('explore')}
                onGoInsights={() => handleNavigate('insights')}
                onClose={() => handleNavigate('home')}
                isInitialScreen={true}
              />
            </div>
          )}

          {/* 6. EXPLORE FLOW */}
          {currentView === 'explore' && (
            <ExplorationFlow
              onFinish={() => {
                refreshExplorations();
                handleNavigate('history');
              }}
              onCancel={() => handleNavigate('home')}
              onGoAiWithContext={handleOpenAiWithContext}
              onGoPractice={() => handleNavigate('practice')}
              onNavigate={handleNavigate}
              initialPatternFocus={focusPatternId}
              onGoFireWithBurden={handleGoFireWithBurden}
            />
          )}

          {/* 7. MIRROR DASHBOARD */}
          {currentView === 'mirror' && (
            <MirrorDashboard
              explorations={explorations}
              onBack={() => handleNavigate('home')}
              onStartExploration={() => handleStartExplorationWithPattern()}
              onGoAi={() => handleNavigate('ai')}
              onExplorePattern={(patternId) => handleStartExplorationWithPattern(patternId)}
            />
          )}

          {/* 8. PRACTICES MODAL / SOMATIC LAB */}
          {(currentView === 'practice' || currentView === 'practices') && (
            <PracticesModal
              onBack={() => handleNavigate('home')}
              onOpenCortisol={() => handleNavigate('cortisol')}
            />
          )}

          {/* 9. MORE / MI ESPACIO HUB */}
          {currentView === 'more' && (
            <MoreHub onNavigate={handleNavigate} />
          )}

          {/* 10. HISTORY VIEW */}
          {currentView === 'history' && (
            <JourneyHistory
              onBack={() => handleNavigate('home')}
              onStartExploration={() => handleStartExplorationWithPattern()}
              explorations={explorations}
              onRefresh={refreshExplorations}
            />
          )}

          {/* 11. ANCHORS VIEW */}
          {currentView === 'anchors' && (
            <div className="space-y-4">
              <button
                onClick={() => handleNavigate('home')}
                className="text-xs font-bold text-[#1e5f6e] hover:underline flex items-center gap-1"
              >
                ← Volver al inicio
              </button>
              <DailyAnchors />
            </div>
          )}

          {/* SUB-VIEWS */}
          {currentView === 'cases' && (
            <LifeSituations
              onBack={() => handleNavigate('home')}
              onNavigate={handleNavigate}
              onExplorePattern={(patternId) => handleStartExplorationWithPattern(patternId)}
              onGoAiWithCase={handleOpenAiWithCase}
              initialCaseId={targetCaseId}
            />
          )}

          {currentView === 'cortisol' && (
            <CortisolCalm
              onBack={() => handleNavigate('home')}
              onNavigate={handleNavigate}
              onOpenAi={handleOpenAiWithPrompt}
            />
          )}

          {currentView === 'guilt' && (
            <GuiltReframing onBack={() => handleNavigate('home')} />
          )}

          {currentView === 'belonging' && (
            <BelongingPath onBack={() => handleNavigate('home')} />
          )}

          {currentView === 'media' && (
            <MediaLibrary
              onBack={() => handleNavigate('home')}
              onGoAi={() => handleNavigate('ai')}
            />
          )}

          {currentView === 'patterns' && (
            <PatternIndex
              onBack={() => handleNavigate('home')}
              onNavigate={handleNavigate}
              onExplorePattern={(patternId) => handleStartExplorationWithPattern(patternId)}
            />
          )}

          {currentView === 'ai' && (
            <AiCompanion
              onBack={() => handleNavigate('home')}
              onGoPractice={() => handleNavigate('practice')}
              contextExploration={activeExpForAi}
              initialPrompt={aiInitialPrompt}
              onGoCase={handleOpenCaseById}
              onOpenPremium={() => handleNavigate('premium')}
            />
          )}

          {currentView === 'fire' && (
            <FireRitual
              onBack={() => handleNavigate('home')}
              onGoHome={() => handleNavigate('home')}
              initialBurden={initialBurdenForFire}
              onOpenPremium={() => handleNavigate('premium')}
            />
          )}

          {currentView === 'premium' && (
            <PremiumModal onBack={() => handleNavigate('home')} />
          )}

          {currentView === 'install' && (
            <InstallGuideModal onBack={() => handleNavigate('more')} />
          )}

          {currentView === 'insights' && (
            <InsightsView
              onBack={() => handleNavigate('home')}
              onNavigate={handleNavigate}
              onGoCheckIn={() => handleNavigate('checkin')}
            />
          )}

          {currentView === 'sounds' && (
            <RelaxingSoundsView onBack={() => handleNavigate('home')} />
          )}
                </>
              )}
        </motion.div>
      </AnimatePresence>
    </main>

        {/* Persistent Bottom Mobile Navigation Bar */}
        <Navbar currentView={currentView} onNavigate={handleNavigate} />
      </div>
    </div>
  );
}
