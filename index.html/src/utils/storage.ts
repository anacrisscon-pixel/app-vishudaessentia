import { ExplorationData, DailyCheckInRecord } from '../types';

// Safe localStorage wrapper with memory fallback for iframe sandboxes
const memoryStorage: Record<string, string> = {};

function getStorageBackend(): Storage | {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
} {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const testKey = '__vishuda_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    }
  } catch (e) {
    // Fallback to memoryStorage
  }
  return {
    getItem: (k: string) => (Object.prototype.hasOwnProperty.call(memoryStorage, k) ? memoryStorage[k] : null),
    setItem: (k: string, v: string) => {
      memoryStorage[k] = String(v);
    },
    removeItem: (k: string) => {
      delete memoryStorage[k];
    },
    clear: () => {
      Object.keys(memoryStorage).forEach((k) => delete memoryStorage[k]);
    },
  };
}

const safeStorage = getStorageBackend();

const STORAGE_KEYS = {
  EXPLORATIONS: 'vishuda_explorations_v2',
  LEGACY: 'vishuda_nivel7',
  TODAY_MOOD: 'vishuda_mood_today',
  TODAY_MOOD_DATE: 'vishuda_mood_date',
  ORACLE_DATE: 'vishuda_oracle_date',
  PREMIUM: 'vishuda_premium',
  ANCHORS_PREFIX: 'vishuda_anchors_',
  GUILT: 'vishuda_guilt',
  BELONGING: 'vishuda_belonging',
  PRACTICE_CHOICE: 'vishuda_practice_choice',
  PRACTICE_SCALE: 'vishuda_practice_scale',
  PRACTICE_COMPLETE: 'vishuda_practice_complete',
  PRACTICE_VIZ: 'vishuda_practice_viz',
  CASES_USED: 'vishuda_cases_used',
  AI_USED: 'vishuda_ai_used',
  CHECKIN_DATA: 'vishuda_checkin_data',
  CHECKIN_HISTORY: 'vishuda_checkin_history',
  CHECKIN_STREAK: 'vishuda_checkin_streak',
  CHECKIN_LAST_DATE: 'vishuda_checkin_last_date',
  DEVICE_ID: 'vishuda_device_id',
  PREMIUM_DATA: 'vishuda_premium_data',
};

export const VALID_PREMIUM_CODES = ['VISHUDA2026', 'ESSENTIA2026', 'ALMA2026', 'CONTINUO2026', 'SER2026'];

export interface MembershipData {
  isActive: boolean;
  isExpired: boolean;
  code?: string;
  activatedAt?: string;
  expiresAt?: string;
  daysRemaining: number;
  hoursRemaining: number;
  deviceId: string;
}

export function getDeviceId(): string {
  let id = safeStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    safeStorage.setItem(STORAGE_KEYS.DEVICE_ID, id);
  }
  return id;
}

