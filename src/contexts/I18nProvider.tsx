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
    const guardado = localStorage.getItem("idioma") as Idioma | null;
    if (guardado && diccionarios[guardado]) {
      setIdioma(guardado);
    }
  }, []);

  const cambiarIdioma = useCallback((nuevo: Idioma) => {
    setIdioma(nuevo);
    localStorage.setItem("idioma", nuevo);
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
