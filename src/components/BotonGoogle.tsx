"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTraduccion } from "@/src/contexts/I18nProvider";
import { AlertCircle } from "lucide-react";

interface GoogleCredentialResponse {
  credential?: string;
}

export function BotonGoogle() {
  const router = useRouter();
  const { idioma } = useTraduccion();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleGoogleResponse = async (response: GoogleCredentialResponse) => {
      try {
        setError(null);
        if (!response.credential) throw new Error("No se recibió una credencial válida.");

        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.credential }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al autenticar con Google");

        router.refresh();
        router.push(`/${idioma}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Hubo un problema con la sesión");
      }
    };

    const renderButton = () => {
      const globalContext = window as unknown as { google?: any };
      if (globalContext.google?.accounts?.id) {
        const google = globalContext.google;

        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        const target = document.getElementById("googleBtnComponent");
        if (target) {
          google.accounts.id.renderButton(target, { 
            theme: "outline", 
            size: "large", 
            text: "signin_with", 
            width: "100%",
            shape: "rectangular"
          });
        }
      }
    };

    renderButton();

    const interval = setInterval(() => {
      const globalContext = window as unknown as { google?: any };
      if (globalContext.google?.accounts?.id) {
        renderButton();
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [router, idioma]);

  return (
    <div className="w-full space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}
      <div id="googleBtnComponent" className="w-full flex justify-center min-h-44px"></div>
    </div>
  );
}