export function getExplorations(): ExplorationData[] {
  try {
    const raw = safeStorage.getItem(STORAGE_KEYS.EXPLORATIONS) || safeStorage.getItem(STORAGE_KEYS.LEGACY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error loading explorations:', e);
    return [];
  }
}

export function saveExploration(item: ExplorationData): ExplorationData[] {
  const all = getExplorations();
  const updated = [item, ...all];
  safeStorage.setItem(STORAGE_KEYS.EXPLORATIONS, JSON.stringify(updated));
  return updated;
}

export function deleteExploration(id: string): ExplorationData[] {
  const all = getExplorations();
  const updated = all.filter((x) => x.id !== id);
  safeStorage.setItem(STORAGE_KEYS.EXPLORATIONS, JSON.stringify(updated));
  return updated;
}

export function clearAllExplorations(): void {
  safeStorage.setItem(STORAGE_KEYS.EXPLORATIONS, JSON.stringify([]));
  safeStorage.removeItem(STORAGE_KEYS.LEGACY);
}

export function getTodayMood(): string | null {
  const savedDate = safeStorage.getItem(STORAGE_KEYS.TODAY_MOOD_DATE);
  const today = new Date().toDateString();
  if (savedDate === today) {
    return safeStorage.getItem(STORAGE_KEYS.TODAY_MOOD);
  }
  return null;
}

export function setTodayMood(moodId: string): void {
  safeStorage.setItem(STORAGE_KEYS.TODAY_MOOD, moodId);
  safeStorage.setItem(STORAGE_KEYS.TODAY_MOOD_DATE, new Date().toDateString());
}

export interface CheckInStatus {
  hasCheckedInToday: boolean;
  moodId: string | null;
  microActionDone: boolean;
  streak: number;
}

export function getCheckInStatus(): CheckInStatus {
  const today = new Date().toDateString();
  const savedDate = safeStorage.getItem(STORAGE_KEYS.CHECKIN_LAST_DATE);
  const streak = Number(safeStorage.getItem(STORAGE_KEYS.CHECKIN_STREAK) || 0);

  if (savedDate === today) {
    let data: { moodId?: string; microActionDone?: boolean } = {};
    try {
      const raw = safeStorage.getItem(STORAGE_KEYS.CHECKIN_DATA);
      if (raw) data = JSON.parse(raw);
    } catch (e) {}

    return {
      hasCheckedInToday: true,
      moodId: data.moodId || safeStorage.getItem(STORAGE_KEYS.TODAY_MOOD) || null,
      microActionDone: Boolean(data.microActionDone),
      streak: streak > 0 ? streak : 1,
    };
  }

  // Check if streak was yesterday or broken
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const isStreakAlive = savedDate === yesterday;
  const currentStreak = isStreakAlive ? streak : 0;

  return {
    hasCheckedInToday: false,
    moodId: null,
    microActionDone: false,
    streak: currentStreak,
  };
}

export function getMoodDefaultScore(moodId: string): number {
  switch (moodId) {
    case 'energia':
      return 9;
    case 'calma':
      return 8;
    case 'reflexivo':
      return 7;
    case 'cansancio':
      return 4;
    case 'sobrecarga':
      return 3;
    default:
      return 7;
  }
}

export function generateInitialCheckInHistory(): DailyCheckInRecord[] {
  const sampleConfigs = [
    { moodId: 'sobrecarga', energy: 3, micro: false, note: 'Tensión en la espalda por cierre laboral exigente' },
    { moodId: 'sobrecarga', energy: 4, micro: true, note: 'Hice reseteo de 30s; me ayudó a no reaccionar con enojo' },
    { moodId: 'cansancio', energy: 4, micro: true, note: 'Cuerpo agotado; me permití irme a dormir temprano' },
    { moodId: 'reflexivo', energy: 6, micro: true, note: 'Paseo en silencio; reconociendo la necesidad de límites' },
    { moodId: 'calma', energy: 8, micro: true, note: 'Sensación de espacio interno despejado y sereno' },
    { moodId: 'energia', energy: 9, micro: true, note: 'Enfoque claro y entusiasmo constructivo en la mañana' },
    { moodId: 'calma', energy: 8, micro: true, note: 'Respiración consciente en la pausa del almuerzo' },
    { moodId: 'reflexivo', energy: 7, micro: false, note: 'Pensando en cómo cuidar mi energía en conversaciones difíciles' },
    { moodId: 'cansancio', energy: 5, micro: true, note: 'Soltando tensión de hombros durante el reseteo' },
    { moodId: 'calma', energy: 8, micro: true, note: 'Mente centrada con sonido de cuencos tibetanos' },
    { moodId: 'energia', energy: 8, micro: true, note: 'Impulso vital guiado con amabilidad y serenidad' },
    { moodId: 'calma', energy: 8, micro: true, note: 'Habitando el cuerpo con firmeza y sin prisas' },
    { moodId: 'reflexivo', energy: 7, micro: true, note: 'Revisando mi semana con compasión hacia mi ritmo' },
    { moodId: 'calma', energy: 8, micro: true, note: 'Presencia plena y anclaje en el aquí y ahora' },
  ];

  const now = new Date();
  const records: DailyCheckInRecord[] = [];

  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateIso = d.toISOString().slice(0, 10);
    const cfg = sampleConfigs[13 - i] || sampleConfigs[0];
    records.push({
      id: `chk_${d.getTime()}`,
      date: dateIso,
      moodId: cfg.moodId,
      microActionDone: cfg.micro,
      energyLevel: cfg.energy,
      note: cfg.note,
      timestamp: d.getTime(),
    });
  }

  return records;
}

