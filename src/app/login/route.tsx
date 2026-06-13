"use client";
import { useLoginLogic } from "@/src/hooks/useLoginLogic"; // Ajusta la ruta a tu hook de lógica

export default function LoginPage() {
  const { handleLoginSubmit, loading, error } = useLoginLogic();

  return (
    <main>
      {/* Si hay un error en la autenticación, se pinta este texto */}
      {error && <p style={{ color: "red" }}>[!!] {error}</p>}

      {/* AQUÍ METES TODO TU DISEÑO BLANCO Y NEGRO, SOLO MANTÉN ESTOS CAMPOS */}
      <form onSubmit={handleLoginSubmit}>
        
        <div>
          <label>EMAIL</label>
          <input type="email" name="email" required />
        </div>

        <div>
          <label>PASSWORD</label>
          <input type="password" name="password" required />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "AUTHENTICATING..." : "EXECUTE_LOGIN()"}
        </button>

      </form>
    </main>
  );
}