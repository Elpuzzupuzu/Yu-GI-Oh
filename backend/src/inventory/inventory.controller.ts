import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { inventoryService } from "./inventory.service";

import type {
  AddInventoryStockInput,
  CardCondition,
  CreateInventoryInput,
  CreateInventoryMovementInput,
  UpdateInventoryInput,
} from "./inventory.types";

type InventoryIdParams = {
  id: string;
};

class InventoryController {
  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        printing_id,
        condition,
        language,
        is_active,
        in_stock,
      } = req.query;

      const inventory =
        await inventoryService.getInventory({
          printing_id:
            typeof printing_id === "string"
              ? printing_id
              : undefined,

          condition:
            typeof condition === "string"
              ? (condition as CardCondition)
              : undefined,

          language:
            typeof language === "string"
              ? language
              : undefined,

          is_active:
            typeof is_active === "string"
              ? is_active === "true"
              : undefined,

          in_stock:
            typeof in_stock === "string"
              ? in_stock === "true"
              : undefined,
        });

      return res.status(200).json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request<InventoryIdParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const inventory =
        await inventoryService.getInventoryById(
          id
        );

      return res.status(200).json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(
    req: Request<
      Record<string, never>,
      unknown,
      CreateInventoryInput
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const inventory =
        await inventoryService.createInventory(
          req.body
        );

      return res.status(201).json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request<
      InventoryIdParams,
      unknown,
      UpdateInventoryInput
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const inventory =
        await inventoryService.updateInventory(
          id,
          req.body
        );

      return res.status(200).json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      next(error);
    }
  }

  async createMovement(
    req: Request<
      InventoryIdParams,
      unknown,
      Omit<
        CreateInventoryMovementInput,
        "inventory_id"
      >
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const result =
        await inventoryService.registerMovement({
          ...req.body,
          inventory_id: id,
        });

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMovements(
    req: Request<InventoryIdParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const movements =
        await inventoryService.getMovements(id);

      return res.status(200).json({
        success: true,
        data: movements,
      });
    } catch (error) {
      next(error);
    }
  }

  async addStock(
  req: Request<
    Record<string, never>,
    unknown,
    AddInventoryStockInput
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const result =
      await inventoryService.addStock(
        req.body
      );

    return res.status(
      result.created ? 201 : 200
    ).json({
      success: true,

      message: result.created
        ? "Inventario creado y stock registrado correctamente."
        : "Stock actualizado correctamente.",

      data: result,
    });
  } catch (error) {
    next(error);
  }
}


async getAllWithDetails(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const inventory =
      await inventoryService.getInventoryWithDetails();

    return res.status(200).json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    next(error);
  }
}


async getDetails(
  req: Request<InventoryIdParams>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const details =
      await inventoryService.getInventoryDetails(
        id
      );

    return res.status(200).json({
      success: true,
      data: details,
    });
  } catch (error) {
    next(error);
  }
}
}

export const inventoryController =
  new InventoryController();