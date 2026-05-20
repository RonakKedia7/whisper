import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/expo";
import { useAuthCallback } from "@/hooks/useAuth";

export const AuthSync = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { mutate: syncUser } = useAuthCallback();

  const hasSynced = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user && !hasSynced.current) {
      hasSynced.current = true;
      syncUser();
    }

    if (!isSignedIn) {
      hasSynced.current = false;
    }
  }, [isLoaded, isSignedIn, user?.id, syncUser]);

  return null;
};
