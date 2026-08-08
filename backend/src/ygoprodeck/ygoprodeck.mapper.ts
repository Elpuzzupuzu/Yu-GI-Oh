import type {
  CardBanlistInput,
  CardExternalPriceInput,
  CardFormatInput,
  CardImageInput,
  CardPrintingInput,
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

export function mapYgoProDeckPrintings(
  card: YgoProDeckCard,
  cardId: string
): CardPrintingInput[] {
  const syncedAt =
    new Date().toISOString();

  return (card.card_sets ?? []).map(
    (set) => ({
      card_id: cardId,

      set_name:
        set.set_name,

      set_code:
        set.set_code,

      rarity:
        set.set_rarity ?? null,

      rarity_code:
        set.set_rarity_code ?? null,

      edition: null,

      external_url: null,

      reference_price:
        parsePrice(
          set.set_price
        ),

      currency: "USD",

      api_synced_at:
        syncedAt,
    })
  );
}

export function mapYgoProDeckImages(
  card: YgoProDeckCard,
  cardId: string
): CardImageInput[] {
  return (card.card_images ?? []).map(
    (image, index) => ({
      card_id:
        cardId,

      ygoprodeck_image_id:
        image.id,

      source_image_url:
        image.image_url ?? null,

      source_image_small_url:
        image.image_url_small ?? null,

      source_image_cropped_url:
        image.image_url_cropped ?? null,

      is_primary:
        index === 0,
    })
  );
}

export function mapYgoProDeckPrices(
  card: YgoProDeckCard,
  cardId: string
): CardExternalPriceInput[] {
  const prices =
    card.card_prices?.[0];

  if (!prices) {
    return [];
  }

  const syncedAt =
    new Date().toISOString();

  const vendors = [
    {
      vendor: "cardmarket",
      price: prices.cardmarket_price,
    },
    {
      vendor: "tcgplayer",
      price: prices.tcgplayer_price,
    },
    {
      vendor: "ebay",
      price: prices.ebay_price,
    },
    {
      vendor: "amazon",
      price: prices.amazon_price,
    },
    {
      vendor: "coolstuffinc",
      price: prices.coolstuffinc_price,
    },
  ];

  return vendors.map(
    ({ vendor, price }) => ({
      card_id:
        cardId,

      vendor,

      price:
        parsePrice(price),

      currency:
        "USD",

      api_synced_at:
        syncedAt,
    })
  );
}

export function mapYgoProDeckFormats(
  card: YgoProDeckCard,
  cardId: string
): CardFormatInput[] {
  const formats =
    card.misc_info?.[0]?.formats ?? [];

  const uniqueFormats =
    [...new Set(formats)];

  return uniqueFormats.map(
    (format) => ({
      card_id:
        cardId,

      format,
    })
  );
}

export function mapYgoProDeckBanlists(
  card: YgoProDeckCard,
  cardId: string
): CardBanlistInput[] {
  const banlist =
    card.banlist_info;

  if (!banlist) {
    return [];
  }

  const syncedAt =
    new Date().toISOString();

  const result:
    CardBanlistInput[] = [];

  if (banlist.ban_tcg) {
    result.push({
      card_id:
        cardId,

      format:
        "TCG",

      status:
        banlist.ban_tcg,

      api_synced_at:
        syncedAt,
    });
  }

  if (banlist.ban_ocg) {
    result.push({
      card_id:
        cardId,

      format:
        "OCG",

      status:
        banlist.ban_ocg,

      api_synced_at:
        syncedAt,
    });
  }

  if (banlist.ban_goat) {
    result.push({
      card_id:
        cardId,

      format:
        "GOAT",

      status:
        banlist.ban_goat,

      api_synced_at:
        syncedAt,
    });
  }

  return result;
}

function normalizeBoolean(
  value:
    | boolean
    | number
    | undefined
): boolean | null {
  if (value === undefined) {
    return null;
  }

  if (
    typeof value === "boolean"
  ) {
    return value;
  }

  return value === 1;
}

function parsePrice(
  value?: string
): number | null {
  if (
    value === undefined ||
    value.trim() === ""
  ) {
    return null;
  }

  const parsed =
    Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}