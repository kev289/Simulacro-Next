import { useRouter } from "next/navigation";
import { useState } from "react";

export function useLoginLogic() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "ERR_EXECUTE_LOGIN_FAILED");
      }

      // Autenticación exitosa: va para el dashboard de una
      router.push("/dashboard");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { handleLoginSubmit, loading, error };
}