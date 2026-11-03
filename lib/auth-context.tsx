"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { AuthUser } from "@/lib/types";

export const DEMO_USER: AuthUser = {
  id: "usr_israel_demo",
  email: "contact@afrikinnovations.ci",
  fullName: "Israel G.",
  companyName: "Afrik Innovations SARL",
  role: "Directeur Général",
  createdAt: "2024-10-01",
};

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    fullName: string,
    companyName: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginDemo: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        // 1. Check local storage first for instant restore
        const stored = typeof window !== "undefined" ? localStorage.getItem("izi_auth_user") : null;
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (isMounted && parsed?.id) {
              setUser(parsed);
              setIsLoading(false);
              return;
            }
          } catch {
            localStorage.removeItem("izi_auth_user");
          }
        }

        // 2. Check Supabase Auth session
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          const su = data.session.user;
          const mapped: AuthUser = {
            id: su.id,
            email: su.email || "",
            fullName: su.user_metadata?.full_name || su.email?.split("@")[0] || "Utilisateur",
            companyName: su.user_metadata?.company_name || "Afrik Innovations SARL",
            role: "Administrateur",
            createdAt: su.created_at,
          };
          if (isMounted) {
            setUser(mapped);
            localStorage.setItem("izi_auth_user", JSON.stringify(mapped));
          }
        }
      } catch (err) {
        console.warn("Auth initialization notice:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    if (!cleanEmail || !cleanPass) {
      setIsLoading(false);
      return { success: false, error: "Veuillez saisir votre adresse e-mail et votre mot de passe." };
    }

    try {
      // 1. Check default demo user
      if (
        (cleanEmail === DEMO_USER.email.toLowerCase() && cleanPass === "demo1234") ||
        (cleanEmail === "demo@izifacture.com" && cleanPass === "demo1234")
      ) {
        setUser(DEMO_USER);
        localStorage.setItem("izi_auth_user", JSON.stringify(DEMO_USER));
        setIsLoading(false);
        return { success: true };
      }

      // 2. Check in Supabase `public.app_users` table
      const { data: dbUser, error: dbError } = await supabase
        .from("app_users")
        .select("*")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (dbUser) {
        if (dbUser.password_hash === cleanPass) {
          const mapped: AuthUser = {
            id: dbUser.id,
            email: dbUser.email,
            fullName: dbUser.full_name,
            companyName: dbUser.company_name,
            role: dbUser.role || "Administrateur",
            createdAt: dbUser.created_at,
          };
          setUser(mapped);
          localStorage.setItem("izi_auth_user", JSON.stringify(mapped));
          setIsLoading(false);
          return { success: true };
        } else {
          setIsLoading(false);
          return {
            success: false,
            error: "Mot de passe incorrect pour le compte " + cleanEmail + ". Veuillez vérifier votre saisie.",
          };
        }
      }

      // 3. Fallback: Check Supabase Auth
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass,
        });

        if (!authError && authData?.user) {
          const su = authData.user;
          const mapped: AuthUser = {
            id: su.id,
            email: su.email || cleanEmail,
            fullName: su.user_metadata?.full_name || cleanEmail.split("@")[0],
            companyName: su.user_metadata?.company_name || "Mon Entreprise",
            role: "Administrateur",
            createdAt: su.created_at,
          };
          setUser(mapped);
          localStorage.setItem("izi_auth_user", JSON.stringify(mapped));
          setIsLoading(false);
          return { success: true };
        }
      } catch {
        // Continue to not found message
      }

      setIsLoading(false);
      return {
        success: false,
        error: `Aucun compte trouvé pour l'e-mail "${cleanEmail}". Cliquez sur l'onglet "Créer un compte" ci-dessus pour vous inscrire en 10 secondes, ou utilisez "Accès Démo Immédiat".`,
      };
    } catch (err: any) {
      setIsLoading(false);
      console.error("Login exception:", err);
      return {
        success: false,
        error: err?.message || "Une erreur est survenue lors de la tentative de connexion.",
      };
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    companyName: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();
    const cleanName = (fullName || "").trim();
    const cleanCompany = (companyName || "").trim();

    if (!cleanEmail || !cleanPass) {
      setIsLoading(false);
      return { success: false, error: "L'adresse e-mail et le mot de passe sont requis." };
    }

    if (!cleanName || !cleanCompany) {
      setIsLoading(false);
      return { success: false, error: "Veuillez renseigner votre nom complet et le nom de votre entreprise." };
    }

    try {
      // 1. Check if user already exists in `app_users`
      const { data: existing } = await supabase
        .from("app_users")
        .select("id")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (existing) {
        setIsLoading(false);
        return {
          success: false,
          error: "Un compte existe déjà avec cette adresse email. Veuillez utiliser l'onglet 'Se connecter'.",
        };
      }

      // 2. Insert into `app_users` in Supabase
      const newId = `usr_${Date.now()}`;
      const { data: newUser, error: insertError } = await supabase
        .from("app_users")
        .insert({
          id: newId,
          email: cleanEmail,
          password_hash: cleanPass,
          full_name: cleanName,
          company_name: cleanCompany,
          role: "Directeur Général",
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating user in Supabase:", insertError);
        // Fallback to local session if DB write had an issue
      }

      const createdUser: AuthUser = {
        id: newUser?.id || newId,
        email: cleanEmail,
        fullName: cleanName,
        companyName: cleanCompany,
        role: "Directeur Général",
        createdAt: new Date().toISOString(),
      };

      // Set user session
      setUser(createdUser);
      localStorage.setItem("izi_auth_user", JSON.stringify(createdUser));

      // Also try silent Supabase Auth registration
      supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPass,
        options: { data: { full_name: cleanName, company_name: cleanCompany } },
      }).catch(() => {});

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      console.error("Register exception:", err);
      return {
        success: false,
        error: err?.message || "Une erreur est survenue lors de la création du compte.",
      };
    }
  };

  const loginDemo = () => {
    setUser(DEMO_USER);
    localStorage.setItem("izi_auth_user", JSON.stringify(DEMO_USER));
    router.push("/");
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("SignOut notice:", e);
    }
    localStorage.removeItem("izi_auth_user");
    setUser(null);
    router.push("/connexion");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
