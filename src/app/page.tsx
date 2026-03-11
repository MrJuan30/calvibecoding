"use client";

import { useState } from "react";
import {
  Calculator,
  Briefcase,
  FileText,
  CreditCard,
  PiggyBank,
  Store,
  Clock,
  LogOut,
  Calendar,
  Building,
  TrendingDown,
  Car,
  CircleDollarSign,
  Home as HomeIcon,
  ShoppingBag,
  BadgePercent,
  TrendingUp,
  Landmark,
  Wallet,
  Users,
  Receipt,
  Scale,
  ArrowRightLeft,
  Activity,
  Key,
  Moon,
  Menu,
  Shield,
  Tag,
  Info,
  HelpCircle,
  Globe
} from "lucide-react";

// Types
type CategoryInfo = {
  id: string;
  label: string;
};

type CalculatorInfo = {
  title: string;
  description: string;
  categoryId: string;
  icon: React.ElementType;
  iconColor: string;
};

// Data
const categories: CategoryInfo[] = [
  { id: "todas", label: "Todas" },
  { id: "laboral", label: "Laboral" },
  { id: "impuestos", label: "Impuestos y Dian" },
  { id: "creditos", label: "Créditos y Deudas" },
  { id: "pension", label: "Pensión y Ahorro" },
  { id: "negocios", label: "Negocios e Independientes" },
  { id: "diadia", label: "Día a Día" },
];

