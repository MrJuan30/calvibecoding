import { COLOMBIA_2026 } from "../constants/colombia2026";

/**
 * Función auxiliar para redondear a 2 decimales y evitar problemas de punto flotante en JS.
 */
function redondear(valor: number): number {
  return Math.round(valor * 100) / 100;
}

/**
 * 1. Calcular Días Laborados (Año Comercial Colombiano: 360 días)
 * Base Legal: La jurisprudencia y doctrina en Colombia establece el mes de 30 días y el año de 360 días
 * para efectos de liquidación de prestaciones sociales.
 * 
 * @param fechaInicio Fecha de inicio del contrato
 * @param fechaFin Fecha de fin del contrato
 * @returns Número de días laborados usando meses de 30 días
 */
export function calcularDiasLaborados(fechaInicio: Date, fechaFin: Date): number {
  // Ajuste a mes de 30 días (año de 360)
  const d1 = fechaInicio.getDate();
  const m1 = fechaInicio.getMonth() + 1;
  const y1 = fechaInicio.getFullYear();

  let d2 = fechaFin.getDate();
  const m2 = fechaFin.getMonth() + 1;
  const y2 = fechaFin.getFullYear();

  // En Colombia comercialmente todo mes tiene 30 días
  const day1 = d1 === 31 ? 30 : d1;
  const day2 = d2 === 31 ? 30 : (d2 === 28 && m2 === 2) ? 30 : d2; // Ajuste simplificado
  
  // Fórmula: ((Y2 - Y1) * 360) + ((M2 - M1) * 30) + (D2 - D1) + 1 (día incluyente)
  const dias = ((y2 - y1) * COLOMBIA_2026.DIAS_ANO_COMERCIAL) + 
               ((m2 - m1) * COLOMBIA_2026.DIAS_MES_COMERCIAL) + 
               (day2 - day1) + 1;
  
  return dias > 0 ? dias : 0;
}

/**
 * 2. Calcular Auxilio de Transporte
 * Base Legal: Ley 15 de 1959. Aplica para trabajadores que devengan hasta 2 SMMLV.
 * 
 * @param salarioBase Salario mensual del trabajador
 * @returns Auxilio de transporte legal o 0 si excede el límite
 */
export function calcularAuxilioTransporte(salarioBase: number): number {
  const limite = COLOMBIA_2026.SMMLV * COLOMBIA_2026.LIMITE_AUXILIO_TRANSPORTE_SMMLV;
  if (salarioBase <= limite) {
    return COLOMBIA_2026.AUXILIO_TRANSPORTE;
  }
  return 0;
}

/**
 * 3. Calcular Prima de Servicios
 * Base Legal: Artículo 306 del Código Sustantivo del Trabajo (CST).
 * Fórmula: (Salario Base + Auxilio de Transporte) * Días Prima / 360
 * 
 * @param salarioBase Salario base mensual
 * @param auxilioTransporte Valor del auxilio de transporte mensual que recibe
 * @param diasPrima Días laborados en el semestre actual a liquidar
 * @returns Valor a pagar por prima de servicios
 */
export function calcularPrima(salarioBase: number, auxilioTransporte: number, diasPrima: number): number {
  const baseLiquidacion = salarioBase + auxilioTransporte;
  const prima = (baseLiquidacion * diasPrima) / COLOMBIA_2026.DIAS_ANO_COMERCIAL;
  return redondear(prima);
}

/**
 * Calcula los días reales a liquidar para la Prima (Semestre Actual)
 * La prima se paga a finales de junio y a finales de diciembre.
 * Si alguien es liquidado, solo se le debe la fracción del semestre en curso.
 */
