"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  diccionarios,
  idiomas,
  type Idioma,
  type Traducciones,
} from "@/src/i18n/dictionaries";

function getIdiomaInicial(): Idioma {
  if (typeof document === "undefined") return "es";
  const cookies = document.cookie.split("; ").reduce(
    (acc, c) => {
      const [k, v] = c.split("=");
      acc[k] = v;
      return acc;
    },
    {} as Record<string, string>
  );
  const deCookie = cookies.lang as Idioma | undefined;
  if (deCookie && diccionarios[deCookie]) return deCookie;
  return "es";
}

interface I18nContextValue {
  idioma: Idioma;
  t: Traducciones;
  cambiarIdioma: (idioma: Idioma) => void;
  idiomasDisponibles: typeof idiomas;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>("es");

  useEffect(() => {
    setIdioma(getIdiomaInicial());
  }, []);

  const cambiarIdioma = useCallback((nuevo: Idioma) => {
    setIdioma(nuevo);
    document.cookie = `lang=${nuevo}; path=/; SameSite=Strict`;
  }, []);

  const value = useMemo(
    () => ({
      idioma,
      t: diccionarios[idioma],
      cambiarIdioma,
      idiomasDisponibles: idiomas,
    }),
    [idioma, cambiarIdioma]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTraduccion() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTraduccion debe usarse dentro de I18nProvider");
  }
  return context;
}
