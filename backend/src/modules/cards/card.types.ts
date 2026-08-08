export interface Card {
  id: string;

  ygoprodeck_id: number;
  konami_id: number | null;

  name: string;
  beta_name: string | null;

  description: string | null;

  type: string;
  frame_type: string | null;

  race: string | null;
  archetype: string | null;
  attribute: string | null;

  atk: number | null;
  def: number | null;
  level: number | null;
  scale: number | null;

  link_value: number | null;
  link_markers: string[] | null;

  treated_as: string | null;

  tcg_release_date: string | null;
  ocg_release_date: string | null;

  master_duel_rarity: string | null;

  has_effect: boolean | null;

  views: number | null;
  views_week: number | null;

  upvotes: number | null;
  downvotes: number | null;

  genesys_points: number | null;
  genesys_ocg_points: number | null;

  raw_api_data: Record<string, unknown> | null;

  api_synced_at: string | null;

  created_at: string;
  updated_at: string;
}


export interface UpsertCardInput {
  ygoprodeck_id: number;

  konami_id?: number | null;

  name: string;

  beta_name?: string | null;
  description?: string | null;

  type: string;
  frame_type?: string | null;

  race?: string | null;
  archetype?: string | null;
  attribute?: string | null;

  atk?: number | null;
  def?: number | null;
  level?: number | null;
  scale?: number | null;

  link_value?: number | null;
  link_markers?: string[] | null;

  treated_as?: string | null;

  tcg_release_date?: string | null;
  ocg_release_date?: string | null;

  master_duel_rarity?: string | null;

  has_effect?: boolean | null;

  views?: number | null;
  views_week?: number | null;

  upvotes?: number | null;
  downvotes?: number | null;

  genesys_points?: number | null;
  genesys_ocg_points?: number | null;

  raw_api_data?: Record<string, unknown> | null;

  api_synced_at?: string | null;
}


export interface CardQuery {
  name?: string;
  archetype?: string;
  type?: string;
  attribute?: string;
}

export type ImportCardBody = {
  name: string;
};


export interface CardPrintingInput {
  card_id: string;

  set_name: string;
  set_code: string;

  rarity: string | null;
  rarity_code: string | null;

  edition?: string | null;
  external_url?: string | null;

  reference_price: number | null;

  currency: string;

  api_synced_at: string;
}

export interface CardImageInput {
  card_id: string;

  ygoprodeck_image_id: number;

  source_image_url: string | null;
  source_image_small_url: string | null;
  source_image_cropped_url: string | null;

  is_primary: boolean;
}

export interface CardExternalPriceInput {
  card_id: string;

  vendor: string;

  price: number | null;

  currency: string;

  api_synced_at: string;
}

export interface CardFormatInput {
  card_id: string;

  format: string;
}

export interface CardBanlistInput {
  card_id: string;

  format: string;

  status: string;

  api_synced_at: string;
}