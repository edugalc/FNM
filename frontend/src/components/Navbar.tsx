"use client";

import Cart from "./Cart";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const { token, logout, loading } = useAuth();
  const router = useRouter();
  const setCount = useCartStore((state) => state.setCount);

  useEffect(() => {
    if (!token) return;

    const loadCart = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carrito`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setCount(data.totalItems ?? 0);
      } catch (err) {
        console.error("Error cargando carrito en navbar:", err);
      }
    };

    loadCart();
  }, [token, setCount]);

  if (loading) return null;

  return (
    <header className="w-full fixed top-0 left-0 z-50 backdrop-blur-md bg-white/70 border-b border-black/5">
      <nav className="h-20 flex items-center justify-center px-6 md:px-10">
        <div className="flex justify-between items-center w-full max-w-6xl mx-auto">

          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => router.push("/")}
          >
            <h1 className="text-3xl md:text-4xl font-pacifico tracking-tight text-black">
              Femeninamente
            </h1>
          </div>

          {/* LINKS */}
          <ul className="flex items-center gap-4 md:gap-6 ml-auto">

            <li>
              <Link
                href="/ebooks"
                className="rounded-xl px-5 text-black py-2 border border-black/60 hover:bg-black hover:text-white transition-all duration-200"
              >
                eBooks
              </Link>
            </li>

            <li>
              <Link
                href="/cursos"
                className="rounded-xl px-5 py-2 border text-black border-black/60 hover:bg-black hover:text-white transition-all duration-200"
              >
                Cursos
              </Link>
            </li>

            {!token && (
              <li>
                <button
                  onClick={() => router.push("/register")}
                  className="rounded-xl px-5 py-2 bg-black text-white border border-black hover:bg-white hover:text-black transition-all duration-200"
                >
                  Únete
                </button>
              </li>
            )}

            <li>
              <button
                onClick={() => router.push(token ? "/dashboard" : "/login")}
                className="rounded-xl px-5 py-2 bg-black text-white border border-black hover:bg-white hover:text-black transition-all duration-200"
              >
                {token ? "Tu cuenta" : "Iniciar sesión"}
              </button>
            </li>

            {token && (
              <li>
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="rounded-xl px-5 py-2 bg-red-500 text-white border border-red-600 hover:bg-red-600 transition-all duration-200"
                >
                  Cerrar sesión
                </button>
              </li>
            )}

            {/* CARRITO */}
            <li>
              <Cart />
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
