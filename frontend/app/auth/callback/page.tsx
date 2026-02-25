"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { getProfile, isProfileComplete } from "@/lib/profileService";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const setHasProfile = useAuthStore((state) => state.setHasProfile);

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    const email = searchParams.get("email") || "";
    const role = searchParams.get("role"); // only present for existing users

    if (!token || !userId) {
      router.push("/login");
      return;
    }

    if (role) {
      // Existing user — link detected by backend, log in with real credentials
      login({ id: userId, email, role }, token);

      // Mirror the same profile check as the regular login page
      getProfile()
        .then((profile) => {
          const profileComplete = isProfileComplete(profile);
          setHasProfile(profileComplete);
          router.push(profileComplete ? "/dashboard" : "/profile");
        })
        .catch(() => {
          // Can't determine — send to profile page to be safe
          setHasProfile(false);
          router.push("/profile");
        });
    } else {
      // Brand-new Google user — needs to pick STUDENT / ALUMNI
      login({ id: userId, email, role: "STUDENT" }, token);
      router.push(`/select-role?token=${token}&userId=${userId}`);
    }
  }, [searchParams, login, setHasProfile, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-muted-foreground font-mono">&gt; authenticating...</div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-muted-foreground font-mono">&gt; loading...</div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
