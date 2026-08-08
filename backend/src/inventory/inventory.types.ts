export type CardCondition =
  | "NM"
  | "LP"
  | "MP"
  | "HP"
  | "DMG";

export type InventoryMovementType =
  | "purchase"
  | "sale"
  | "return"
  | "adjustment"
  | "damage"
  | "transfer";

export interface InventoryItem {
  id: string;

  printing_id: string;

  condition: CardCondition;

  language: string;

  quantity: number;

  sale_price: number | null;
  currency: string;

  cost_price: number | null;

  location: string | null;
  notes: string | null;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface CreateInventoryInput {
  printing_id: string;

  condition: CardCondition;

  language?: string;

  quantity?: number;

  sale_price?: number | null;
  currency?: string;

  cost_price?: number | null;

  location?: string | null;
  notes?: string | null;

  is_active?: boolean;
}

export interface UpdateInventoryInput {
  sale_price?: number | null;

  cost_price?: number | null;

  currency?: string;

  location?: string | null;

  notes?: string | null;

  is_active?: boolean;
}

export interface InventoryMovement {
  id: string;

  inventory_id: string;

  movement_type: InventoryMovementType;

  quantity: number;

  unit_cost: number | null;

  reference: string | null;
  notes: string | null;

  created_at: string;
}

export interface CreateInventoryMovementInput {
  inventory_id: string;

  movement_type: InventoryMovementType;

  quantity: number;

  unit_cost?: number | null;

  reference?: string | null;
  notes?: string | null;
}

export interface InventoryQuery {
  printing_id?: string;

  condition?: CardCondition;

  language?: string;

  is_active?: boolean;

  in_stock?: boolean;
}

export interface AddInventoryStockInput {
  printing_id: string;

  condition: CardCondition;

  language?: string;

  quantity: number;

  sale_price?: number | null;

  currency?: string;

  cost_price?: number | null;

  location?: string | null;

  notes?: string | null;

  reference?: string | null;
}