import { Router } from "express";

import { cardRouter } from "@/modules/cards/card.routes";
import { inventoryRouter } from "@/inventory/inventory.routes";

export const router = Router();

router.use("/cards", cardRouter);
router.use("/inventory", inventoryRouter);