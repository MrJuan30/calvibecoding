import { COLOMBIA_2026 } from '../constants/colombia2026';
import { getAccruedVacationDays, calculateDaysWorked } from '../utils/validations';

export interface CasosEspecialesInputs {
  salarioBase: number;
  diasLaborados: number;
  tipoTerminacion: string;
  diasDisfrutadosVacaciones: number;
  fechaInicioStr: string;
  fechaFinStr: string;
}

export interface SemestrePrima {
  semestre: string;
  dias: number;
}

export interface CasosEspecialesResultados {
  aplicaTransporte: { aplica: boolean; mensaje: string; legal: string };
  indemnizacionInfo: { aplica: boolean; mensaje: string; legal: string } | null;
  alertaVacacionesNegativas: { aplica: boolean; mensaje: string; legal: string } | null;
  desglosePrima: { aplica: boolean; semestres: SemestrePrima[]; legal: string };
  alertaRetefuente: { aplica: boolean; mensaje: string; legal: string } | null;
  notaTerminoFijo: { aplica: boolean; mensaje: string; legal: string } | null;
}

/**
 * Evalúa los casos especiales laborales colombianos según los inputs del usuario.
 */
export function evaluarCasosEspeciales(inputs: CasosEspecialesInputs): CasosEspecialesResultados {
  const { 
    salarioBase, 
    diasLaborados, 
    tipoTerminacion, 
    diasDisfrutadosVacaciones,
    fechaInicioStr,
    fechaFinStr
  } = inputs;

  const results: CasosEspecialesResultados = {
    aplicaTransporte: { aplica: false, mensaje: '', legal: '' },
    indemnizacionInfo: null,
    alertaVacacionesNegativas: null,
    desglosePrima: { aplica: true, semestres: [], legal: 'Art. 306 CST: La prima de servicios corresponde a 30 días de salario por año, pagaderos semestralmente (o proporcional).' },
    alertaRetefuente: null,
    notaTerminoFijo: null
  };

  // 1. Auxilio de Transporte
  const limiteTransporte = COLOMBIA_2026.SMMLV * COLOMBIA_2026.LIMITE_AUXILIO_TRANSPORTE_SMMLV;
  if (salarioBase <= limiteTransporte) {
    results.aplicaTransporte = {
      aplica: true,
      mensaje: `Recibe Auxilio de Transporte. Como tu salario es menor o igual a 2 SMMLV (${limiteTransporte.toLocaleString('es-CO')} COP), se te suma el subsidio para calcular primas y cesantías.`,
      legal: 'Ley 15 de 1959: Obligatorio para devengos hasta 2 SMMLV. No constituye salario para vacaciones.'
    };
  } else {
    results.aplicaTransporte = {
      aplica: false,
      mensaje: `No aplica Auxilio de Transporte automático por superar 2 SMMLV.`,
      legal: 'Ley 15 de 1959: Excede el tope de 2 salarios mínimos.'
    };
  }

  // 2. Indemnización por despido sin justa causa
  if (tipoTerminacion === 'sin_justa_causa') {
    const ganaMenos10 = salarioBase < (COLOMBIA_2026.SMMLV * 10);
    const mensaje = ganaMenos10 
      ? `Indemnización activa (< 10 SMMLV): 30 días por el primer año + 20 días por año adicional aplicarán sobre tu tiempo.`
      : `Indemnización activa (>= 10 SMMLV): 20 días por el primer año + 15 días por año adicional aplicarán sobre tu tiempo.`;
    
    results.indemnizacionInfo = {
      aplica: true,
      mensaje,
      legal: 'Art. 64 CST: Terminar un contrato sin justa causa obliga al empleador a indemnizar según tablas de tiempo y salario.'
    };
  }

  // 3. Vacaciones con Saldo Negativo
  const vacacionesAcumuladas = getAccruedVacationDays(diasLaborados);
  if (diasDisfrutadosVacaciones > vacacionesAcumuladas) {
    results.alertaVacacionesNegativas = {
      aplica: true,
      mensaje: `Alerta: Has disfrutado más días de vacaciones (${diasDisfrutadosVacaciones}) que los generados legalmente (${vacacionesAcumuladas.toFixed(2)}). El saldo de vacaciones es negativo. Si te descuentan este valor de la liquidación, verifica si el anticipo fue autorizado legalmente, ya que la ley protege el salario. Consulta con un abogado.`,
      legal: 'Jurisprudencia Corte Suprema de Justicia: Las vacaciones anticipadas no se pueden descontar de la liquidación sin autorización expresa y clara.'
    };
  }

  // 4. Prima de Servicios Proporcional (Semestral)
  if (fechaInicioStr && fechaFinStr) {
    const inicio = new Date(fechaInicioStr);
    const fin = new Date(fechaFinStr);
    
    if (!isNaN(inicio.getTime()) && !isNaN(fin.getTime()) && fin > inicio) {
      if (inicio.getFullYear() === fin.getFullYear()) {
         const midYear = new Date(inicio.getFullYear(), 5, 30); // 30 June
         
         if (fin <= midYear) {
            results.desglosePrima.semestres.push({ semestre: 'Primer Semestre (Ene-Jun)', dias: diasLaborados });
         } else if (inicio > midYear) {
            results.desglosePrima.semestres.push({ semestre: 'Segundo Semestre (Jul-Dic)', dias: diasLaborados });
         } else {
            // crosses mid year
            const diasSemestre1 = calculateDaysWorked(fechaInicioStr, `${inicio.getFullYear()}-06-30`);
            const diasSemestre2 = calculateDaysWorked(`${inicio.getFullYear()}-07-01`, fechaFinStr);
            results.desglosePrima.semestres.push({ semestre: 'Primer Semestre (Ene-Jun)', dias: diasSemestre1 });
            results.desglosePrima.semestres.push({ semestre: 'Segundo Semestre (Jul-Dic)', dias: diasSemestre2 });
         }
      } else {
         // Different years - simplification for message
         results.desglosePrima.semestres.push({ semestre: 'Periodos de múltiples años', dias: diasLaborados });
      }
    }
  }

  // 5. Alerta Retención en la Fuente
  const topeRetefuente = COLOMBIA_2026.LIMITE_RETEFUENTE_UVT * COLOMBIA_2026.UVT;
  if (salarioBase > topeRetefuente) {
    results.alertaRetefuente = {
      aplica: true,
      mensaje: `Tu salario base (${salarioBase.toLocaleString('es-CO')} COP) supera el tope base de retención mensual estimativo (95 UVTs = ${topeRetefuente.toLocaleString('es-CO')} COP). Esta liquidación podría estar sujeta a descuentos por Retención en la Fuente. El monto exácto depende de tus alivios tributarios personales. Consulta con tu contador.`,
      legal: 'Estatuto Tributario Vigente: Las indemnizaciones, primas y salarios altos están gravados según las tablas de retención mensual o métodos de cálculo vigentes.'
    };
  }

  // 6. Alerta Contrato Fijo
  if (tipoTerminacion === 'termino_fijo') {
    results.notaTerminoFijo = {
      aplica: true,
      mensaje: `Fin de contrato a Término Fijo: Tienes derecho a la liquidación proporcional de prima, cesantías y vacaciones. No hay lugar a indemnización por finalización acordada del periodo.`,
      legal: 'Art. 46 CST: El contrato a término fijo expira a su vencimiento pactado sin crear obligación indemnizatoria, previo preaviso de ley.'
    };
  }

  return results;
}
