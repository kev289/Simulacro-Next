"use client";
import { useRegisterLogic } from "@/src/hooks/useRegisterLogic"; 

export default function RegisterPage() {
  const { handleRegisterSubmit, loading, error } = useRegisterLogic();

  return (
    <main>
      {/* Mensaje de error nativo por si falla el registro */}
      {error && <p style={{ color: "red" }}>[!!] {error}</p>}

      {/* AQUÍ METES TODO TU DISEÑO BLANCO Y NEGRO, SOLO MANTÉN ESTOS CAMPOS */}
      <form onSubmit={handleRegisterSubmit}>
        
        <div>
          <label>NAME</label>
          <input type="text" name="name" required />
        </div>

        <div>
          <label>EMAIL</label>
          <input type="email" name="email" required />
        </div>

        <div>
          <label>PASSWORD</label>
          <input type="password" name="password" required />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "CREATING..." : "INITIALIZE_REGISTER()"}
        </button>

      </form>
    </main>
  );
}