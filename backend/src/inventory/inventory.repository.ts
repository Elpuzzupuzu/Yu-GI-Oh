import { supabase } from "@/config/supabase";

import type {
  AddInventoryStockInput,
  CreateInventoryInput,
  CreateInventoryMovementInput,
  InventoryItem,
  InventoryMovement,
  InventoryQuery,
  InventoryWithDetails,
  UpdateInventoryInput,
} from "./inventory.types";

class InventoryRepository {
  async findAll(
    filters: InventoryQuery = {}
  ): Promise<InventoryItem[]> {
    let query = supabase
      .from("inventory")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (filters.printing_id) {
      query = query.eq(
        "printing_id",
        filters.printing_id
      );
    }

    if (filters.condition) {
      query = query.eq(
        "condition",
        filters.condition
      );
    }

    if (filters.language) {
      query = query.eq(
        "language",
        filters.language
      );
    }

    if (filters.is_active !== undefined) {
      query = query.eq(
        "is_active",
        filters.is_active
      );
    }

    if (filters.in_stock === true) {
      query = query.gt("quantity", 0);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(
        `Error obteniendo inventario: ${error.message}`
      );
    }

    return (data ?? []) as InventoryItem[];
  }

  async findById(
    id: string
  ): Promise<InventoryItem | null> {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Error obteniendo inventario: ${error.message}`
      );
    }

    return data as InventoryItem | null;
  }

  async findExisting(
    printingId: string,
    condition: string,
    language: string
  ): Promise<InventoryItem | null> {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("printing_id", printingId)
      .eq("condition", condition)
      .eq("language", language)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Error buscando inventario: ${error.message}`
      );
    }

    return data as InventoryItem | null;
  }

  async create(
    input: CreateInventoryInput
  ): Promise<InventoryItem> {
    const { data, error } = await supabase
      .from("inventory")
      .insert(input)
      .select("*")
      .single();

    if (error) {
      throw new Error(
        `Error creando inventario: ${error.message}`
      );
    }

    return data as InventoryItem;
  }

  async update(
    id: string,
    input: UpdateInventoryInput
  ): Promise<InventoryItem> {
    const { data, error } = await supabase
      .from("inventory")
      .update(input)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(
        `Error actualizando inventario: ${error.message}`
      );
    }

    return data as InventoryItem;
  }

  async updateQuantity(
    id: string,
    quantity: number
  ): Promise<InventoryItem> {
    const { data, error } = await supabase
      .from("inventory")
      .update({
        quantity,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(
        `Error actualizando cantidad: ${error.message}`
      );
    }

    return data as InventoryItem;
  }

  async createMovement(
    input: CreateInventoryMovementInput
  ): Promise<InventoryMovement> {
    const { data, error } = await supabase
      .from("inventory_movements")
      .insert(input)
      .select("*")
      .single();

    if (error) {
      throw new Error(
        `Error registrando movimiento: ${error.message}`
      );
    }

    return data as InventoryMovement;
  }

  async findMovements(
    inventoryId: string
  ): Promise<InventoryMovement[]> {
    const { data, error } = await supabase
      .from("inventory_movements")
      .select("*")
      .eq("inventory_id", inventoryId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw new Error(
        `Error obteniendo movimientos: ${error.message}`
      );
    }

    return (data ?? []) as InventoryMovement[];
  }


  async findAllWithDetails(): Promise<InventoryWithDetails[]> {
  const { data, error } = await supabase
    .from("inventory")
    .select(`
      id,
      printing_id,
      condition,
      language,
      quantity,
      sale_price,
      currency,
      cost_price,
      location,
      notes,
      is_active,
      created_at,
      updated_at,

      printing:card_printings!inventory_printing_id_fkey (
        id,
        set_name,
        set_code,
        rarity,
        rarity_code,
        reference_price,

        card:cards!card_printings_card_id_fkey (
          id,
          name,

          card_images (
            source_image_url,
            is_primary
          )
        )
      )
    `)
    .eq("is_active", true)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `Error obteniendo inventario enriquecido: ${error.message}`
    );
  }

  return (data ?? []).map((item: any) => {
    const card = item.printing?.card;

    const primaryImage =
      card?.card_images?.find(
        (image: any) =>
          image.is_primary === true
      ) ??
      card?.card_images?.[0] ??
      null;

    return {
      id: item.id,

      printing_id: item.printing_id,

      condition: item.condition,
      language: item.language,

      quantity: item.quantity,

      sale_price: item.sale_price,
      currency: item.currency,

      cost_price: item.cost_price,

      location: item.location,
      notes: item.notes,

      is_active: item.is_active,

      created_at: item.created_at,
      updated_at: item.updated_at,

      printing: {
        id: item.printing.id,

        set_name:
          item.printing.set_name,

        set_code:
          item.printing.set_code,

        rarity:
          item.printing.rarity,

        rarity_code:
          item.printing.rarity_code,

        reference_price:
          item.printing.reference_price,

        card: {
          id: card.id,

          name: card.name,

          image_url:
            primaryImage?.source_image_url ??
            null,
        },
      },
    };
  }) as InventoryWithDetails[];
}
}

export const inventoryRepository =
  new InventoryRepository();