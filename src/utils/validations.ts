export const MINIMUM_WAGE_2026 = 1750905;
export const TRANSPORT_ALLOWANCE_LIMIT = MINIMUM_WAGE_2026 * 2;

// Basic XSS sanitization: removes <, >, and common inject patterns
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input.replace(/[<>]/g, "").trim();
}

export function validateSalary(salary: number): { isValid: boolean; error?: string } {
  if (isNaN(salary) || salary <= 0) {
    return { isValid: false, error: "El salario debe ser un número positivo." };
  }
  if (salary < MINIMUM_WAGE_2026) {
    return { 
      isValid: false, 
      error: `El salario no puede ser menor al salario mínimo (${MINIMUM_WAGE_2026.toLocaleString("es-CO")} COP).` 
    };
  }
  return { isValid: true };
}

export function validateDates(startDateStr: string, endDateStr: string): { isValid: boolean; error?: string } {
  if (!startDateStr || !endDateStr) {
    return { isValid: false, error: "Ambas fechas son obligatorias." };
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return { isValid: false, error: "Formato de fecha inválido." };
  }

  if (endDate <= startDate) {
    return { isValid: false, error: "La fecha de fin debe ser posterior a la fecha de inicio." };
  }

  return { isValid: true };
}

export function shouldAutoApplyTransportAllowance(salary: number): boolean {
  return salary <= TRANSPORT_ALLOWANCE_LIMIT;
}

export function calculateDaysWorked(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) return 0;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return 0;

  // Real days difference + 1 (as inclusive start and end dates are common in labor calculation)
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((end.getTime() - start.getTime()) / msPerDay) + 1;
}

export function getAccruedVacationDays(daysWorked: number): number {
  return (daysWorked * 15) / 360; // 15 days per year (360 days)
}

export function validateTakenVacation(requestedDaysStr: string, daysWorked: number): { isValid: boolean; error?: string; maxDays: number } {
  const maxDays = getAccruedVacationDays(daysWorked);
  const requestedDays = Number(requestedDaysStr) || 0;

  if (requestedDays > maxDays) {
    return { 
      isValid: false, 
      error: `Error: Has solicitado ${requestedDays} días, pero legalmente solo tienes ${maxDays.toFixed(2)} días acumulados por el tiempo laborado. Más de esto se considera un beneficio extralegal.`,
      maxDays
    };
  }

  return { isValid: true, maxDays };
}