export function calcularDiasPrima(fechaInicio: Date, fechaFin: Date): number {
  // Determinar el inicio del semestre actual según la fecha de fin
  const y = fechaFin.getFullYear();
  const m = fechaFin.getMonth(); // 0-based
  
  // Semestre 1: Ene 1 a Jun 30
  // Semestre 2: Jul 1 a Dic 30 (legalmente)
  let inicioSemestre = new Date(y, 0, 1); // Ene 1
  if (m >= 6) {
    inicioSemestre = new Date(y, 6, 1); // Jul 1
  }

  // La fecha de inicio real para la prima es el máximo entre la fecha de inicio del contrato y el inicio del semestre
  const inicioParaPrima = fechaInicio > inicioSemestre ? fechaInicio : inicioSemestre;
  
  if (fechaFin < inicioParaPrima) return 0;

  return calcularDiasLaborados(inicioParaPrima, fechaFin);
}

/**
 * 4. Calcular Vacaciones Puras
 * Base Legal: Artículo 186 y 192 del CST. 
 * Base Vacaciones (BV): Solo Salario Base.
 * Fórmula: (BV * Días_Totales_Contrato) / 720.
 * 
 * @param salarioBase Salario base mensual
 * @param diasTotales Días totales laborados en el contrato
 * @param diasDisfrutados Días hábiles de vacaciones que el empleado ya tomó
 * @returns Valor a compensar en dinero por vacaciones no disfrutadas
 */
export function calcularVacaciones(salarioBase: number, diasTotales: number, diasDisfrutados: number = 0): number {
  // Base Vacaciones (BV)
  const bv = salarioBase;
  const dineroTotalAcumulado = (bv * diasTotales) / 720;
  
  // Se restan económicamente los días que ya fueron disfrutados (1 día disfrute = 1 día salario base)
  const valorDia = bv / COLOMBIA_2026.DIAS_MES_COMERCIAL;
  const dineroDisfrutado = diasDisfrutados * valorDia;

  const vacacionesRestantes = Math.max(0, dineroTotalAcumulado - dineroDisfrutado);
  return redondear(vacacionesRestantes);
}

/**
 * Calcula los días reales a liquidar para Cesantías e Intereses (Año Actual)
 * Regla: Se reinicia a 0 el 1 de enero del año actual asumiendo pago/consignación del año anterior.
 */
export function calcularDiasCesantias(fechaInicio: Date, fechaFin: Date): number {
  const y = fechaFin.getFullYear();
  const inicioAno = new Date(y, 0, 1); // 1 de enero del año de finalización
  
  const inicioReal = fechaInicio > inicioAno ? fechaInicio : inicioAno;
  
  if (fechaFin < inicioReal) return 0;
  return calcularDiasLaborados(inicioReal, fechaFin);
}

/**
 * 5. Calcular Cesantías
 * Base Legal: Artículo 249 del CST.
 * Fórmula: (BP * Días_Año_Actual) / 360
 * 
 * @param salarioBase Salario base mensual
 * @param auxilioTransporte Auxilio de transporte mensual
 * @param diasAnoActual Días laborados en el año actual de liquidación
 * @returns Valor a pagar por concepto de cesantías
 */
export function calcularCesantias(salarioBase: number, auxilioTransporte: number, diasAnoActual: number): number {
  const bp = salarioBase + auxilioTransporte; // Base Prestacional
  const cesantias = (bp * diasAnoActual) / COLOMBIA_2026.DIAS_ANO_COMERCIAL;
  return redondear(cesantias);
}

/**
 * 6. Calcular Intereses sobre Cesantías
 * Base Legal: Ley 52 de 1975 (Art. 1). Equivale al 12% anual.
 * Fórmula: (Valor_Cesantías_Calculado * Días_Año_Actual * 0.12) / 360
 * 
 * @param cesantias Valor de cesantías previamente calculado
 * @param diasAnoActual Días laborados en el año actual
 * @returns Valor a pagar por intereses de cesantías
 */
export function calcularInteresesCesantias(cesantias: number, diasAnoActual: number): number {
  const intereses = (cesantias * diasAnoActual * COLOMBIA_2026.TASA_INTERESES_CESANTIAS) / COLOMBIA_2026.DIAS_ANO_COMERCIAL;
  return redondear(intereses);
}

