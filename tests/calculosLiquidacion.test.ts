import { describe, it, expect } from 'vitest';
import {
  calcularDiasLaborados,
  calcularDiasPrima,
  calcularAuxilioTransporte,
  calcularPrima,
  calcularVacaciones,
  calcularCesantias,
  calcularInteresesCesantias,
  calcularIndemnizacion,
  calcularDescuentoSalud,
  calcularDescuentoPension
} from '../src/lib/calculosLiquidacion';

describe('Liquidacion Laboral - Cálculos Puros Colombia 2026', () => {

  describe('1. calcularDiasLaborados', () => {
    it('debe retornar 360 días exactos para un año comercial completo', () => {
      const inicio = new Date('2026-01-01T00:00:00');
      const fin = new Date('2026-12-30T00:00:00');
      expect(calcularDiasLaborados(inicio, fin)).toBe(360);
    });

    it('debe retornar 0 si la fecha de fin es anterior a la de inicio', () => {
      const inicio = new Date('2026-05-01T00:00:00');
      const fin = new Date('2026-04-01T00:00:00');
      expect(calcularDiasLaborados(inicio, fin)).toBe(0);
    });

    it('debe calcular correctamente meses parciales', () => {
      const inicio = new Date('2026-01-01T00:00:00');
      const fin = new Date('2026-01-15T00:00:00');
      expect(calcularDiasLaborados(inicio, fin)).toBe(15);
    });
  });

  describe('2. calcularAuxilioTransporte', () => {
    it('debe retornar subsidio completo para salario base menor a 2 SMMLV (3501810)', () => {
      expect(calcularAuxilioTransporte(1750905)).toBe(249095);
      expect(calcularAuxilioTransporte(3500000)).toBe(249095);
    });

    it('debe retornar 0 para salario mayor a 2 SMMLV (3501810)', () => {
      expect(calcularAuxilioTransporte(4000000)).toBe(0);
    });
  });

  describe('3. calcularDiasPrima y calcularPrima', () => {
    it('debe calcular prima incluyendo auxilio de transporte', () => {
      // (1750905 + 249095) * 180 / 360 = 1000000
      expect(calcularPrima(1750905, 249095, 180)).toBe(1000000);
    });

    it('debe calcular prima sin auxilio de transporte para salarios altos', () => {
      // (5000000 + 0) * 180 / 360 (un semestre) = 2500000
      expect(calcularPrima(5000000, 0, 180)).toBe(2500000);
    });

    it('calcularDiasPrima debe calcular solo el semestre en curso (Enero-Febrero)', () => {
      const inicio = new Date('2025-10-01T00:00:00');
      const fin = new Date('2026-02-28T00:00:00'); // Note: Feb 28 -> ends up being approx 58-60 days
      const dias = calcularDiasPrima(inicio, fin);
      // Enero (30 días) + Febrero (30 días comerciales) = 60 días
      expect(dias).toBe(60);
    });

    it('calcularDiasPrima debe calcular solo el semestre en curso (Julio-Agosto)', () => {
      const inicio = new Date('2026-01-01T00:00:00');
      const fin = new Date('2026-08-15T00:00:00'); 
      const dias = calcularDiasPrima(inicio, fin);
      // Julio (30 días) + Agosto 15 = 45 días
      expect(dias).toBe(45);
    });
  });

  describe('4. calcularVacaciones', () => {
    it('debe calcular vacaciones sobre 15 días hábiles al año sin subsidios', () => {
      // 1750905 * (360/2) / 360 = 875452.5
      expect(calcularVacaciones(1750905, 360, 0)).toBe(875452.5);
    });

    it('debe restar los días ya disfrutados', () => {
      // 360 días laborados = 15 días acumulados
      // Disfrutó 5 días = Quedan 10 días
      // Valor día = 1750905 / 30 = 58363.5
      // 10 * 58363.5 = 583635
      expect(calcularVacaciones(1750905, 360, 5)).toBe(583635);
    });
  });

  describe('5. calcularCesantias', () => {
    it('debe calcular cesantías incluyendo auxilio de transporte', () => {
      // (1750905 + 249095) * 360 / 360 = 2000000
      expect(calcularCesantias(1750905, 249095, 360)).toBe(2000000);
    });

    it('debe ser proporcional a los días laborados', () => {
      // (2000000 + 0) * 180 / 360 = 1000000
      expect(calcularCesantias(2000000, 0, 180)).toBe(1000000);
    });
  });

  describe('6. calcularInteresesCesantias', () => {
    it('debe calcular el 12% anual exacto (360 días)', () => {
      // 1000000 * 360 * 0.12 / 360 = 120000
      expect(calcularInteresesCesantias(1000000, 360)).toBe(120000);
    });

    it('debe calcular proporcionalmente menos si son menos de 360 días', () => {
      // 500000 * 180 * 0.12 / 360 = 30000
      expect(calcularInteresesCesantias(500000, 180)).toBe(30000);
    });
  });

  describe('7. calcularIndemnizacion', () => {
    it('debe retornar 0 para renuncias voluntarias y mutuo acuerdo', () => {
      expect(calcularIndemnizacion(1750905, 100, 'voluntaria')).toBe(0);
      expect(calcularIndemnizacion(1750905, 100, 'mutuo_acuerdo')).toBe(0);
      expect(calcularIndemnizacion(1750905, 100, 'termino_fijo')).toBe(0);
    });

    it('debe calcular 30 días para despidos sin justa causa (< 10 SMMLV) si tiempo <= 1 año', () => {
      // Salario < 10 SMMLV (17.5M)
      // salario = 3M, valorDia = 100k
      // 30 * 100k = 3M
      expect(calcularIndemnizacion(3000000, 180, 'sin_justa_causa')).toBe(3000000);
    });

    it('debe sumar 20 días por año adicional para despidos sin justa causa (< 10 SMMLV) si tiempo > 1 año', () => {
      // salario = 3M, valorDia = 100k
      // 1.5 años (540 días)
      // 30 días del primer año = 3M
      // 180 días adicionales (0.5 años) de 20 días/año = 10 días = 1M
      // Total 4M
      expect(calcularIndemnizacion(3000000, 540, 'sin_justa_causa')).toBe(4000000);
    });
  });

  describe('8 & 9. calcularDescuentoSalud y Pensión', () => {
    it('debe calcular 4% del salario base para salud (mes completo)', () => {
      expect(calcularDescuentoSalud(2000000, 30)).toBe(80000);
    });

    it('debe calcular 4% del salario base para pensión (mes completo)', () => {
      expect(calcularDescuentoPension(2000000, 30)).toBe(80000);
    });
  });

});
