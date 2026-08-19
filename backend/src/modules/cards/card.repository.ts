import { supabase } from "@/config/supabase";




import type {
  Card,
  CardBanlistInput,
  CardExternalPriceInput,
  CardFormatInput,
  CardImageInput,
  CardPrintingDetails,
  CardPrintingInput,
  CardPrintingQuery,
  CardQuery,
  UpsertCardInput,
} from "./card.types";





class CardRepository {
  async findAll(filters: CardQuery = {}): Promise<Card[]> {
    let query = supabase
      .from("cards")
      .select("*")
      .order("name", {
        ascending: true,
      });

    if (filters.name) {
      query = query.ilike(
        "name",
        `%${filters.name}%`
      );
    }

    if (filters.archetype) {
      query = query.eq(
        "archetype",
        filters.archetype
      );
    }

    if (filters.type) {
      query = query.eq(
        "type",
        filters.type
      );
    }

    if (filters.attribute) {
      query = query.eq(
        "attribute",
        filters.attribute
      );
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(
        `Error obteniendo cartas: ${error.message}`
      );
    }

    return (data ?? []) as Card[];
  }

  async findById(id: string): Promise<Card | null> {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Error obteniendo la carta: ${error.message}`
      );
    }

    return data as Card | null;
  }

  async findByYgoProDeckId(
    ygoprodeckId: number
  ): Promise<Card | null> {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("ygoprodeck_id", ygoprodeckId)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Error obteniendo la carta: ${error.message}`
      );
    }

    return data as Card | null;
  }

  async upsert(
    input: UpsertCardInput
  ): Promise<Card> {
    const { data, error } = await supabase
      .from("cards")
      .upsert(input, {
        onConflict: "ygoprodeck_id",
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(
        `Error guardando la carta: ${error.message}`
      );
    }

    return data as Card;
  }



  ////
  async upsertPrintings(
  printings: CardPrintingInput[]
): Promise<void> {
  if (printings.length === 0) {
    return;
  }

  const { error } = await supabase
    .from("card_printings")
    .upsert(printings, {
      onConflict:
        "card_id,set_code,rarity",
    });

  if (error) {
    throw new Error(
      `Error guardando impresiones: ${error.message}`
    );
  }
}


async upsertImages(
  images: CardImageInput[]
): Promise<void> {
  if (images.length === 0) {
    return;
  }

  const { error } = await supabase
    .from("card_images")
    .upsert(images, {
      onConflict:
        "card_id,ygoprodeck_image_id",
    });

  if (error) {
    throw new Error(
      `Error guardando imágenes: ${error.message}`
    );
  }
}

async upsertExternalPrices(
  prices: CardExternalPriceInput[]
): Promise<void> {
  if (prices.length === 0) {
    return;
  }

  const { error } = await supabase
    .from("card_external_prices")
    .upsert(prices, {
      onConflict:
        "card_id,vendor",
    });

  if (error) {
    throw new Error(
      `Error guardando precios externos: ${error.message}`
    );
  }
}
async upsertFormats(
  formats: CardFormatInput[]
): Promise<void> {
  if (formats.length === 0) {
    return;
  }

  const { error } = await supabase
    .from("card_formats")
    .upsert(formats, {
      onConflict:
        "card_id,format",
    });

  if (error) {
    throw new Error(
      `Error guardando formatos: ${error.message}`
    );
  }
}


async upsertBanlists(
  banlists: CardBanlistInput[]
): Promise<void> {
  if (banlists.length === 0) {
    return;
  }

  const { error } = await supabase
    .from("card_banlists")
    .upsert(banlists, {
      onConflict:
        "card_id,format",
    });

  if (error) {
    throw new Error(
      `Error guardando banlist: ${error.message}`
    );
  }
}

//////////////
async findPrintings(
  filters: CardPrintingQuery = {}
): Promise<CardPrintingDetails[]> {
  let query = supabase
    .from("card_printings")
    .select(`
      id,
      set_name,
      set_code,
      rarity,
      rarity_code,
      reference_price,
      currency,

      card:cards!card_printings_card_id_fkey (
        id,
        name,
        ygoprodeck_id,

        card_images (
          source_image_url,
          is_primary
        )
      ),

      inventory (
        id,
        condition,
        language,
        quantity,
        sale_price,
        currency,
        cost_price,
        location,
        is_active
      )
    `)
    .order("set_name", {
      ascending: true,
    });

  if (filters.name) {
    query = query.ilike(
      "cards.name",
      `%${filters.name}%`
    );
  }

  if (filters.set_code) {
    query = query.ilike(
      "set_code",
      `%${filters.set_code}%`
    );
  }

  if (filters.rarity) {
    query = query.ilike(
      "rarity",
      `%${filters.rarity}%`
    );
  }

  const { data, error } =
    await query;

  if (error) {
    throw new Error(
      `Error obteniendo impresiones: ${error.message}`
    );
  }

  return (data ?? []).map(
    (item: any) => {
      const card =
        item.card;

      const primaryImage =
        card?.card_images?.find(
          (image: any) =>
            image.is_primary === true
        ) ??
        card?.card_images?.[0] ??
        null;

      return {
        id:
          item.id,

        set_name:
          item.set_name,

        set_code:
          item.set_code,

        rarity:
          item.rarity,

        rarity_code:
          item.rarity_code,

        reference_price:
          item.reference_price,

        currency:
          item.currency,

        card: {
          id:
            card.id,

          name:
            card.name,

          ygoprodeck_id:
            card.ygoprodeck_id,

          image_url:
            primaryImage?.source_image_url ??
            null,
        },

        inventory:
          item.inventory ?? [],
      };
    }
  ) as CardPrintingDetails[];
}


}

export const cardRepository =
  new CardRepository();