export function getCheckInHistory(): DailyCheckInRecord[] {
  try {
    const raw = safeStorage.getItem(STORAGE_KEYS.CHECKIN_HISTORY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }
    }
  } catch (e) {
    console.error('Error loading checkin history:', e);
  }

  // Seed default history so user immediately has insights
  const initial = generateInitialCheckInHistory();
  safeStorage.setItem(STORAGE_KEYS.CHECKIN_HISTORY, JSON.stringify(initial));
  return initial;
}

export function saveCheckInHistory(records: DailyCheckInRecord[]): void {
  const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  safeStorage.setItem(STORAGE_KEYS.CHECKIN_HISTORY, JSON.stringify(sorted));
}

export function syncTodayInHistory(moodId: string, microActionDone: boolean, note?: string, energyLevel?: number): void {
  const history = getCheckInHistory();
  const todayIso = new Date().toISOString().slice(0, 10);
  const existingIdx = history.findIndex((h) => h.date === todayIso);
  const score = energyLevel ?? getMoodDefaultScore(moodId);

  const updatedEntry: DailyCheckInRecord = {
    id: existingIdx >= 0 ? history[existingIdx].id : `chk_${Date.now()}`,
    date: todayIso,
    moodId,
    microActionDone,
    energyLevel: score,
    note: note !== undefined ? note : (existingIdx >= 0 ? history[existingIdx].note : ''),
    timestamp: Date.now(),
  };

  if (existingIdx >= 0) {
    history[existingIdx] = updatedEntry;
  } else {
    history.push(updatedEntry);
  }

  saveCheckInHistory(history);
}

export function addOrUpdateCheckInRecord(entry: Partial<DailyCheckInRecord> & { date: string; moodId: string }): DailyCheckInRecord[] {
  const history = getCheckInHistory();
  const existingIdx = history.findIndex((h) => h.date === entry.date);
  const score = entry.energyLevel ?? getMoodDefaultScore(entry.moodId);

  const fullRecord: DailyCheckInRecord = {
    id: entry.id || (existingIdx >= 0 ? history[existingIdx].id : `chk_${Date.now()}`),
    date: entry.date,
    moodId: entry.moodId,
    microActionDone: entry.microActionDone ?? false,
    energyLevel: score,
    note: entry.note || '',
    phrase: entry.phrase || '',
    timestamp: entry.timestamp || new Date(entry.date).getTime() || Date.now(),
  };

  if (existingIdx >= 0) {
    history[existingIdx] = fullRecord;
  } else {
    history.push(fullRecord);
  }

  saveCheckInHistory(history);

  const todayIso = new Date().toISOString().slice(0, 10);
  if (entry.date === todayIso) {
    const today = new Date().toDateString();
    const payload = {
      moodId: entry.moodId,
      microActionDone: entry.microActionDone ?? false,
      timestamp: Date.now(),
    };
    safeStorage.setItem(STORAGE_KEYS.CHECKIN_DATA, JSON.stringify(payload));
    setTodayMood(entry.moodId);
  }

  return getCheckInHistory();
}

export function deleteCheckInRecord(idOrDate: string): DailyCheckInRecord[] {
  const history = getCheckInHistory();
  const filtered = history.filter((h) => h.id !== idOrDate && h.date !== idOrDate);
  saveCheckInHistory(filtered);
  return filtered;
}

export function resetCheckInHistory(): DailyCheckInRecord[] {
  const fresh = generateInitialCheckInHistory();
  saveCheckInHistory(fresh);
  return fresh;
}

