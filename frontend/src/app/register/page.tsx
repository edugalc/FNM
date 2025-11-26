"use client";

import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
   
     {/* Fondo */}
     <div
       className="absolute inset-0 bg-cover bg-center bg-no-repeat"
       style={{ backgroundImage: "url('/img/register-form.jpg')" }}
     />
   
     {/* Capa oscura */}
     <div className="absolute inset-0 bg-white/40" />
   
     {/* Contenido */}
     <div className="relative z-10">
       <RegisterForm />
     </div>
   </div>
  );
}
