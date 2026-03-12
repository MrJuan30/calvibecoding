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
  Sun,
  Grip,
  Shield,
  Tag,
  Info,
  HelpCircle,
  Globe,
  Search
} from "lucide-react";
import { useTheme } from "./theme-provider";
import Link from "next/link";

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
  href?: string;
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
  { title: "Liquidación laboral", description: "Calcula el valor exacto de tu liquidación al terminar un contrato.", categoryId: "laboral", icon: Calculator, iconColor: "text-blue-500", href: "/liquidacion-laboral" },
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
  { title: "Aplico a subsidios", description: "Herramienta para saber a qué subsidios de vivienda aplicas (Subsidios de la caja de compensacion).", categoryId: "creditos", icon: Building, iconColor: "text-amber-600" },
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
  { title: "Divisa a peso colombiano", description: "Conversor rápido usando la TRM actual o un valor histórico.", categoryId: "diadia", icon: ArrowRightLeft, iconColor: "text-teal-500" },
  { title: "Inflación y adquisitivo", description: "Descubre cómo ha cambiado el valor del dinero con el tiempo.", categoryId: "diadia", icon: Activity, iconColor: "text-cyan-500" },
  { title: "Arriendo Justo", description: "Calcula el incremento legal permitido para contratos de vivienda.", categoryId: "diadia", icon: Key, iconColor: "text-teal-600" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("todas");
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();

  const filteredCalculators = calculators.filter((c) => {
    const matchesCategory = activeCategory === "todas" || c.categoryId === activeCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchLower === "" || 
                          c.title.toLowerCase().includes(searchLower) || 
                          c.description.toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  const categoriesToRender =
    activeCategory === "todas"
      ? categories.filter((c) => c.id !== "todas")
      : [categories.find((c) => c.id === activeCategory)!];

  return (
    <div className="min-h-screen font-sans bg-background-app dark:bg-gray-900 flex flex-col items-center relative overflow-x-hidden text-text-primary dark:text-gray-100 transition-colors duration-300">
      {/* Background Graphic Elements */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-bg-graphic dark:bg-white/5 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 -translate-y-1/4 translate-x-1/4 pointer-events-none z-0 transition-colors duration-300"
      />
      <div
        className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-bg-graphic dark:bg-white/5 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 translate-y-1/4 -translate-x-1/4 pointer-events-none z-0 transition-colors duration-300"
      />

      {/* Navbar - Solid background, subtle bottom border */}
      <header className="w-full bg-background-app dark:bg-gray-900 border-b border-border-nav dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            {/* Logo ~20-30px from left padding + standard padding */}
            <Link href="/" className="flex items-center gap-2 text-primary dark:text-emerald-500 font-bold text-xl tracking-tight mr-4 lg:mr-8 hover:opacity-80 transition-opacity">
              <Calculator className="w-6 h-6" />
              <span className="hidden sm:block">CalcuCol</span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 w-[300px] lg:w-[400px] relative">
              <div className="absolute left-4 text-[#6B6B6B] dark:text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Busca una calculadora..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-surface dark:bg-gray-800 border border-[#D9D9D9] dark:border-gray-700 rounded-full text-sm focus:outline-none focus:border-primary dark:focus:border-emerald-500 transition-colors text-[#1A1A1A] dark:text-gray-100 placeholder-[#6B6B6B] dark:placeholder-gray-400 shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            <button
              onClick={toggleTheme}
              className="text-[#6B6B6B] dark:text-gray-400 hover:text-primary dark:hover:text-emerald-400 transition-colors p-2 rounded-full hover:bg-[#ECECEC] dark:hover:bg-gray-800"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <a href="#" className="hidden sm:block font-medium hover:text-primary dark:hover:text-emerald-400 transition-colors text-[#1A1A1A] dark:text-gray-100">Login</a>
            <a href="#" className="bg-primary hover:bg-primary-hover dark:bg-emerald-600 dark:hover:bg-emerald-500 text-surface dark:text-white px-5 py-2 rounded-lg font-medium transition-colors border border-transparent dark:border-emerald-500/20">
              Sign up
            </a>
            <div className="relative group">
              <button className="text-[#1A1A1A] dark:text-gray-100 dark:hover:opacity-80 transition-opacity p-2 ml-2">
                <Grip className="w-6 h-6" />
              </button>
              {/* Invisible area to connect hover from button to menu */}
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

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-4xl mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#1A1A1A] dark:text-white tracking-tight mb-6 leading-tight max-w-3xl">
          Calcula todo lo <span className="animate-colombia inline-block min-w-[300px]">importante</span> en segundos
        </h1>
        <p className="text-lg md:text-xl text-[#6B6B6B] dark:text-gray-400 max-w-2xl leading-relaxed">
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
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-colors duration-200 border bg-background-app dark:bg-gray-900 ${activeCategory === cat.id
                ? "border-[#9A9A9A] dark:border-emerald-500 text-primary dark:text-emerald-500" // Active: darker border and orange text
                : "border-[#CFCFCF] dark:border-gray-700 text-[#6B6B6B] dark:text-gray-400 hover:border-[#9A9A9A] dark:hover:border-gray-500 hover:text-[#1A1A1A] dark:hover:text-gray-200" // Hover: border gets darker, background stays light
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
                  <h2 className="text-xl font-bold text-[#1A1A1A] dark:text-gray-100 mb-8 pb-2 border-b border-[#E5E7EB] dark:border-gray-700 transition-colors duration-200">
                    {category.label}
                  </h2>
                )}
                {/* 1 col mobile, 2 col tablet, 4 col desktop. Wider cards, solid 1px border. */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map((item, idx) => {
                    const Icon = item.icon;
                    
                    const CardContent = (
                      <div
                        className="group bg-surface dark:bg-gray-800 rounded-xl p-5 border border-[#D4D4D4] dark:border-gray-700 hover:border-[#9A9A9A] dark:hover:border-emerald-500/50 transition-colors duration-200 cursor-pointer flex items-center gap-4 h-full"
                      >
                        {/* Transparent icon wrapper with colored icon */}
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-transparent">
                          <Icon className={`w-8 h-8 ${item.iconColor} dark:opacity-90`} strokeWidth={1.5} />
                        </div>
                        <div className="flex-col">
                          <h3 className="text-base font-semibold text-[#1A1A1A] dark:text-gray-100 mb-0.5 leading-tight group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors duration-200">
                            {item.title}
                          </h3>
                          <p className="text-[13px] text-[#6B6B6B] dark:text-gray-400 leading-snug">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );

                    return item.href ? (
                      <Link key={idx} href={item.href} className="flex flex-col h-full">
                        {CardContent}
                      </Link>
                    ) : (
                      <div key={idx} className="flex flex-col h-full">
                        {CardContent}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
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
              <li><a href="#" className="hover:text-white transition-colors">Calculadora de Liquidación Laboral</a></li>
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
