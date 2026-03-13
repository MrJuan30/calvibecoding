import { useState, useEffect, useRef } from 'react';
import { sanitizeInput, validateDates, validateSalary } from '../utils/validations';

export interface DraftData {
  salary: string;
  startDate: string;
  endDate: string;
  terminationType: string;
  receivesTransportAllowance: boolean;
  pendingVacationDays: string;
  tookVacation: boolean;
  takenVacationDays: string;
  paymentFrequency: string;
}

const COOKIE_NAME = 'calculacol_liq_draft';
const DEFAULT_DRAFT: DraftData = {
  salary: '',
  startDate: '',
  endDate: '',
  terminationType: '',
  receivesTransportAllowance: false,
  pendingVacationDays: '0',
  tookVacation: false,
  takenVacationDays: '',
  paymentFrequency: 'mensual',
};

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === 'undefined') return;
  const isSecure = window.location.protocol === 'https:';
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; samesite=strict${isSecure ? '; secure' : ''}`;
}

export function useDraftCookie() {
  const [draft, setDraft] = useState<DraftData>(DEFAULT_DRAFT);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load cookie on mount
    const savedCookie = getCookie(COOKIE_NAME);
    if (savedCookie) {
      try {
        const decoded = decodeURIComponent(savedCookie);
        const parsed: Partial<DraftData> = JSON.parse(decoded);
        
        // Strict Validation before applying
        const safeData = { ...DEFAULT_DRAFT };
        let isValid = true;
        
        if (parsed.salary) {
          const sanitizedSalary = sanitizeInput(parsed.salary);
          const numSalary = Number(sanitizedSalary);
          if (isNaN(numSalary) || numSalary < 1750905) {
             isValid = false;
          } else {
             safeData.salary = sanitizedSalary;
          }
        }
        
        if (parsed.startDate) safeData.startDate = sanitizeInput(parsed.startDate);
        if (parsed.endDate) safeData.endDate = sanitizeInput(parsed.endDate);
        if (safeData.startDate && safeData.endDate) {
          const dateCheck = validateDates(safeData.startDate, safeData.endDate);
          if (!dateCheck.isValid) isValid = false;
        }

        if (parsed.terminationType) safeData.terminationType = sanitizeInput(parsed.terminationType);
        if (parsed.paymentFrequency) safeData.paymentFrequency = sanitizeInput(parsed.paymentFrequency);
        if (typeof parsed.receivesTransportAllowance === 'boolean') {
          safeData.receivesTransportAllowance = parsed.receivesTransportAllowance;
        }
        
        if (parsed.pendingVacationDays) {
           const val = sanitizeInput(parsed.pendingVacationDays);
           if (!isNaN(Number(val))) safeData.pendingVacationDays = val;
        }
        
        if (typeof parsed.tookVacation === 'boolean') {
           safeData.tookVacation = parsed.tookVacation;
        }
        
        if (parsed.takenVacationDays) {
           const val = sanitizeInput(parsed.takenVacationDays);
           if (!isNaN(Number(val))) safeData.takenVacationDays = val;
        }

        if (isValid) {
          setDraft(safeData);
        } else {
          // If strict validation fails anywhere, discard the whole cookie
          setCookie(COOKIE_NAME, '', 0); // clear cookie
        }
      } catch (e) {
        // Parse error, discard
        setCookie(COOKIE_NAME, '', 0);
      }
    }
    setIsLoaded(true);
  }, []);

  // Debounced save when draft changes
  useEffect(() => {
    if (!isLoaded) return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      const encoded = encodeURIComponent(JSON.stringify(draft));
      setCookie(COOKIE_NAME, encoded, 3600); // 1 hour
    }, 800);
    
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [draft, isLoaded]);

  const updateField = <K extends keyof DraftData>(field: K, value: DraftData[K]) => {
    // Basic sanitization at the input level
    let safeValue = value;
    if (typeof value === 'string') {
      safeValue = sanitizeInput(value) as DraftData[K];
    }
    setDraft(prev => ({ ...prev, [field]: safeValue }));
  };

  return { draft, updateField, isLoaded };
}
