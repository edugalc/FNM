import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#e1e1e1] text-black py-10 mt-10">
      {/* Marca */}
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-3xl md:text-4xl font-pacifico tracking-tight text-black">
  Femenina<span className="font-Geist">-</span><span className="text-pink-500">mente</span>
</h1>
      </div>

      {/* Redes sociales */}
      <ul className="flex gap-6 justify-center mb-6">
        {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
          <li key={index}>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-black hover:text-white transition-all"
            >
              <Icon size={18} />
            </a>
          </li>
        ))}
      </ul>

      {/* Copyright */}
      <div className="text-center px-4">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Femeninamente. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
