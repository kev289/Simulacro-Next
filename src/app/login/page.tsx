"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginLogic } from "@/src/hooks/useLoginLogic";
import { useTraduccion } from "@/src/contexts/I18nProvider";
import { BarraNavegacion } from "@/src/components/BarraNavegacion";
import { useAuth } from "@/src/hooks/useAuth";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { handleLoginSubmit, loading, error: loginError } = useLoginLogic();
  const { usuario, cargando } = useAuth();
  const { t, idioma } = useTraduccion();
  const router = useRouter();

  const [googleError, setGoogleError] = useState<string | null>(null);

  useEffect(() => {
    const handleGoogleResponse = async (response: any) => {
      try {
        setGoogleError(null);
        
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: response.credential }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Error al autenticar con Google");
        }

        router.refresh();
        router.push(`/${idioma}`);
      } catch (err: any) {
        setGoogleError(err.message || "Hubo un problema con la autenticación");
      }
    };

    if (typeof window !== "undefined" && (window as any).google) {
      const google = (window as any).google;

      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { 
          theme: "outline", 
          size: "large", 
          text: "signin_with", // Cambia el texto automáticamente a "Iniciar sesión con Google"
          width: "100%",
          shape: "rectangular"
        }
      );
    }
  }, [router, idioma]);

  const activeError = loginError || googleError;

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex flex-col">
      <BarraNavegacion usuario={usuario} cargando={cargando} />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4">
                <LogIn size={28} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">{t.iniciarSesion}</h1>
              <p className="text-sm text-slate-500 mt-1">Accede a tu cuenta para comprar y guardar favoritos.</p>
            </div>

            {activeError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" /> {activeError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t.correo}
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t.contrasena}
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    autoComplete="current-password"
                    className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn size={16} />
                )}
                {loading ? t.entrando : t.iniciarSesion}
              </button>
            </form>

            {/* Separador Visual */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs text-slate-400 uppercase">
                <span className="bg-white px-2">O continuar con</span>
              </div>
            </div>

            {/* Contenedor del botón de Google */}
            <div id="googleBtn" className="w-full flex justify-center min-h-44px"></div>

            <p className="mt-6 text-center text-sm text-slate-500">
              ¿No tienes cuenta?{" "}
              <Link href={`/${idioma}/register`} className="text-indigo-600 font-medium hover:text-indigo-800">
                {t.registrarse}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}