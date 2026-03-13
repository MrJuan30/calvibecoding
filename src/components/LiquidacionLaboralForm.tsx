import React, { useState } from 'react';
import { useDraftCookie } from '../hooks/useDraftCookie';
import { 
  calcularDiasLaborados,
  calcularDiasPrima,
  calcularDiasCesantias,
  calcularAuxilioTransporte,
  calcularPrima,
  calcularVacaciones,
  calcularCesantias,
  calcularInteresesCesantias,
  calcularIndemnizacion,
  calcularDescuentoSalud,
  calcularDescuentoPension
} from '../lib/calculosLiquidacion';
import { evaluarCasosEspeciales, CasosEspecialesResultados } from '../lib/casosEspeciales';
import ResumenCondiciones from './ResumenCondiciones';
import { MINIMUM_WAGE_2026, TRANSPORT_ALLOWANCE_LIMIT, validateDates, validateSalary, shouldAutoApplyTransportAllowance, calculateDaysWorked, validateTakenVacation } from '../utils/validations';

interface CalculationResult {
  diasLaborados: number;
  diasMesRetiro: number;
  salarioProporcional: number;
  salarioBase: number;
  auxilioTransporte: number;
  prima: number;
  cesantias: number;
  interesesCesantias: number;
  vacaciones: number;
  indemnizacion: number;
  descuentoSalud: number;
  descuentoPension: number;
  totalLiquidacion: number;
}