export function recordCheckIn(
  moodId: string,
  microActionDone: boolean = false,
  note?: string,
  energyLevel?: number
): CheckInStatus {
  const today = new Date().toDateString();
  const current = getCheckInStatus();
  
  let newStreak = current.streak;
  if (!current.hasCheckedInToday) {
    newStreak = current.streak + 1;
    safeStorage.setItem(STORAGE_KEYS.CHECKIN_STREAK, String(newStreak));
    safeStorage.setItem(STORAGE_KEYS.CHECKIN_LAST_DATE, today);
  }

  const payload = {
    moodId,
    microActionDone: microActionDone || current.microActionDone,
    timestamp: Date.now(),
  };

  safeStorage.setItem(STORAGE_KEYS.CHECKIN_DATA, JSON.stringify(payload));
  setTodayMood(moodId);

  // Sync to permanent history
  syncTodayInHistory(moodId, payload.microActionDone, note, energyLevel);

  return {
    hasCheckedInToday: true,
    moodId,
    microActionDone: payload.microActionDone,
    streak: newStreak,
  };
}

export function completeCheckInMicroAction(): CheckInStatus {
  const current = getCheckInStatus();
  const today = new Date().toDateString();
  
  let newStreak = current.streak;
  if (!current.hasCheckedInToday) {
    newStreak = current.streak + 1;
    safeStorage.setItem(STORAGE_KEYS.CHECKIN_STREAK, String(newStreak));
    safeStorage.setItem(STORAGE_KEYS.CHECKIN_LAST_DATE, today);
  }

  const moodId = current.moodId || 'calma';
  const payload = {
    moodId,
    microActionDone: true,
    timestamp: Date.now(),
  };

  safeStorage.setItem(STORAGE_KEYS.CHECKIN_DATA, JSON.stringify(payload));

  // Sync to history
  syncTodayInHistory(moodId, true);

  return {
    hasCheckedInToday: true,
    moodId,
    microActionDone: true,
    streak: newStreak,
  };
}

export function isOracleDrawnToday(): boolean {
  return safeStorage.getItem(STORAGE_KEYS.ORACLE_DATE) === new Date().toDateString();
}

export function setOracleDrawnToday(): void {
  safeStorage.setItem(STORAGE_KEYS.ORACLE_DATE, new Date().toDateString());
}

