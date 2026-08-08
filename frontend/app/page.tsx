"use client";

import React, { useState, useEffect } from "react";
import { ScreenId, BottomNav } from "@/components/BottomNav";
import { SplashScreen } from "@/components/screens/SplashScreen";
import {
  Onboard1Screen,
  Onboard2Screen,
  Onboard3Screen,
} from "@/components/screens/OnboardingScreens";
import { PermissionsScreen, LoginScreen } from "@/components/screens/AuthScreens";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { ScannerScreen } from "@/components/screens/ScannerScreen";
import { ProcessingScreen } from "@/components/screens/ProcessingScreen";
import { RiskResultScreen } from "@/components/screens/RiskResultScreen";
import {
  MerchantScreen,
  ReportFraudScreen,
} from "@/components/screens/MerchantAndReportScreens";
import {
  HistoryScreen,
  AlertsScreen,
} from "@/components/screens/HistoryAndCommunityScreens";
import { ProfileScreen } from "@/components/screens/ProfileScreen";
import {
  PaymentReviewScreen,
  PaymentSimulationScreen,
  PaymentSuccessScreen,
} from "@/components/screens/PaymentSimulationScreens";
import { ApiExplorerScreen } from "@/components/screens/ApiExplorerScreen";
import { ScanResult } from "@/lib/api";
import { auth, onAuthStateChanged, User } from "@/lib/firebase";

export default function SentinelApp() {
  const [screen, setScreen] = useState<ScreenId>("splash");
  const [scannedPayload, setScannedPayload] = useState<string>("");
  const [lastScanResult, setLastScanResult] = useState<ScanResult | null>(null);
  const [latencyMs, setLatencyMs] = useState<number>(12);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [simAmount, setSimAmount] = useState<number>(100);

  useEffect(() => {
    const savedTheme = localStorage.getItem("sqr_theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleNavigate = (target: ScreenId) => {
    setScreen(target);
  };

  const handleScanComplete = (payload: string) => {
    setScannedPayload(payload);
  };

  const handleAnalysisDone = (result: ScanResult, latency: number) => {
    setLastScanResult(result);
    setLatencyMs(latency);
    if (result.signals?.payment_intent?.amount_value) {
      setSimAmount(result.signals.payment_intent.amount_value);
    } else {
      setSimAmount(100);
    }
  };

  const handleSelectTheme = (mode: "dark" | "light") => {
    setTheme(mode);
    localStorage.setItem("sqr_theme", mode);
    document.documentElement.setAttribute("data-theme", mode);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    handleSelectTheme(nextTheme);
  };

  const noNavScreens: ScreenId[] = [
    "splash",
    "onboard1",
    "onboard2",
    "onboard3",
    "permissions",
    "login",
    "scanner",
    "processing",
    "result",
    "merchant",
    "report",
    "payment_review",
    "payment_sim",
    "payment_success",
  ];

  const hideNav = noNavScreens.includes(screen);

  return (
    <main className="app-wrapper">
      <div className={`screen-container ${hideNav ? "no-nav" : ""}`}>
        {screen === "splash" && <SplashScreen onNext={handleNavigate} />}
        {screen === "onboard1" && <Onboard1Screen onNavigate={handleNavigate} />}
        {screen === "onboard2" && <Onboard2Screen onNavigate={handleNavigate} />}
        {screen === "onboard3" && (
          <Onboard3Screen
            onNavigate={handleNavigate}
            theme={theme}
            onSelectTheme={handleSelectTheme}
          />
        )}
        {screen === "permissions" && <PermissionsScreen onNavigate={handleNavigate} />}
        {screen === "login" && (
          <LoginScreen
            onNavigate={handleNavigate}
            onUserLogin={(user) => setCurrentUser(user)}
          />
        )}
        {screen === "home" && <HomeScreen onNavigate={handleNavigate} />}
        {screen === "scanner" && (
          <ScannerScreen
            onNavigate={handleNavigate}
            onScanComplete={handleScanComplete}
          />
        )}
        {screen === "processing" && (
          <ProcessingScreen
            payload={scannedPayload || "upi://pay?pa=ramesh.chai@upi&pn=Ramesh%20Chai%20Corner&am=50"}
            onNavigate={handleNavigate}
            onAnalysisDone={handleAnalysisDone}
          />
        )}
        {screen === "result" && (
          <RiskResultScreen
            result={lastScanResult}
            onNavigate={handleNavigate}
          />
        )}
        {screen === "merchant" && <MerchantScreen onNavigate={handleNavigate} />}
        {screen === "report" && (
          <ReportFraudScreen
            onNavigate={handleNavigate}
            scannedPayload={scannedPayload}
          />
        )}
        {screen === "history" && <HistoryScreen onNavigate={handleNavigate} />}
        {screen === "alerts" && <AlertsScreen onNavigate={handleNavigate} />}
        {screen === "profile" && (
          <ProfileScreen
            onNavigate={handleNavigate}
            ttsEnabled={ttsEnabled}
            onToggleTts={() => setTtsEnabled(!ttsEnabled)}
            theme={theme}
            onToggleTheme={toggleTheme}
            currentUser={currentUser}
          />
        )}
        {screen === "payment_review" && (
          <PaymentReviewScreen
            result={lastScanResult}
            onNavigate={handleNavigate}
            simAmount={simAmount}
            setSimAmount={setSimAmount}
          />
        )}
        {screen === "payment_sim" && (
          <PaymentSimulationScreen
            result={lastScanResult}
            onNavigate={handleNavigate}
            simAmount={simAmount}
            setSimAmount={setSimAmount}
          />
        )}
        {screen === "payment_success" && (
          <PaymentSuccessScreen
            result={lastScanResult}
            onNavigate={handleNavigate}
            simAmount={simAmount}
            setSimAmount={setSimAmount}
          />
        )}
        {screen === "api_explorer" && (
          <ApiExplorerScreen onNavigate={handleNavigate} />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentScreen={screen} onNavigate={handleNavigate} />
    </main>
  );
}
