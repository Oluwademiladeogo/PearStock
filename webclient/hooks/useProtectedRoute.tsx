import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export const useProtectedRoute = () => {
  const [hydrated, setHydrated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Ensure the component is mounted before accessing cookies
    setHydrated(true);

    const token = Cookies.get("token");
    setIsAuthenticated(!!token); // Check if token exists

    if (!token && (router.pathname === "/dashboard" || router.pathname === "/products")) {
      router.push("/login");
    }
  }, [router.pathname]);

  return { hydrated, isAuthenticated };
};