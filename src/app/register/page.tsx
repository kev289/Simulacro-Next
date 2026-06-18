"use client";

import Link from "next/link";
import { useRegisterLogic } from "@/src/hooks/useRegisterLogic";
import { useTraduccion } from "@/src/contexts/I18nProvider";
import { BarraNavegacion } from "@/src/components/BarraNavegacion";
import { useAuth } from "@/src/hooks/useAuth";
import { Mail, Lock, UserPlus, User, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const { handleRegisterSubmit, loading, error } = useRegisterLogic();
  const { usuario, cargando } = useAuth();
  const { t, idioma } = useTraduccion();

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex flex-col">
      <BarraNavegacion usuario={usuario} cargando={cargando} />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4">
                <UserPlus size={28} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">{t.registrarse}</h1>
              <p className="text-sm text-slate-500 mt-1">Crea tu cuenta en segundos.</p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t.nombre}
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                  />
                </div>
              </div>

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
                    autoComplete="new-password"
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
                  <UserPlus size={16} />
                )}
                {loading ? t.creandoCuenta : t.registrarse}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              ¿Ya tienes cuenta?{" "}
              <Link href={`/${idioma}/login`} className="text-indigo-600 font-medium hover:text-indigo-800">
                {t.iniciarSesion}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
