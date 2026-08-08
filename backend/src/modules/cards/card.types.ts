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
