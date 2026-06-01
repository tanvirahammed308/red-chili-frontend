
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCurrentUser } from "@/redux/features/auth/auth.slice";
import api from "@/lib/axios";

export function useAuthGuard(requireAdmin: boolean = false) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentUser, loading: reduxLoading } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      // First, try to restore session from localStorage
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      
      // If we have token and saved user but no currentUser in Redux
      if (token && savedUser && !currentUser) {
        try {
          // Verify token with backend
          const response = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (response.data.user) {
            // Restore user to Redux
            dispatch(setCurrentUser(response.data.user));
            localStorage.setItem("user", JSON.stringify(response.data.user));
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error("Session restore failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      
      // Check if we have currentUser in Redux
      if (currentUser) {
        // Check admin requirement
        if (requireAdmin && currentUser.role !== "admin") {
          router.push("/");
          setIsLoading(false);
          return;
        }
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }
      
      // No user found, redirect to login
      setIsAuthenticated(false);
      setIsLoading(false);
      router.push("/login");
    };
    
    checkAuth();
  }, [currentUser, dispatch, requireAdmin, router]);

  // Show loading while checking
  if (isLoading || reduxLoading) {
    return { user: null, loading: true };
  }

  // Not authenticated
  if (!isAuthenticated) {
    return { user: null, loading: false };
  }

  // Authenticated
  return { user: currentUser, loading: false };
}