export default function LiquidacionLaboralForm() {
  const { draft, updateField, isLoaded } = useDraftCookie();
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [specialCases, setSpecialCases] = useState<CasosEspecialesResultados | null>(null);

  // Derived state & validations
  const salaryNum = draft.salary ? Number(draft.salary) : 0;
  
  const salaryValidation = draft.salary ? validateSalary(salaryNum) : { isValid: true };
  const datesValidation = (draft.startDate && draft.endDate) 
    ? validateDates(draft.startDate, draft.endDate) 
    : { isValid: true };

  const daysWorked = datesValidation.isValid ? calculateDaysWorked(draft.startDate, draft.endDate) : 0;
  const vacationValidation = draft.tookVacation && draft.takenVacationDays 
    ? validateTakenVacation(draft.takenVacationDays, daysWorked) 
    : { isValid: true, maxDays: 0 };

  const isSalaryUnderLimit = shouldAutoApplyTransportAllowance(salaryNum);
  
  // Decide whether the transport allowance represents a forced true or an optional toggle
  const showTransportToggle = salaryNum > TRANSPORT_ALLOWANCE_LIMIT;
  const transportAllowanceActive = isSalaryUnderLimit ? true : draft.receivesTransportAllowance;

  const hasErrors = !salaryValidation.isValid || !datesValidation.isValid || !vacationValidation.isValid || !draft.salary || !draft.startDate || !draft.endDate || !draft.terminationType;

  if (!isLoaded) {
    return <div className="text-center p-8 animate-pulse text-gray-500">Cargando borrador...</div>;
  }

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasErrors || !draft.startDate || !draft.endDate) return;
    
    const start = new Date(draft.startDate);
    const end = new Date(draft.endDate);
    
    const diasLaborados = calcularDiasLaborados(start, end);
    const diasPrima = calcularDiasPrima(start, end);
    const diasCesantias = calcularDiasCesantias(start, end);
    const auxTransporteMensual = transportAllowanceActive ? calcularAuxilioTransporte(salaryNum) : 0;
    
    const prima = calcularPrima(salaryNum, auxTransporteMensual, diasPrima);
    const cesantias = calcularCesantias(salaryNum, auxTransporteMensual, diasCesantias);
    const interesesCesantias = calcularInteresesCesantias(cesantias, diasCesantias);
    const vacaciones = calcularVacaciones(salaryNum, diasLaborados, draft.tookVacation ? Number(draft.takenVacationDays) : 0);
    const indemnizacion = calcularIndemnizacion(salaryNum, diasLaborados, draft.terminationType);
    
    // Calcular días laborados exclusivamente en el mes de retiro para los descuentos de ley
    let diasMesRetiro = end.getDate() === 31 ? 30 : end.getDate();
    if (end.getMonth() === 1 && end.getDate() >= 28) {
      diasMesRetiro = 30; // Febrero ajuste comercial
    }
    
    if (draft.paymentFrequency === 'quincenal' && diasMesRetiro > 15) {
      diasMesRetiro -= 15;
    }
    
    // Si el contrato duró menos de un mes, ajustar los días a descontar al total trabajado
    if (diasLaborados < diasMesRetiro) {
      diasMesRetiro = diasLaborados;
    }

    const descuentoSalud = calcularDescuentoSalud(salaryNum, diasMesRetiro);
    const descuentoPension = calcularDescuentoPension(salaryNum, diasMesRetiro);
    
    // Salario proporcional del mes en retiro para sumar al total
    const salarioProporcionalEstimado = (salaryNum * diasMesRetiro) / 30;

    // Total Base
    let total = prima + cesantias + interesesCesantias + vacaciones + indemnizacion + salarioProporcionalEstimado;
    total -= (descuentoSalud + descuentoPension);

    // Evaluate special conditional logical cases
    const casos = evaluarCasosEspeciales({
      salarioBase: salaryNum,
      diasLaborados: diasLaborados,
      tipoTerminacion: draft.terminationType,
      diasDisfrutadosVacaciones: draft.tookVacation ? Number(draft.takenVacationDays) : 0,
      fechaInicioStr: draft.startDate,
      fechaFinStr: draft.endDate
    });

    // If there is negative vacations, subtract from total? Only warn based on user prompt.
    // The instructions say "Si los dias disfrutados superan los dias que le corresponden, mostrar alerta naranja... Consulta con abogado"
    // "Si el usuario marco que ya disfruto vacaciones, restar esos dias del total a pagar" -> handled computationally in calcVacaciones

    setSpecialCases(casos);
    setResults({
      diasLaborados,
      diasMesRetiro,
      salarioProporcional: salarioProporcionalEstimado,
      salarioBase: salaryNum,
      auxilioTransporte: auxTransporteMensual,
      prima,
      cesantias,
      interesesCesantias,
      vacaciones,
      indemnizacion,
      descuentoSalud,
      descuentoPension,
      totalLiquidacion: total
    });
    
    // Scroll to results slightly
    setTimeout(() => {
      document.getElementById('resultados-liquidacion')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <form onSubmit={handleCalculate} className="w-full max-w-2xl mx-auto flex flex-col gap-6 text-left">
      
      {/* 1. Salario Base Mensual */}
      <div className="flex flex-col gap-1">
        <label htmlFor="salary" className="font-semibold text-sm text-[#1A1A1A] dark:text-gray-200">
          1. Salario Base Mensual (COP) *
        </label>
        <input 
          id="salary"
          type="number"
          min={MINIMUM_WAGE_2026}
          step="1"
          required
          value={draft.salary}
          onChange={(e) => updateField('salary', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-[#D4D4D4] dark:border-gray-600 bg-white dark:bg-gray-700 text-[#1A1A1A] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-emerald-500 transition-shadow"
          placeholder="Ej: 1750905"
        />
        {!salaryValidation.isValid && salaryValidation.error && (
          <span className="text-red-500 text-sm mt-1">{salaryValidation.error}</span>
        )}
      </div>

      {/* 2 & 3. Fechas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="startDate" className="font-semibold text-sm text-[#1A1A1A] dark:text-gray-200">
            2. Fecha de inicio del contrato *
          </label>
          <input 
            id="startDate"
            type="date"
            required
            value={draft.startDate}
            onChange={(e) => updateField('startDate', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-[#D4D4D4] dark:border-gray-600 bg-white dark:bg-gray-700 text-[#1A1A1A] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-emerald-500 transition-shadow"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label htmlFor="endDate" className="font-semibold text-sm text-[#1A1A1A] dark:text-gray-200">
            3. Fecha de fin del contrato *
          </label>
          <input 
            id="endDate"
            type="date"
            required
            value={draft.endDate}
            onChange={(e) => updateField('endDate', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-[#D4D4D4] dark:border-gray-600 bg-white dark:bg-gray-700 text-[#1A1A1A] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-emerald-500 transition-shadow"
          />
        </div>
      </div>
      {!datesValidation.isValid && datesValidation.error && (
        <span className="text-red-500 text-sm">{datesValidation.error}</span>
      )}

      {/* 4. Tipo de Terminación */}
      <div className="flex flex-col gap-1">
        <label htmlFor="terminationType" className="font-semibold text-sm text-[#1A1A1A] dark:text-gray-200">
          4. Tipo de terminación del contrato *
        </label>
        <select
          id="terminationType"
          required
          value={draft.terminationType}
          onChange={(e) => updateField('terminationType', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-[#D4D4D4] dark:border-gray-600 bg-white dark:bg-gray-700 text-[#1A1A1A] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-emerald-500 transition-shadow hover:cursor-pointer"
        >
          <option value="" disabled>Selecciona una opción</option>
          <option value="voluntaria">Renuncia voluntaria</option>
          <option value="sin_justa_causa">Despido sin justa causa</option>
          <option value="con_justa_causa">Despido con justa causa</option>
          <option value="mutuo_acuerdo">Mutuo acuerdo</option>
          <option value="termino_fijo">Fin de contrato a término fijo</option>
        </select>
      </div>

      {/* 4.5. Frecuencia de Pago */}
      <div className="flex flex-col gap-1">
        <label htmlFor="paymentFrequency" className="font-semibold text-sm text-[#1A1A1A] dark:text-gray-200">
          5. Frecuencia de pago de sueldo *
        </label>
        <select
          id="paymentFrequency"
          required
          value={draft.paymentFrequency}
          onChange={(e) => updateField('paymentFrequency', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-[#D4D4D4] dark:border-gray-600 bg-white dark:bg-gray-700 text-[#1A1A1A] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-emerald-500 transition-shadow hover:cursor-pointer"
        >
          <option value="mensual">Mensual</option>
          <option value="quincenal">Quincenal</option>
        </select>
      </div>

      {/* 6. Auxilio de Transporte */}
      {draft.salary && salaryNum > 0 && salaryValidation.isValid && (
        <div className="flex flex-col gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 className="font-semibold text-sm text-[#1A1A1A] dark:text-gray-200">6. Auxilio de Transporte</h4>
          {isSalaryUnderLimit ? (
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <input type="checkbox" checked={true} readOnly className="w-4 h-4 accent-emerald-500 pointer-events-none" />
              <span>Aplica automáticamente (Salario {'<='} 2 SMMLV - {TRANSPORT_ALLOWANCE_LIMIT.toLocaleString('es-CO')} COP)</span>
            </div>
          ) : showTransportToggle ? (
            <label className="flex items-center gap-2 text-sm text-[#1A1A1A] dark:text-gray-300 cursor-pointer">
              <input 
                type="checkbox" 
                checked={draft.receivesTransportAllowance} 
                onChange={(e) => updateField('receivesTransportAllowance', e.target.checked)}
                className="w-4 h-4 accent-emerald-500 cursor-pointer" 
              />
              <span>Recibe subsidio de transporte (Opcional por salario mayor a 2 SMMLV)</span>
            </label>
          ) : null}
        </div>
      )}

      {/* 7. Vacaciones */}
      <div className="flex flex-col gap-4 p-4 border border-[#D4D4D4] dark:border-gray-700 rounded-lg">
        <label className="flex items-center gap-2 text-sm text-[#1A1A1A] dark:text-gray-200 font-semibold cursor-pointer">
          <input 
            type="checkbox" 
            checked={draft.tookVacation} 
            onChange={(e) => updateField('tookVacation', e.target.checked)}
            className="w-4 h-4 accent-emerald-500 cursor-pointer" 
          />
          7. Solicité vacaciones en este periodo
        </label>

        {draft.tookVacation && (
          <div className="flex flex-col gap-1 pl-6 animate-fade-in">
            <label htmlFor="takenVacationDays" className="font-medium text-sm text-[#1A1A1A] dark:text-gray-300">
              Días que solicitó *
            </label>
            <input 
              id="takenVacationDays"
              type="number"
              min="0.5"
              step="0.5"
              required={draft.tookVacation}
              value={draft.takenVacationDays}
              onChange={(e) => updateField('takenVacationDays', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[#D4D4D4] dark:border-gray-600 bg-white dark:bg-gray-700 text-[#1A1A1A] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-emerald-500"
              placeholder="Ej: 5"
            />
            {draft.startDate && draft.endDate && !datesValidation.error && !vacationValidation.isValid && (
              <span className="text-red-500 text-sm mt-1">{vacationValidation.error}</span>
            )}
            {draft.startDate && draft.endDate && !datesValidation.error && vacationValidation.isValid && draft.takenVacationDays && (
              <span className="text-emerald-600 dark:text-emerald-400 text-xs mt-1">Días válidos. Máximo permitido: {vacationValidation.maxDays.toFixed(2)}</span>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={hasErrors}
        className={`mt-4 w-full bg-primary hover:bg-primary-hover dark:bg-emerald-600 dark:hover:bg-emerald-500 text-surface dark:text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-md active:scale-[0.98]
          ${hasErrors ? 'opacity-50 cursor-not-allowed grayscale' : ''}
        `}
      >
        Calcular Liquidación
      </button>

      {hasErrors && draft.salary && (
        <p className="text-center text-red-500 text-sm mt-2">Por favor, corrige los errores antes de calcular.</p>
      )}

      {/* Badges Condicionales */}
      {specialCases && (
        <div className="mt-8 animate-fade-in">
          <ResumenCondiciones casos={specialCases} />
        </div>
      )}

      {/* Resultados de la Liquidación */}
      {results && specialCases && (
        <div id="resultados-liquidacion" className="mt-8 animate-fade-in border-t border-[#D4D4D4] dark:border-gray-700 pt-8 flex flex-col gap-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#1A1A1A] dark:text-emerald-400">Resultados de Liquidación 2026</h3>
            <p className="text-[#6B6B6B] dark:text-gray-400 text-sm">Resumen matemático basado en {results.diasLaborados} días laborados (Año comercial 360 días)</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Salario Base Mensual</span>
                <span className="font-semibold text-gray-900 dark:text-gray-200">
                  {results.salarioBase.toLocaleString('es-CO', {style: 'currency', currency: 'COP'})}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Auxilio de Transporte Mensual</span>
                <span className="font-semibold text-gray-900 dark:text-gray-200">
                  {results.auxilioTransporte.toLocaleString('es-CO', {style: 'currency', currency: 'COP'})}
                </span>
              </div>
            </div>

            <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-800 dark:text-gray-300">Salario Pendiente (Mes Retiro: {results.diasMesRetiro} días)</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  + {results.salarioProporcional.toLocaleString('es-CO', {style: 'currency', currency: 'COP'})}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-800 dark:text-gray-300">Prima de Servicios</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  + {results.prima.toLocaleString('es-CO', {style: 'currency', currency: 'COP'})}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-800 dark:text-gray-300">Cesantías</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  + {results.cesantias.toLocaleString('es-CO', {style: 'currency', currency: 'COP'})}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-800 dark:text-gray-300">Intereses sobre Cesantías (12%)</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  + {results.interesesCesantias.toLocaleString('es-CO', {style: 'currency', currency: 'COP'})}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-800 dark:text-gray-300">Vacaciones Pendientes</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  + {results.vacaciones.toLocaleString('es-CO', {style: 'currency', currency: 'COP'})}
                </span>
              </div>
              
              {results.indemnizacion > 0 && (
                <div className="flex justify-between items-center text-sm mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded">
                  <span className="font-semibold text-gray-800 dark:text-emerald-300">Indemnización (Despido sin Justa Causa)</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    + {results.indemnizacion.toLocaleString('es-CO', {style: 'currency', currency: 'COP'})}
                  </span>
                </div>
              )}
            </div>

            <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-800 dark:text-gray-300">Descuento Salud (4%)</span>
                <span className="font-semibold text-red-500">
                  - {results.descuentoSalud.toLocaleString('es-CO', {style: 'currency', currency: 'COP'})}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-800 dark:text-gray-300">Descuento Pensión (4%)</span>
                <span className="font-semibold text-red-500">
                  - {results.descuentoPension.toLocaleString('es-CO', {style: 'currency', currency: 'COP'})}
                </span>
              </div>
            </div>

            <div className="my-6 border-t-2 border-[#1A1A1A] dark:border-white opacity-20"></div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-xl font-bold text-[#1A1A1A] dark:text-white">Total a Recibir</span>
              <span className="text-3xl font-extrabold text-primary dark:text-emerald-400 drop-shadow-sm">
                {results.totalLiquidacion.toLocaleString('es-CO', {style: 'currency', currency: 'COP'})}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 print:hidden text-center sm:text-left">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Esta calculadora genera estimaciones informativas basadas en la ley colombiana vigente. 
              No reemplaza ni constituye asesoría legal o contable profesional.
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 italic">
              * Los valores calculados son ilustrativos y pueden variar dependiendo de convenciones colectivas, pactos arbitrales, acuerdos entre las partes y otras particularidades de la relación laboral. Todo pago oficial debe ser liquidado directamente por el empleador o su equipo contable.
            </p>
          </div>
        </div>
      )}

    </form>
  );
}
