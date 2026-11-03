"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, DEMO_USER } from "@/lib/auth-context";
import {
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  Mail,
  Building2,
  User,
  CheckCircle2,
  AlertCircle,
  Coins,
  Smartphone,
  Check,
  Zap,
} from "lucide-react";

export default function ConnexionPage() {
  const router = useRouter();
  const { login, register, loginDemo, isLoading: authLoading } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setErrorMessage("Veuillez renseigner votre adresse e-mail.");
      return;
    }

    if (!cleanPassword) {
      setErrorMessage("Veuillez saisir votre mot de passe.");
      return;
    }

    if (mode === "register") {
      if (!fullName.trim() || !companyName.trim()) {
        setErrorMessage("Veuillez renseigner votre nom complet et le nom de votre entreprise.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const res = await login(cleanEmail, cleanPassword);
        if (res.success) {
          router.push("/");
        } else {
          setErrorMessage(res.error || "Identifiants invalides.");
        }
      } else {
        const res = await register(cleanEmail, cleanPassword, fullName.trim(), companyName.trim());
        if (res.success) {
          setSuccessMessage("Compte créé avec succès ! Redirection vers le tableau de bord...");
          setTimeout(() => {
            router.push("/");
          }, 600);
        } else {
          setErrorMessage(res.error || "Impossible de créer le compte.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Une erreur inattendue est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail(DEMO_USER.email);
    setPassword("demo1234");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#0e1117] text-white flex flex-col justify-center relative overflow-hidden selection:bg-violet-500 selection:text-white">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-slate-900/40 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Showcase & Value Propositions */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between pr-4 space-y-8">
            <div className="space-y-6">
              {/* Brand Identity */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-violet-500/25 ring-1 ring-white/20">
                  i
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-2xl tracking-tight text-white">
                      izi facture
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      UEMOA • CEMAC
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium block">
                    Facturation & Trésorerie FCFA pour PME
                  </span>
                </div>
              </div>

              {/* Catchphrase */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Gérez vos factures en FCFA avec la simplicité du Mobile Money.
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                  La solution cloud tout-en-un pour indépendants et entreprises d'Afrique francophone.
                  Factures sans centimes, devis instantanés et paiements Wave & Orange Money.
                </p>
              </div>

              {/* Value proposition badges */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white block">Conforme FCFA (XOF & XAF)</span>
                    <span className="text-slate-400">Arrondis entiers automatiques et TVA standard à 18%.</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white block">Mobile Money & Banques intégrés</span>
                    <span className="text-slate-400">Wave, Orange Money, MTN MoMo, Moov et RIB bancaire sur le papier officiel.</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white block">Base Supabase PostgreSQL Cloud</span>
                    <span className="text-slate-400">Sauvegarde sécurisée en temps réel et accès multi-appareils.</span>
                  </div>
                </div>
              </div>

              {/* Social Proof Note */}
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-400">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Données hébergées en cloud avec intégrité financière stricte.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Auth Card */}
          <div className="w-full lg:col-span-6 max-w-md mx-auto">
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl shadow-black/60 p-6 sm:p-8 backdrop-blur-xl relative">
              
              {/* Header on mobile */}
              <div className="flex lg:hidden items-center justify-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-violet-500/20">
                  i
                </div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  izi facture
                </span>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-950/70 rounded-2xl border border-slate-800 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    mode === "login"
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Se connecter
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    mode === "register"
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Créer un compte
                </button>
              </div>

              {/* Title & Subtitle */}
              <div className="mb-5">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  {mode === "login" ? "Connexion à votre espace" : "Créer votre compte entreprise"}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {mode === "login"
                    ? "Renseignez vos identifiants pour gérer vos factures et devis."
                    : "Remplissez les informations de votre entreprise pour démarrer."}
                </p>
              </div>

              {/* Quick 1-Click Demo Access Banner */}
              <div className="mb-5">
                <button
                  type="button"
                  onClick={loginDemo}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-violet-600/30 via-indigo-600/30 to-violet-600/20 hover:from-violet-600/40 hover:to-indigo-600/40 border border-violet-500/40 text-white font-bold text-xs shadow-md shadow-violet-900/30 active:scale-[0.98] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-violet-500 text-white flex items-center justify-center shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-bold text-white leading-tight">Accès Rapide Démo</span>
                      <span className="text-[10px] text-violet-300 font-normal">Connexion immédiate en 1 clic (sans mot de passe)</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-violet-300 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <span className="relative px-3 bg-slate-900 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    ou avec vos identifiants
                  </span>
                </div>
              </div>

              {/* Alerts */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {mode === "register" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Votre Nom complet
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="ex: Israel G."
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Nom de votre Entreprise
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="ex: Afrik Innovations SARL"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Adresse E-mail
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={handleFillDemo}
                        className="text-[10px] text-violet-400 hover:text-violet-300 font-medium underline"
                      >
                        Remplir avec compte démo
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="nom@entreprise.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || authLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-bold text-xs shadow-lg shadow-violet-600/30 active:scale-[0.98] transition-all disabled:opacity-50 mt-3"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Validation en cours...</span>
                    </div>
                  ) : (
                    <span>
                      {mode === "login" ? "Se connecter à la plateforme" : "Créer mon compte entreprise"}
                    </span>
                  )}
                </button>
              </form>

              {/* Footer info */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
                <p className="text-[11px] text-slate-500">
                  Plateforme certifiée • Zone UEMOA & CEMAC •{" "}
                  <a href="/aide" className="text-violet-400 hover:underline">
                    Assistance
                  </a>
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
