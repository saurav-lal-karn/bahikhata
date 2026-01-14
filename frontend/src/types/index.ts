export interface Family {
  id: string;
  name: string;
  currency: string;
  locale: string;
  budgetAlerts: boolean;
  weeklyReport: boolean;
  hidePortfolio: boolean;
  restrictDeletion: boolean;
  hideIncome: boolean;
}

export interface FamilySettings {
  id: string;
  name: string;
  currency: string;
  budgetAlerts: boolean;
  weeklyReport: boolean;
  hidePortfolio: boolean;
  restrictDeletion: boolean;
}

export interface UpdateFamilySettingsPayload {
  name: string;
  currency: string;
  budgetAlerts: boolean;
  weeklyReport: boolean;
  hidePortfolio: boolean;
  restrictDeletion: boolean;
}

export interface InviteMemberPayload {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  familyId?: string;
}

export interface FamilyMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
  status: string;
  avatar_url: string;
}

export interface FamilyStats {
  total_members: number;
  total_administrators: number;
  total_active_now: number;
  total_pending_invites: number;
  total_amount: number;
  total_ledgers: number;
  total_users: number;
  total_transactions: number;
}