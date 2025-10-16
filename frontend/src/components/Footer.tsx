import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-{#e1e1e1} text-black py-6 mt-10">
      <div className="flex items-center gap-3 justify-center mb-4">
        <h1 className="text-4xl font-pacifico">Femeninamente</h1>
      </div>
      <ul className="flex gap-6 justify-center mb-4">
        <li>
          <a href="#" className="text-black hover:text-gray-600 transition-colors">
            <FaFacebookF size={20} />
          </a>
        </li>
        <li>
          <a href="#" className="text-black hover:text-gray-600 transition-colors">
            <FaTwitter size={20} />
          </a>
        </li>
        <li>
          <a href="#" className="text-black hover:text-gray-600 transition-colors">
            <FaInstagram size={20} />
          </a>
        </li>
        <li>
          <a href="#" className="text-black hover:text-gray-600 transition-colors">
            <FaLinkedin size={20} />
          </a>
        </li>
      </ul>
      <div className="text-center px-4">
        <p>&copy; {new Date().getFullYear()} Femininamente. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