const calculators: CalculatorInfo[] = [
  // LABORAL (Blue / Indigo)
  { title: "Liquidación laboral", description: "Calcula el valor exacto de tu liquidación al terminar un contrato.", categoryId: "laboral", icon: Calculator, iconColor: "text-blue-500" },
  { title: "Prima de servicios", description: "Conoce cuánto te toca de prima en junio y diciembre.", categoryId: "laboral", icon: Briefcase, iconColor: "text-indigo-500" },
  { title: "Cesantías e Intereses", description: "Calcula este ahorro obligatorio y sus respectivos intereses.", categoryId: "laboral", icon: PiggyBank, iconColor: "text-blue-600" },
  { title: "Salario Neto", description: "Calcula cuánto dinero real llega a tu cuenta después de deducciones.", categoryId: "laboral", icon: Wallet, iconColor: "text-indigo-600" },
  { title: "Horas extras y recargos", description: "Valor de horas extras diurnas, nocturnas y dominicales.", categoryId: "laboral", icon: Clock, iconColor: "text-blue-400" },
  { title: "Indemnización por despido", description: "Calcula el valor de la indemnización por despido sin justa causa.", categoryId: "laboral", icon: LogOut, iconColor: "text-indigo-400" },
  { title: "Vacaciones", description: "Descubre el monto a recibir por tus días de descanso compensado.", categoryId: "laboral", icon: Calendar, iconColor: "text-blue-500" },

  // IMPUESTOS Y DIAN (Red / Rose)
  { title: "Declaración de renta", description: "Simulador para saber si debes declarar y un aproximado del valor.", categoryId: "impuestos", icon: FileText, iconColor: "text-red-500" },
  { title: "Retención en la fuente", description: "Calcula los descuentos mensuales por retención salarial.", categoryId: "impuestos", icon: TrendingDown, iconColor: "text-rose-500" },
  { title: "IVA Colombia", description: "Agrega o extrae el 19% o 5% de IVA de cualquier valor.", categoryId: "impuestos", icon: Receipt, iconColor: "text-red-600" },
  { title: "Impuesto Vehicular", description: "Estimado del impuesto anual para carros y motos en Colombia.", categoryId: "impuestos", icon: Car, iconColor: "text-rose-600" },
  { title: "UVT del Año", description: "Calculadora de conversión de pesos a UVT y viceversa.", categoryId: "impuestos", icon: CircleDollarSign, iconColor: "text-red-400" },

  // CREDITOS Y DEUDAS (Orange / Amber)
  { title: "Simulador Hipotecario", description: "Proyecta las cuotas de tu crédito para vivienda nueva o usada.", categoryId: "creditos", icon: HomeIcon, iconColor: "text-orange-500" },
  { title: "Simulador de consumo", description: "Calcula el costo total y las cuotas de créditos personales.", categoryId: "creditos", icon: ShoppingBag, iconColor: "text-amber-500" },
  { title: "Crédito de libre inversión", description: "Compara tasas y proyecta pagos para libre destinación.", categoryId: "creditos", icon: CreditCard, iconColor: "text-orange-600" },
  { title: "Aplico a subsidios", description: "Herramienta para saber a qué subsidios de vivienda aplicas (Mi Casa Ya).", categoryId: "creditos", icon: Building, iconColor: "text-amber-600" },
  { title: "Tarjeta de crédito", description: "Calcula intereses y cuotas reales al pagar con tarjeta.", categoryId: "creditos", icon: BadgePercent, iconColor: "text-orange-400" },

  // PENSION Y AHORRO (Green / Emerald)
  { title: "Comparador de pensiones", description: "Diferencias entre Colpensiones y fondos privados según tu salario.", categoryId: "pension", icon: Scale, iconColor: "text-green-500" },
  { title: "Ahorro con CDT", description: "Simula el rendimiento de tu dinero en un Certificado de Depósito.", categoryId: "pension", icon: TrendingUp, iconColor: "text-emerald-500" },
  { title: "Ahorro Voluntario", description: "Beneficios tributarios por aportar a cuentas AFC o pensión voluntaria.", categoryId: "pension", icon: Landmark, iconColor: "text-green-600" },

  // NEGOCIOS E INDEPENDIENTES (Purple / Fuchsia)
  { title: "Aportes independientes", description: "Calcula seguridad social (salud, pensión, ARL) como prestador de servicios.", categoryId: "negocios", icon: Users, iconColor: "text-purple-500" },
  { title: "Nómina y costo empleado", description: "Conoce el costo real total que asume la empresa por contratar a alguien.", categoryId: "negocios", icon: Calculator, iconColor: "text-fuchsia-500" },
  { title: "Factura e IVA para negocios", description: "Ayuda rápida para calcular totales antes o después de impuestos.", categoryId: "negocios", icon: Receipt, iconColor: "text-purple-600" },
  { title: "Régimen Simple", description: "Simulador para tributación especial para pequeñas empresas.", categoryId: "negocios", icon: Store, iconColor: "text-fuchsia-600" },

  // DIA A DIA (Teal / Cyan)
  { title: "Dólar a peso Colombiano", description: "Conversor rápido usando la TRM actual o un valor histórico.", categoryId: "diadia", icon: ArrowRightLeft, iconColor: "text-teal-500" },
  { title: "Inflación y adquisitivo", description: "Descubre cómo ha cambiado el valor del dinero con el tiempo.", categoryId: "diadia", icon: Activity, iconColor: "text-cyan-500" },
  { title: "Arriendo Justo", description: "Calcula el incremento legal permitido para contratos de vivienda.", categoryId: "diadia", icon: Key, iconColor: "text-teal-600" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("todas");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filteredCalculators =
    activeCategory === "todas"
      ? calculators
      : calculators.filter((c) => c.categoryId === activeCategory);

  const categoriesToRender =
    activeCategory === "todas"
      ? categories.filter((c) => c.id !== "todas")
      : [categories.find((c) => c.id === activeCategory)!];

  return (
    <div className="min-h-screen font-sans bg-background-app flex flex-col items-center relative overflow-hidden text-text-primary">
      {/* Background Graphic Elements */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-bg-graphic rounded-full mix-blend-multiply filter blur-[100px] opacity-70 -translate-y-1/4 translate-x-1/4 pointer-events-none z-0"
      />
      <div
        className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-bg-graphic rounded-full mix-blend-multiply filter blur-[100px] opacity-70 translate-y-1/4 -translate-x-1/4 pointer-events-none z-0"
      />

      {/* Navbar - Solid background, subtle bottom border */}
      <header className="w-full bg-background-app border-b border-border-nav sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            {/* Logo ~20-30px from left padding + standard padding */}
            <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight mr-10 lg:mr-14">
              <Calculator className="w-6 h-6" />
              <span>CalcuCol</span>
            </div>

            {/* Nav links ~40-60px from logo */}
            <nav className="hidden md:flex gap-8 items-center">
              <a href="#" className="font-medium hover:text-primary transition-colors">Calculadoras</a>
              <a href="#" className="font-medium hover:text-primary transition-colors">Categorías</a>
            </nav>
          </div>

          <div className="flex items-center gap-4 relative">
            <button className="text-[#6B6B6B] hover:text-primary transition-colors p-2 rounded-full hover:bg-[#ECECEC]">
              <Moon className="w-5 h-5" />
            </button>
            <a href="#" className="hidden sm:block font-medium hover:text-primary transition-colors">Login</a>
            <a href="#" className="bg-primary hover:bg-primary-hover text-surface px-5 py-2 rounded-lg font-medium transition-colors">
              Sign up
            </a>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-[#1A1A1A] hover:opacity-80 transition-opacity p-2 ml-2"
              >
                <Menu className="w-6 h-6" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface border border-[#D9D9D9] shadow-lg rounded-xl overflow-hidden py-1 z-50">
                  <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors">
                    <Shield className="w-4 h-4 text-[#6B6B6B]" /> Seguridad
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors">
                    <Tag className="w-4 h-4 text-[#6B6B6B]" /> Pricing
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors">
                    <Info className="w-4 h-4 text-[#6B6B6B]" /> Sobre nosotros
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors">
                    <HelpCircle className="w-4 h-4 text-[#6B6B6B]" /> Ayuda
                  </a>
                  <div className="border-t border-[#E5E7EB] my-1"></div>
                  <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors">
                    <Globe className="w-4 h-4 text-[#6B6B6B]" /> Lenguaje
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-4xl mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#1A1A1A] tracking-tight mb-6 leading-tight max-w-3xl">
          Calcula todo lo <span className="animate-colombia inline-block min-w-[300px]">importante</span> en segundos
        </h1>
        <p className="text-lg md:text-xl text-[#6B6B6B] max-w-2xl leading-relaxed">
          Todo lo que el Colombiano necesita calcular, desde liquidación laboral, cesantías,
          créditos, impuestos y finanzas personales. Herramientas gratuitas hechas para el Colombiano.
        </p>
      </section>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-32">

        {/* Category Filters row - minimal background, simple border change on hover */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-colors duration-200 border bg-background-app ${activeCategory === cat.id
                ? "border-[#9A9A9A] text-primary" // Active: darker border and orange text
                : "border-[#CFCFCF] text-[#6B6B6B] hover:border-[#9A9A9A]" // Hover: border gets darker, background stays light
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid Area */}
        <div className="w-full flex flex-col gap-12">
          {categoriesToRender.map((category) => {
            const items = filteredCalculators.filter(
              (c) => c.categoryId === category.id
            );
            if (items.length === 0) return null;

            return (
              <section key={category.id} className="w-full">
                {activeCategory === "todas" && (
                  <h2 className="text-xl font-bold text-[#1A1A1A] mb-8 pb-2 border-b border-[#E5E7EB]">
                    {category.label}
                  </h2>
                )}
                {/* 1 col mobile, 2 col tablet, 4 col desktop. Wider cards, solid 1px border. */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        className="group bg-surface rounded-xl p-5 border border-[#D4D4D4] hover:border-[#9A9A9A] transition-colors duration-200 cursor-pointer flex items-center gap-4"
                      >
                        {/* Transparent icon wrapper with colored icon */}
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-transparent">
                          <Icon className={`w-8 h-8 ${item.iconColor}`} strokeWidth={1.5} />
                        </div>
                        <div className="flex-col">
                          <h3 className="text-base font-semibold text-[#1A1A1A] mb-0.5 leading-tight group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-[13px] text-[#6B6B6B] leading-snug">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* Footer V1 Structure with new text */}
      <footer className="w-full bg-surface border-t border-border-subtle mt-auto py-8 z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm font-medium text-center md:text-left">
            Esta plataforma fue diseñada y desarrollada por Sebastian Cantor.<br />
            Hecho en Colombia 🇨🇴 para ayudar a los Colombianos a calcular de forma simple y clara sus finanzas, impuestos y decisiones importantes.
          </p>
          <div className="flex gap-6 text-sm text-text-secondary">
            <a href="#" className="hover:text-primary transition-colors">Términos de uso</a>
            <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
            <a href="#" className="hover:text-primary transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
