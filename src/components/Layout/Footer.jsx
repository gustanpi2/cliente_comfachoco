import React from 'react';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Columna 1: Sobre Comfachocó */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <h3 className="text-xl font-bold">Comfachocó</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Comprometidos con el bienestar y desarrollo integral de nuestros colaboradores. 
              Juntos construimos un mejor futuro.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-700 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-700 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-700 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="font-bold text-lg mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="/inicio" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Inicio
                </a>
              </li>
              <li>
                <a href="/solicitudes" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Mis Solicitudes
                </a>
              </li>
              <li>
                <a href="/calendario" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Calendario
                </a>
              </li>
              <li>
                <a href="/bienestar" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Bienestar
                </a>
              </li>
              <li>
                <a href="/ayuda" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Ayuda y Soporte
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Recursos */}
          <div>
            <h4 className="font-bold text-lg mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li>
                <a href="/politicas" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Políticas de Vacaciones
                </a>
              </li>
              <li>
                <a href="/reglamento" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Reglamento Interno
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a href="/tutorial" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Tutorial del Portal
                </a>
              </li>
              <li>
                <a href="/privacidad" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Política de Privacidad
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Quibdó, Chocó<br />
                  Colombia
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={18} className="text-green-500 flex-shrink-0" />
                <a href="tel:+576711234567" className="text-gray-400 hover:text-white transition-colors">
                  +57 (671) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={18} className="text-green-500 flex-shrink-0" />
                <a href="mailto:info@comfachoco.com" className="text-gray-400 hover:text-white transition-colors">
                  info@comfachoco.com
                </a>
              </li>
            </ul>

            {/* Horario de atención */}
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs font-semibold text-gray-300 mb-1">Horario de Atención</p>
              <p className="text-xs text-gray-400">
                Lunes a Viernes<br />
                8:00 AM - 5:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Comfachocó. Todos los derechos reservados.
            </p>
            
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <span>Hecho con</span>
              <Heart size={16} className="text-red-500 fill-current animate-pulse" />
              <span>para nuestros colaboradores</span>
            </div>
          </div>
        </div>

        {/* Mensaje adicional */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Portal de Autogestión de Vacaciones y Permisos - Versión 1.0
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;