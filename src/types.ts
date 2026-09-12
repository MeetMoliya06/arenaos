export type BranchId = 'indiranagar' | 'koramangala' | 'bandra' | 'cyberhub';

export interface BranchInfo {
  id: BranchId;
  name: string;
  city: string;
  totalPcs: number;
  activePcs: number;
  occupancy: number;
  pingMs: number;
  revenueToday: number;
  zones: string[];
}

export type StationStatus = 'IN_USE' | 'AVAILABLE' | 'BILLING' | 'LOCKED';

export interface StationData {
  id: string;
  stationNumber: number;
  zone: string;
  status: StationStatus;
  currentUser?: string;
  sessionDurationMin?: number;
  spentSoFar?: number;
  specs: string;
}

export type ModuleId = 
  | 'pc-session' 
  | 'digital-wallet' 
  | 'fnb-ordering' 
  | 'cash-register' 
  | 'eod-audit' 
  | 'multi-branch';

export interface ModuleInfo {
  id: ModuleId;
  code: string;
  title: string;
  tagline: string;
  description: string;
  stats: { label: string; value: string }[];
  features: string[];
}

export type RoleId = 'superadmin' | 'manager' | 'operator' | 'member';

export interface RoleScope {
  id: RoleId;
  name: string;
  clearance: string;
  badge: string;
  summary: string;
  permissions: {
    feature: string;
    allowed: boolean;
    note?: string;
  }[];
}
