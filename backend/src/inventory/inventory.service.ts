import { inventoryRepository } from "./inventory.repository";

import type {
  AddInventoryStockInput,
  CreateInventoryInput,
  CreateInventoryMovementInput,
  InventoryItem,
  InventoryMovement,
  InventoryQuery,
  UpdateInventoryInput,
  InventoryDetailsWithMovements
} from "./inventory.types";




class InventoryService {
  async getInventory(
    filters: InventoryQuery = {}
  ): Promise<InventoryItem[]> {
    return inventoryRepository.findAll(filters);
  }

  async getInventoryById(
    id: string
  ): Promise<InventoryItem> {
    const inventory =
      await inventoryRepository.findById(id);

    if (!inventory) {
      throw new Error(
        "Registro de inventario no encontrado."
      );
    }

    return inventory;
  }

  async createInventory(
    input: CreateInventoryInput
  ): Promise<InventoryItem> {
    if (!input.printing_id) {
      throw new Error(
        "printing_id es obligatorio."
      );
    }

    if (!input.condition) {
      throw new Error(
        "La condición es obligatoria."
      );
    }

    const language =
      input.language?.trim().toUpperCase() ?? "EN";

    const quantity = input.quantity ?? 0;

    if (quantity < 0) {
      throw new Error(
        "La cantidad no puede ser negativa."
      );
    }

    const existing =
      await inventoryRepository.findExisting(
        input.printing_id,
        input.condition,
        language
      );

    if (existing) {
      throw new Error(
        "Ya existe un registro para esta impresión, condición e idioma."
      );
    }

    return inventoryRepository.create({
      ...input,
      language,
      quantity,
      currency:
        input.currency?.toUpperCase() ?? "USD",
    });
  }

  async updateInventory(
    id: string,
    input: UpdateInventoryInput
  ): Promise<InventoryItem> {
    await this.getInventoryById(id);

    if (
      input.sale_price !== undefined &&
      input.sale_price !== null &&
      input.sale_price < 0
    ) {
      throw new Error(
        "El precio de venta no puede ser negativo."
      );
    }

    if (
      input.cost_price !== undefined &&
      input.cost_price !== null &&
      input.cost_price < 0
    ) {
      throw new Error(
        "El costo no puede ser negativo."
      );
    }

    if (input.currency) {
      input.currency =
        input.currency.toUpperCase();
    }

    return inventoryRepository.update(
      id,
      input
    );
  }

 
  


async registerMovement(
  input: CreateInventoryMovementInput
): Promise<{
  inventory: InventoryItem;
  movement: InventoryMovement;
}> {
  if (!input.inventory_id) {
    throw new Error(
      "inventory_id es obligatorio."
    );
  }

  if (!Number.isInteger(input.quantity)) {
    throw new Error(
      "La cantidad debe ser un número entero."
    );
  }

  if (input.quantity === 0) {
    throw new Error(
      "La cantidad no puede ser 0."
    );
  }

  return inventoryRepository.registerMovementAtomic(
    input
  );
}


  async getMovements(
    inventoryId: string
  ): Promise<InventoryMovement[]> {
    await this.getInventoryById(
      inventoryId
    );

    return inventoryRepository.findMovements(
      inventoryId
    );
  }

  async addStock(
  input: AddInventoryStockInput
): Promise<{
  inventory: InventoryItem;
  movement: InventoryMovement;
  created: boolean;
}> {
  if (!input.printing_id) {
    throw new Error(
      "printing_id es obligatorio."
    );
  }

  if (!input.condition) {
    throw new Error(
      "La condición es obligatoria."
    );
  }

  if (
    !Number.isInteger(input.quantity) ||
    input.quantity <= 0
  ) {
    throw new Error(
      "La cantidad debe ser un entero mayor a 0."
    );
  }

  if (
    input.sale_price !== undefined &&
    input.sale_price !== null &&
    input.sale_price < 0
  ) {
    throw new Error(
      "El precio de venta no puede ser negativo."
    );
  }

  if (
    input.cost_price !== undefined &&
    input.cost_price !== null &&
    input.cost_price < 0
  ) {
    throw new Error(
      "El costo no puede ser negativo."
    );
  }

  const language =
    input.language?.trim().toUpperCase() ?? "EN";

  const currency =
    input.currency?.trim().toUpperCase() ?? "MXN";

  const existing =
    await inventoryRepository.findExisting(
      input.printing_id,
      input.condition,
      language
    );

  let inventory: InventoryItem;
  let created = false;

  if (existing) {
    const newQuantity =
      existing.quantity + input.quantity;

    inventory =
      await inventoryRepository.updateQuantity(
        existing.id,
        newQuantity
      );

    inventory =
      await inventoryRepository.update(
        existing.id,
        {
          sale_price:
            input.sale_price ??
            existing.sale_price,

          cost_price:
            input.cost_price ??
            existing.cost_price,

          currency,

          location:
            input.location ??
            existing.location,

          notes:
            input.notes ??
            existing.notes,

          is_active: true,
        }
      );
  } else {
    inventory =
      await inventoryRepository.create({
        printing_id:
          input.printing_id,

        condition:
          input.condition,

        language,

        quantity:
          input.quantity,

        sale_price:
          input.sale_price ?? null,

        cost_price:
          input.cost_price ?? null,

        currency,

        location:
          input.location ?? null,

        notes:
          input.notes ?? null,

        is_active: true,
      });

    created = true;
  }

  const movement =
    await inventoryRepository.createMovement({
      inventory_id:
        inventory.id,

      movement_type:
        "purchase",

      quantity:
        input.quantity,

      unit_cost:
        input.cost_price ?? null,

      reference:
        input.reference ?? null,

      notes:
        input.notes ?? null,
    });

  return {
    inventory,
    movement,
    created,
  };
}

async getInventoryWithDetails() {
  return inventoryRepository.findAllWithDetails();
}
async getInventoryDetails(
  id: string
): Promise<InventoryDetailsWithMovements> {
  const inventory =
    await inventoryRepository.findByIdWithDetails(
      id
    );

  if (!inventory) {
    throw new Error(
      "Registro de inventario no encontrado."
    );
  }

  const movements =
    await inventoryRepository.findMovements(
      id
    );

  return {
    inventory,
    movements,
  };
}

}

export const inventoryService =
  new InventoryService();