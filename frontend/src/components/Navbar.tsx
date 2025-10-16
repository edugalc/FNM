"use client";





import Cart from './Cart';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";


export default function Navbar() {
  const { token, logout } = useAuth();
  const router = useRouter();

  const handleLoginClick = () => {
    if (token) {
      router.push("/dashboard"); 
    } else {
      router.push("/login"); 
    }
  };

  const handleLogoutClick = () => {
    logout(); 
    router.push("/"); 
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <header>
      <nav className="h-16 w-full flex items-center justify-center bg-white text-black px-6 md:px-20 mt-6">
        <div className="flex justify-between items-center w-full max-w-6xl mx-auto">
       
          <div className="flex items-center gap-3">
            <Image
  src="/logo.png"
  alt="Logo"
  width={32}   
  height={32}
  className="h-8 cursor-pointer"
/>
            <h1 className="text-4xl font-pacifico cursor-pointer" onClick={() => router.push("/")}>
              Femeninamente
            </h1>
          </div>

  
          <ul className="flex items-center gap-4 ml-auto">
            <li>
              <a
                href="#"
                className="rounded-md px-6 py-2 border border-black hover:bg-black hover:text-white transition-colors"
              >
                eBooks
              </a>
            </li>
            <li>
              <a
                href="#"
                className="rounded-md px-6 py-2 border border-black hover:bg-black hover:text-white transition-colors"
              >
                Cursos
              </a>
            </li>

            {!token && (
              <li>
                <button
                  onClick={handleRegisterClick}
                  className="rounded-md px-6 py-2 border border-black bg-black text-white hover:bg-white hover:text-black transition-colors"
                >
                  Únete
                </button>
              </li>
            )}

            <li>
              <button
                onClick={handleLoginClick}
                className="rounded-md px-6 py-2 border border-black bg-black text-white hover:bg-white hover:text-black transition-colors"
              >
                {token ? "Tu cuenta" : "Iniciar sesión"}
              </button>
            </li>

            {token && (
              <li>
                <button
                  onClick={handleLogoutClick}
                  className="rounded-md px-6 py-2 border border-black bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Cerrar sesión
                </button>
              </li>
            )}

            <li className="relative cursor-pointer">
              <Cart />
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
