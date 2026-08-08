import { supabase } from "@/config/supabase";

import type {
  Card,
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
}

export const cardRepository =
  new CardRepository();