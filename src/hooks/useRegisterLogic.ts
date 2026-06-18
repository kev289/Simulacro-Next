import { useRouter } from "next/navigation";
import { useState } from "react";

function getIdioma(): string {
  if (typeof document === "undefined") return "es";
  const match = document.cookie.match(/(?:^|;\s*)lang=(es|en|pt)/);
  return match?.[1] || "es";
}

export function useRegisterLogic() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "No se pudo crear la cuenta");
      }

      router.push(`/${getIdioma()}/login`);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { handleRegisterSubmit, loading, error };
}