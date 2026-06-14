"use client";

import Link from "next/link";
import { useRegisterLogic } from "@/src/hooks/useRegisterLogic";
import { useTraduccion } from "@/src/contexts/I18nProvider";
import { SelectorIdioma } from "@/src/components/SelectorIdioma";

export default function RegisterPage() {
  const { handleRegisterSubmit, loading, error } = useRegisterLogic();
  const { t } = useTraduccion();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
            T
          </span>
          <span className="font-semibold text-slate-800">{t.marca}</span>
        </Link>
        <SelectorIdioma />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{t.registrarse}</h1>
          <p className="text-sm text-slate-500 mb-8">Crea tu cuenta en segundos.</p>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t.nombre}
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t.correo}
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t.contrasena}
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {loading ? t.creandoCuenta : t.registrarse}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-800">
              {t.iniciarSesion}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
