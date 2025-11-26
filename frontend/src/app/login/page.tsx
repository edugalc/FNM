"use client";

import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
   <div className="relative min-h-screen flex items-center justify-center px-4">

  {/* Fondo */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/img/pexels-alex-green-5699475.jpg')" }}
  />

  {/* Capa oscura */}
  <div className="absolute inset-0 bg-white/40" />

  {/* Contenido */}
  <div className="relative z-10">
    <LoginForm />
  </div>
</div>

  );
}
