import { Router } from "express";

import { cardController } from "./card.controller";

export const cardRouter = Router();

cardRouter.get(
  "/",
  cardController.getAll.bind(
    cardController
  )
);

cardRouter.get(
  "/external/search",
  cardController.searchExternal.bind(
    cardController
  )
);

cardRouter.post(
  "/import",
  cardController.importCard.bind(
    cardController
  )
);

cardRouter.get(
  "/:id",
  cardController.getById.bind(
    cardController
  )
);