export function getDailyAnchors(): Record<string, boolean> {
  try {
    const key = STORAGE_KEYS.ANCHORS_PREFIX + new Date().toDateString();
    const raw = safeStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function toggleDailyAnchor(id: string): Record<string, boolean> {
  const anchors = getDailyAnchors();
  anchors[id] = !anchors[id];
  const key = STORAGE_KEYS.ANCHORS_PREFIX + new Date().toDateString();
  safeStorage.setItem(key, JSON.stringify(anchors));
  return anchors;
}

export function getGuiltData(): { culpa?: string; resp?: string } {
  try {
    const raw = safeStorage.getItem(STORAGE_KEYS.GUILT);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function saveGuiltData(data: { culpa?: string; resp?: string }): void {
  safeStorage.setItem(STORAGE_KEYS.GUILT, JSON.stringify(data));
}

export interface BelongingState {
  ruta?: Record<number, boolean>;
  patrones?: Record<number, boolean>;
  checks?: Record<string, boolean>;
  frase?: string;
  balanceDia?: string;
  termo?: number;
  orgullo?: string;
  suelto?: string;
}

export function getBelongingData(): BelongingState {
  try {
    const raw = safeStorage.getItem(STORAGE_KEYS.BELONGING);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function saveBelongingData(data: BelongingState): void {
  safeStorage.setItem(STORAGE_KEYS.BELONGING, JSON.stringify(data));
}

export function isPremiumUser(): boolean {
  const status = getMembershipStatus();
  return status.isActive && !status.isExpired;
}

export function getMembershipStatus(): MembershipData {
  const deviceId = getDeviceId();
  try {
    const raw = safeStorage.getItem(STORAGE_KEYS.PREMIUM_DATA);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const now = Date.now();
        if (parsed.expiresAt) {
          const expMs = new Date(parsed.expiresAt).getTime();
          const isExpired = now >= expMs;
          const msRemaining = Math.max(0, expMs - now);
          const daysRemaining = isExpired ? 0 : Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
          const hoursRemaining = isExpired ? 0 : Math.ceil(msRemaining / (1000 * 60 * 60));

          if (isExpired && parsed.isActive) {
            parsed.isActive = false;
            parsed.isExpired = true;
            parsed.daysRemaining = 0;
            parsed.hoursRemaining = 0;
            safeStorage.setItem(STORAGE_KEYS.PREMIUM_DATA, JSON.stringify(parsed));
            safeStorage.setItem(STORAGE_KEYS.PREMIUM, '0');
          } else {
            parsed.daysRemaining = daysRemaining;
            parsed.hoursRemaining = hoursRemaining;
            parsed.isExpired = isExpired;
          }
          return {
            ...parsed,
            deviceId,
          };
        }
      }
    }
  } catch (e) {
    console.error('Error parsing membership data:', e);
  }

  // Fallback check on legacy flag
  const legacyActive = safeStorage.getItem(STORAGE_KEYS.PREMIUM) === '1';
  if (legacyActive) {
    const now = new Date();
    const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const data: MembershipData = {
      isActive: true,
      isExpired: false,
      activatedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      daysRemaining: 30,
      hoursRemaining: 720,
      code: 'LEGACY_PROMO',
      deviceId,
    };
    safeStorage.setItem(STORAGE_KEYS.PREMIUM_DATA, JSON.stringify(data));
    return data;
  }

  return {
    isActive: false,
    isExpired: false,
    daysRemaining: 0,
    hoursRemaining: 0,
    deviceId,
  };
}

export function setPremiumUser(active: boolean, durationDays = 30, code = 'PROMO'): void {
  const deviceId = getDeviceId();
  if (active) {
    const now = new Date();
    const expires = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
    const data: MembershipData = {
      isActive: true,
      isExpired: false,
      activatedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      daysRemaining: durationDays,
      hoursRemaining: durationDays * 24,
      code,
      deviceId,
    };
    safeStorage.setItem(STORAGE_KEYS.PREMIUM_DATA, JSON.stringify(data));
    safeStorage.setItem(STORAGE_KEYS.PREMIUM, '1');
  } else {
    safeStorage.setItem(STORAGE_KEYS.PREMIUM, '0');
    const existing = getMembershipStatus();
    existing.isActive = false;
    existing.isExpired = true;
    existing.daysRemaining = 0;
    existing.hoursRemaining = 0;
    safeStorage.setItem(STORAGE_KEYS.PREMIUM_DATA, JSON.stringify(existing));
  }
}

export interface ActivationResult {
  success: boolean;
  message?: string;
  error?: string;
  alreadyActive?: boolean;
  deviceMismatch?: boolean;
  isExpired?: boolean;
  daysRemaining?: number;
  expiresAt?: string;
  activatedAt?: string;
  code?: string;
}

export async function activateMembershipCode(code: string, deviceName?: string): Promise<ActivationResult> {
  const deviceId = getDeviceId();
  const cleaned = (code || '').trim().toUpperCase();

  if (!cleaned) {
    return { success: false, error: 'Por favor ingresa un código de activación.' };
  }

  try {
    const response = await fetch('/api/premium/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: cleaned,
        deviceId,
        deviceName: deviceName || (typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 40) : 'Dispositivo'),
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      const memData: MembershipData = {
        isActive: true,
        isExpired: false,
        code: data.code || cleaned,
        activatedAt: data.activatedAt,
        expiresAt: data.expiresAt,
        daysRemaining: data.daysRemaining || 30,
        hoursRemaining: (data.daysRemaining || 30) * 24,
        deviceId,
      };
      safeStorage.setItem(STORAGE_KEYS.PREMIUM_DATA, JSON.stringify(memData));
      safeStorage.setItem(STORAGE_KEYS.PREMIUM, '1');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('vishuda_membership_updated'));
      }

      return data;
    } else {
      return {
        success: false,
        error: data.error || 'No se pudo activar el código.',
        deviceMismatch: data.deviceMismatch,
        isExpired: data.isExpired,
      };
    }
  } catch (err) {
    // Network fallback
    console.warn('Backend activation unavailable, checking fallback codes:', err);
    if (VALID_PREMIUM_CODES.includes(cleaned)) {
      setPremiumUser(true, 30, cleaned);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('vishuda_membership_updated'));
      }
      return {
        success: true,
        message: '¡Código activado exitosamente en este dispositivo por 30 días!',
        daysRemaining: 30,
      };
    }
    return {
      success: false,
      error: 'Error al conectar con el servidor de activación. Revisa tu conexión a internet e inténtalo nuevamente.',
    };
  }
}

