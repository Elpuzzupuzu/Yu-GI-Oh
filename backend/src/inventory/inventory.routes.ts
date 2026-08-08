import { Router } from "express";

import { inventoryController } from "./inventory.controller";

export const inventoryRouter = Router();

inventoryRouter.get(
  "/",
  inventoryController.getAll.bind(
    inventoryController
  )
);

inventoryRouter.post(
  "/",
  inventoryController.create.bind(
    inventoryController
  )
);



inventoryRouter.post(
  "/stock",
  inventoryController.addStock.bind(
    inventoryController
  )
);


inventoryRouter.get(
  "/details",
  inventoryController.getAllWithDetails.bind(
    inventoryController
  )
);


inventoryRouter.get(
  "/:id",
  inventoryController.getById.bind(
    inventoryController
  )
);

inventoryRouter.patch(
  "/:id",
  inventoryController.update.bind(
    inventoryController
  )
);

inventoryRouter.get(
  "/:id/movements",
  inventoryController.getMovements.bind(
    inventoryController
  )
);

inventoryRouter.post(
  "/:id/movements",
  inventoryController.createMovement.bind(
    inventoryController
  )


  
);