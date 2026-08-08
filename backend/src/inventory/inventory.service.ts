import { inventoryRepository } from "./inventory.repository";

import type {
  CreateInventoryInput,
  CreateInventoryMovementInput,
  InventoryItem,
  InventoryMovement,
  InventoryQuery,
  UpdateInventoryInput,
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
    if (input.quantity === 0) {
      throw new Error(
        "La cantidad del movimiento no puede ser 0."
      );
    }

    const inventory =
      await this.getInventoryById(
        input.inventory_id
      );

    const newQuantity =
      inventory.quantity + input.quantity;

    if (newQuantity < 0) {
      throw new Error(
        "El movimiento dejaría el inventario con cantidad negativa."
      );
    }

    const updatedInventory =
      await inventoryRepository.updateQuantity(
        inventory.id,
        newQuantity
      );

    const movement =
      await inventoryRepository.createMovement(
        input
      );

    return {
      inventory: updatedInventory,
      movement,
    };
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
}

export const inventoryService =
  new InventoryService();