export function redeemActivationCode(code: string): boolean {
  const cleaned = (code || '').trim().toUpperCase();
  if (VALID_PREMIUM_CODES.includes(cleaned)) {
    setPremiumUser(true, 30, cleaned);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('vishuda_membership_updated'));
    }
    return true;
  }
  return false;
}

export async function syncMembershipStatus(): Promise<MembershipData> {
  const deviceId = getDeviceId();
  try {
    const res = await fetch(`/api/premium/status?deviceId=${encodeURIComponent(deviceId)}`);
    if (res.ok) {
      const serverData = await res.json();
      if (serverData.hasActiveMembership) {
        const memData: MembershipData = {
          isActive: true,
          isExpired: false,
          code: serverData.code,
          activatedAt: serverData.activatedAt,
          expiresAt: serverData.expiresAt,
          daysRemaining: serverData.daysRemaining,
          hoursRemaining: serverData.hoursRemaining,
          deviceId,
        };
        safeStorage.setItem(STORAGE_KEYS.PREMIUM_DATA, JSON.stringify(memData));
        safeStorage.setItem(STORAGE_KEYS.PREMIUM, '1');
        return memData;
      } else if (serverData.isExpired) {
        const memData: MembershipData = {
          isActive: false,
          isExpired: true,
          code: serverData.code,
          activatedAt: serverData.activatedAt,
          expiresAt: serverData.expiresAt,
          daysRemaining: 0,
          hoursRemaining: 0,
          deviceId,
        };
        safeStorage.setItem(STORAGE_KEYS.PREMIUM_DATA, JSON.stringify(memData));
        safeStorage.setItem(STORAGE_KEYS.PREMIUM, '0');
        return memData;
      }
    }
  } catch (e) {
    // Ignore offline errors during background sync
  }
  return getMembershipStatus();
}

export function getUsageCounts(): { cases: number; ai: number; fire: number } {
  return {
    cases: Number(safeStorage.getItem(STORAGE_KEYS.CASES_USED) || 0),
    ai: Number(safeStorage.getItem(STORAGE_KEYS.AI_USED) || 0),
    fire: Number(safeStorage.getItem('vishuda_fire_used') || 0),
  };
}

export function incrementUsageCount(type: 'cases' | 'ai' | 'fire'): number {
  const counts = getUsageCounts();
  if (type === 'cases') {
    const next = counts.cases + 1;
    safeStorage.setItem(STORAGE_KEYS.CASES_USED, String(next));
    return next;
  } else if (type === 'ai') {
    const next = counts.ai + 1;
    safeStorage.setItem(STORAGE_KEYS.AI_USED, String(next));
    return next;
  } else {
    const next = counts.fire + 1;
    safeStorage.setItem('vishuda_fire_used', String(next));
    return next;
  }
}

export function canAccessFullExperience(feature: 'exploration' | 'ai' | 'fire'): boolean {
  if (isPremiumUser()) return true;
  if (feature === 'exploration') {
    // 1st exploration is 100% free with all video, meditation & neurohacks
    return getExplorations().length < 1;
  }
  if (feature === 'ai') {
    return getUsageCounts().ai < 2;
  }
  if (feature === 'fire') {
    return getUsageCounts().fire < 1;
  }
  return false;
}
