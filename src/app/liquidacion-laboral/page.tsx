"use client";

import { Calculator, Grip, Shield, Tag, Info, HelpCircle, Globe, Moon, Sun } from "lucide-react";
import { useTheme } from "../theme-provider";
import Link from "next/link";

export default function LiquidacionLaboral() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen font-sans bg-background-app dark:bg-gray-900 flex flex-col items-center relative overflow-x-hidden text-text-primary dark:text-gray-100 transition-colors duration-300">
      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-bg-graphic dark:bg-white/5 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 -translate-y-1/4 translate-x-1/4 pointer-events-none z-0 transition-colors duration-300" />
      <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-bg-graphic dark:bg-white/5 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 translate-y-1/4 -translate-x-1/4 pointer-events-none z-0 transition-colors duration-300" />

      {/* Navbar */}
      <header className="w-full bg-background-app dark:bg-gray-900 border-b border-border-nav dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-primary dark:text-emerald-500 font-bold text-xl tracking-tight mr-4 lg:mr-8 hover:opacity-80 transition-opacity">
              <Calculator className="w-6 h-6" />
              <span className="hidden sm:block">CalcuCol</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 relative">
            <button onClick={toggleTheme} className="text-[#6B6B6B] dark:text-gray-400 hover:text-primary dark:hover:text-emerald-400 transition-colors p-2 rounded-full hover:bg-[#ECECEC] dark:hover:bg-gray-800">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <a href="#" className="hidden sm:block font-medium hover:text-primary dark:hover:text-emerald-400 transition-colors text-[#1A1A1A] dark:text-gray-100">Login</a>
            <a href="#" className="bg-primary hover:bg-primary-hover dark:bg-emerald-600 dark:hover:bg-emerald-500 text-surface dark:text-white px-5 py-2 rounded-lg font-medium transition-colors border border-transparent dark:border-emerald-500/20">Sign up</a>
            <div className="relative group">
              <button className="text-[#1A1A1A] dark:text-gray-100 dark:hover:opacity-80 transition-opacity p-2 ml-2">
                <Grip className="w-6 h-6" />
              </button>
              {/* Navbar Hover Menu */}
              <div className="absolute right-0 w-56 pt-2 invisible group-hover:visible z-50">
                <div className="bg-surface dark:bg-gray-800 border border-[#D9D9D9] dark:border-gray-700 shadow-lg rounded-xl overflow-hidden py-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                  <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-[#1A1A1A] dark:text-gray-100 hover:bg-[#F5F5F5] dark:hover:bg-gray-700 transition-colors">
                    <Shield className="w-4 h-4 text-[#6B6B6B] dark:text-gray-400" /> Seguridad
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-[#1A1A1A] dark:text-gray-100 hover:bg-[#F5F5F5] dark:hover:bg-gray-700 transition-colors">
                    <Tag className="w-4 h-4 text-[#6B6B6B] dark:text-gray-400" /> Pricing
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-[#1A1A1A] dark:text-gray-100 hover:bg-[#F5F5F5] dark:hover:bg-gray-700 transition-colors">
                    <Info className="w-4 h-4 text-[#6B6B6B] dark:text-gray-400" /> Sobre nosotros
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-[#1A1A1A] dark:text-gray-100 hover:bg-[#F5F5F5] dark:hover:bg-gray-700 transition-colors">
                    <HelpCircle className="w-4 h-4 text-[#6B6B6B] dark:text-gray-400" /> Ayuda
                  </a>
                  <div className="border-t border-[#E5E7EB] dark:border-gray-700 my-1"></div>
                  <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-[#1A1A1A] dark:text-gray-100 hover:bg-[#F5F5F5] dark:hover:bg-gray-700 transition-colors">
                    <Globe className="w-4 h-4 text-[#6B6B6B] dark:text-gray-400" /> Lenguaje
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-[1400px] flex-grow flex flex-col py-16 px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] dark:text-white mb-4">Liquidación Laboral</h1>
          <p className="text-[#6B6B6B] dark:text-gray-400 max-w-2xl">
            Calcula el valor exacto de tu liquidación al terminar un contrato en Colombia. Ingresa los datos de tu empleo para obtener un cálculo preciso de tus prestaciones sociales.
          </p>
        </div>

        {/* Calculator Interface Container Placeholder */}
        <div className="bg-surface dark:bg-gray-800 border border-[#D4D4D4] dark:border-gray-700 rounded-2xl p-6 md:p-10 shadow-sm min-h-[500px] flex items-center justify-center">
          <div className="text-center text-[#6B6B6B] dark:text-gray-400">
            <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-[#1A1A1A] dark:text-gray-200">Área de Calculadora</h2>
            <p>Aquí construiremos la interfaz de liquidación</p>
          </div>
        </div>
      </main>

      {/* Footer V2 SEO Optimized */}
      <footer className="w-full bg-primary dark:bg-gray-950 mt-auto py-12 z-10 text-white border-t border-transparent dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tight mb-4 text-white">
              <Calculator className="w-6 h-6" />
              <span>CalcuCol</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              La plataforma 100% gratuita diseñada para que los colombianos puedan calcular todas sus finanzas, impuestos, liquidación de nómina, créditos y subsidios de manera exacta, rápida y transparente. Tu aliado clave para la educación y planeación financiera en Colombia.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Calculadoras Destacadas</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/liquidacion-laboral" className="hover:text-white transition-colors">Calculadora de Liquidación Laboral</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Simulador de Cesantías e Intereses</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Simulador de Crédito Hipotecario</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Simulador de Declaración de Renta DIAN</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Conversor de Divisas Dólar a COP</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Valor de la UVT Actualizada</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Legal & Enlaces</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">Términos de Uso y Condiciones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad y Datos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Aviso Legal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Preguntas Frecuentes (FAQ)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto y Soporte</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-white/20 text-center md:text-left text-white/60 text-sm">
          <p>
            Esta plataforma fue diseñada y creada por Noctis Group.<br />
            Hecho con ❤️ en Colombia 🇨🇴 para el bienestar financiero del país.
          </p>
        </div>
      </footer>
    </div>
  );
}