/**
 * 7. Calcular Indemnización
 * Base Legal: Artículo 64 del CST.
 * 
 * @param salarioBase Salario mensual
 * @param diasLaborados Tiempo total de vinculación en días
 * @param tipoTerminacion Tipo de despido o renuncia
 * @param smmlv Valor del salario mínimo actual
 * @returns Valor de la indemnización (0 si no aplica)
 */
export function calcularIndemnizacion(
  salarioBase: number, 
  diasLaborados: number, 
  tipoTerminacion: string, 
  smmlv: number = COLOMBIA_2026.SMMLV
): number {
  if (['voluntaria', 'mutuo_acuerdo', 'termino_fijo', 'con_justa_causa'].includes(tipoTerminacion)) {
    return 0;
  }

  if (tipoTerminacion === 'sin_justa_causa') {
    const valorDia = salarioBase / COLOMBIA_2026.DIAS_MES_COMERCIAL;
    const ganaMenos10SMMLV = salarioBase < (smmlv * 10);

    if (ganaMenos10SMMLV) {
      if (diasLaborados <= COLOMBIA_2026.DIAS_ANO_COMERCIAL) {
        // Menos de un año o igual: 30 días
        return redondear(30 * valorDia);
      } else {
        // Primer año: 30 días
        const indemnizacionPrimerAno = 30 * valorDia;
        // Años siguientes: 20 días por año proporcional
        const diasRestantes = diasLaborados - COLOMBIA_2026.DIAS_ANO_COMERCIAL;
        const proporcionAdicional = (20 * valorDia * diasRestantes) / COLOMBIA_2026.DIAS_ANO_COMERCIAL;
        return redondear(indemnizacionPrimerAno + proporcionAdicional);
      }
    } else {
      // Regla para quienes ganan igual o más de 10 SMMLV
      if (diasLaborados <= COLOMBIA_2026.DIAS_ANO_COMERCIAL) {
        return redondear(20 * valorDia);
      } else {
        const indemnizacionPrimerAno = 20 * valorDia;
        const diasRestantes = diasLaborados - COLOMBIA_2026.DIAS_ANO_COMERCIAL;
        const proporcionAdicional = (15 * valorDia * diasRestantes) / COLOMBIA_2026.DIAS_ANO_COMERCIAL;
        return redondear(indemnizacionPrimerAno + proporcionAdicional);
      }
    }
  }

  return 0;
}

/**
 * 8. Calcular Descuento Pensión
 * Base Legal: Ley 100 de 1993. Aporte del 4% a cargo del trabajador.
 * Aplica SÓLO sobre el Sueldo Devengado (proporcional a los días efectivamente trabajados en el mes de retiro).
 * 
 * @param salarioBase Salario mensual
 * @param diasMesRetiro Días trabajados en el último mes
 * @returns Descuento por concepto de pensión
 */
export function calcularDescuentoPension(salarioBase: number, diasMesRetiro: number): number {
  const salarioProporcional = (salarioBase * diasMesRetiro) / COLOMBIA_2026.DIAS_MES_COMERCIAL;
  return redondear(salarioProporcional * COLOMBIA_2026.PORCENTAJE_PENSION);
}

/**
 * 9. Calcular Descuento Salud
 * Base Legal: Ley 100 de 1993. Aporte del 4% a cargo del trabajador.
 * Aplica SÓLO sobre el Sueldo Devengado (proporcional a los días efectivamente trabajados en el mes de retiro).
 * 
 * @param salarioBase Salario mensual
 * @param diasMesRetiro Días trabajados en el último mes
 * @returns Descuento por concepto de salud
 */
export function calcularDescuentoSalud(salarioBase: number, diasMesRetiro: number): number {
  const salarioProporcional = (salarioBase * diasMesRetiro) / COLOMBIA_2026.DIAS_MES_COMERCIAL;
  return redondear(salarioProporcional * COLOMBIA_2026.PORCENTAJE_SALUD);
}
