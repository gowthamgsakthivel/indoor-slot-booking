"use client";

import { useSyncExternalStore } from "react";
import SplashIntro from "@/components/SplashIntro";
import HomeDashboard from "@/components/HomeDashboard";

export default function Home() {
  const viewState = useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") {
        return () => {};
      }
      const handler = () => callback();
      window.addEventListener("introchange", handler);
      window.addEventListener("storage", handler);
      return () => {
        window.removeEventListener("introchange", handler);
        window.removeEventListener("storage", handler);
      };
    },
    () => {
      if (typeof window === "undefined") {
        return "loading";
      }
      return sessionStorage.getItem("hasSeenIntro") ? "home" : "splash";
    },
    () => "loading"
  );

  const handleSplashComplete = () => {
    sessionStorage.setItem("hasSeenIntro", "true");
    window.dispatchEvent(new Event("introchange"));
  };

  if (viewState === "loading") {
    return <div className="min-h-screen bg-(--background)" />;
  }

  if (viewState === "splash") {
    return <SplashIntro onComplete={handleSplashComplete} />;
  }

  return <HomeDashboard />;
}
