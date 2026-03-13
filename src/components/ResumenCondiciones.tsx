import React, { useState } from 'react';
import { Info, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { CasosEspecialesResultados } from '../lib/casosEspeciales';

interface BadgeProps {
  type: 'info' | 'warning' | 'success' | 'alert';
  title: string;
  description: string;
  legalText: string;
}

const Badge: React.FC<BadgeProps> = ({ type, title, description, legalText }) => {
  const [expanded, setExpanded] = useState(false);

  // Colores Tailwind 4.0
  const colors = {
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    warning: 'bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    success: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    alert: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
  };

  const icons = {
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5 flex-shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5" />,
    alert: <AlertCircle className="w-5 h-5 flex-shrink-0" />
  };

  return (
    <div className={`p-4 rounded-xl border flex flex-col gap-2 transition-colors ${colors[type]}`}>
      <div className="flex items-start gap-3 justify-between">
        <div className="flex gap-3">
          {icons[type]}
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{title}</span>
            <span className="text-sm opacity-90 mt-1">{description}</span>
          </div>
        </div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold underline underline-offset-2 opacity-70 hover:opacity-100 flex-shrink-0"
        >
          {expanded ? 'Ocultar Ley' : 'Ver Base Legal'}
        </button>
      </div>
      
      {expanded && (
        <div className="mt-2 text-xs opacity-80 border-t border-black/10 dark:border-white/10 pt-2 pl-8">
          <span className="font-bold mr-1">Base Jurídica:</span> 
          {legalText}
        </div>
      )}
    </div>
  );
};

export default function ResumenCondiciones({ casos }: { casos: CasosEspecialesResultados }) {
  if (!casos) return null;

  const activeBadges = [];

  // 1. Transporte
  if (casos.aplicaTransporte.aplica) {
    activeBadges.push(
      <Badge 
        key="transporte" type="success" 
        title="Subsidio de Transporte Incluido" 
        description={casos.aplicaTransporte.mensaje} 
        legalText={casos.aplicaTransporte.legal} 
      />
    );
  }

  // 2. Prima Proporcional
  if (casos.desglosePrima.semestres.length > 0) {
    const semestresInfo = casos.desglosePrima.semestres.map(s => `${s.semestre}: ${s.dias} días`).join(' | ');
    activeBadges.push(
      <Badge 
        key="prima" type="info" 
        title="Prima de Servicios Proporcional" 
        description={`Cálculo de prima dividido en: ${semestresInfo}`} 
        legalText={casos.desglosePrima.legal} 
      />
    );
  }

  // 3. Indemnización
  if (casos.indemnizacionInfo?.aplica) {
    activeBadges.push(
      <Badge 
        key="indemnizacion" type="warning" 
        title="Indemnización Especial por Despido" 
        description={casos.indemnizacionInfo.mensaje} 
        legalText={casos.indemnizacionInfo.legal} 
      />
    );
  }

  // 4. Termino Fijo
  if (casos.notaTerminoFijo?.aplica) {
    activeBadges.push(
      <Badge 
        key="fijo" type="info" 
        title="Fin de Contrato a Término Fijo" 
        description={casos.notaTerminoFijo.mensaje} 
        legalText={casos.notaTerminoFijo.legal} 
      />
    );
  }

  // 5. Retefuente
  if (casos.alertaRetefuente?.aplica) {
    activeBadges.push(
      <Badge 
        key="retefuente" type="alert" 
        title="Advertencia Retención en la Fuente" 
        description={casos.alertaRetefuente.mensaje} 
        legalText={casos.alertaRetefuente.legal} 
      />
    );
  }

  // 6. Vacaciones Negativas
  if (casos.alertaVacacionesNegativas?.aplica) {
    activeBadges.push(
      <Badge 
        key="vacaciones" type="alert" 
        title="Saldo Negativo de Vacaciones" 
        description={casos.alertaVacacionesNegativas.mensaje} 
        legalText={casos.alertaVacacionesNegativas.legal} 
      />
    );
  }

  if (activeBadges.length === 0) return null;

  return (
    <div className="w-full mt-6 mb-2 flex flex-col gap-3">
      <h3 className="text-[#1A1A1A] dark:text-gray-200 font-bold mb-2 text-lg">Resumen de tu Situación Legal</h3>
      {activeBadges}
    </div>
  );
}
