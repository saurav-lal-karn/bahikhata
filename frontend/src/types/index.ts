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

// Types for expenses
export interface CreateExpensePayload {
    name: string;
    amount: number;
    category_id: string;
    payment_method_id: string;
    family_id: string;
    transaction_date: string;
    description: string;
    is_custom_category: boolean;
    is_custom_payment_method: boolean;
    custom_category_name: string;
    custom_payment_method_name: string;
}

export interface Expense {
    id?: string;
    name: string;
    amount: number;
    category: string;
    payment_method: string;
    isCustomCategory: boolean;
    isCustomPaymentMethod: boolean;
    transaction_date: string;
    description: string;
}

export interface ExpenseStats {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ReactNode;
    bg: string;
    color: string;
    change?: string;
    isPositive?: boolean;
}

export interface ExpenseStatsResponse {
    total_expenses: number;
    total_amount: number;
    this_month: number;
    last_month: number;
    average_expense: number;
}

// Types for categories
export interface ExpenseCategory {
    id: string;
    name: string;
    description: string;
    is_system: boolean;
    tags: string[];
    family_id: string;
    created_by_id: string;
}

// Types for payment methods
export interface PaymentMethod {
    id: string;
    name: string;
    description: string;
    icon_name: string;
    is_system: boolean;
    family_id: string;
    created_by_id: string;
}

// Types for wallet types
export interface WalletType {
    id: string;
    name: string;
    description: string;
    is_system: boolean;
    family_id: string;
    created_by_id: string;
}

// Types for wallets
export interface CreateWalletPayload {
    name: string;
    starting_balance: number;
    currency: string;
    wallet_id: string;
    wallet_issuer_name: string;
    wallet_type_id: string;
    description: string;
    is_custom_type: boolean;
    custom_type_name: string;
    custom_type_description: string;
    family_id: string;
}

export interface WalletInfoType {
    id: string;
    name: string;
    starting_balance: number;
    balance: number;
    currency: string;
    description: string;
    wallet_issuer_name: string;
    wallet_id: string;
    wallet_type_id: string;
    user_id: string;
    family_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    wallet_type: WalletType;
}

export interface CreateWalletTransferPayload {
    from_wallet_id: string;
    to_wallet_id: string;
    amount: number;
    date: string;
    remarks: string;
    family_id: string;
}

export interface WalletTransfer {
    id: string;
    from_wallet_id: string;
    to_wallet_id: string;
    amount: number;
    date: string;
    remarks: string;
    user_id: string;
    family_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    from_wallet: WalletInfoType;
    to_wallet: WalletInfoType;
}
