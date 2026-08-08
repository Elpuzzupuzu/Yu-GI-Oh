import type {
  UpsertCardInput,
} from "@/modules/cards/card.types";

import type {
  YgoProDeckCard,
} from "./ygoprodeck.types";

export function mapYgoProDeckCardToCardInput(
  card: YgoProDeckCard
): UpsertCardInput {
  const misc =
    card.misc_info?.[0];

  return {
    ygoprodeck_id: card.id,

    konami_id:
      misc?.konami_id ?? null,

    name: card.name,

    beta_name:
      misc?.beta_name ?? null,

    description:
      card.desc ?? null,

    type: card.type,

    frame_type:
      card.frameType ?? null,

    race:
      card.race ?? null,

    archetype:
      card.archetype ?? null,

    attribute:
      card.attribute ?? null,

    atk:
      card.atk ?? null,

    def:
      card.def ?? null,

    level:
      card.level ?? null,

    scale:
      card.scale ?? null,

    link_value:
      card.linkval ?? null,

    link_markers:
      card.linkmarkers ?? null,

    treated_as:
      misc?.treated_as ?? null,

    tcg_release_date:
      misc?.tcg_date ?? null,

    ocg_release_date:
      misc?.ocg_date ?? null,

    master_duel_rarity:
      misc?.md_rarity ?? null,

    has_effect:
      normalizeBoolean(
        misc?.has_effect
      ),

    views:
      misc?.views ?? null,

    views_week:
      misc?.viewsweek ?? null,

    upvotes:
      misc?.upvotes ?? null,

    downvotes:
      misc?.downvotes ?? null,

    genesys_points:
      misc?.genesys_points ?? null,

    genesys_ocg_points:
      misc?.genesys_ocg_points ?? null,

    raw_api_data:
      card as unknown as Record<
        string,
        unknown
      >,

    api_synced_at:
      new Date().toISOString(),
  };
}

function normalizeBoolean(
  value: boolean | number | undefined
): boolean | null {
  if (value === undefined) {
    return null;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return value === 1;
}