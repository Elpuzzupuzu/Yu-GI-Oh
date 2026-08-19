import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { ygoprodeckClient } from "@/ygoprodeck/ygoprodeck.client";

import { cardService } from "./card.service";

type CardIdParams = {
  id: string;
};

import type { ImportCardBody } from "./card.types";


class CardController {
  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        name,
        archetype,
        type,
        attribute,
      } = req.query;

      const cards = await cardService.getCards({
        name:
          typeof name === "string"
            ? name
            : undefined,

        archetype:
          typeof archetype === "string"
            ? archetype
            : undefined,

        type:
          typeof type === "string"
            ? type
            : undefined,

        attribute:
          typeof attribute === "string"
            ? attribute
            : undefined,
      });

      return res.status(200).json({
        success: true,
        data: cards,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request<CardIdParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const card =
        await cardService.getCardById(id);

      return res.status(200).json({
        success: true,
        data: card,
      });
    } catch (error) {
      next(error);
    }
  }

  async searchExternal(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name } = req.query;

      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "El parámetro name es obligatorio.",
        });
      }

      const card =
        await ygoprodeckClient.getCardByName(
          name.trim()
        );

      if (!card) {
        return res.status(404).json({
          success: false,
          message:
            "Carta no encontrada en YGOPRODeck.",
        });
      }

      return res.status(200).json({
        success: true,
        source: "ygoprodeck",
        data: card,
      });
    } catch (error) {
      next(error);
    }
  }




  async importCard(
  req: Request<
    Record<string, never>,
    unknown,
    ImportCardBody
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const { name } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "El campo name es obligatorio.",
      });
    }

    const card =
      await cardService.importCardByName(
        name
      );

    return res.status(201).json({
      success: true,
      message:
        "Carta importada correctamente.",
      data: card,
    });
  } catch (error) {
    next(error);
  }
}
//////
async getPrintings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      name,
      set_code,
      rarity,
    } = req.query;

    const printings =
      await cardService.getPrintings({
        name:
          typeof name === "string"
            ? name
            : undefined,

        set_code:
          typeof set_code === "string"
            ? set_code
            : undefined,

        rarity:
          typeof rarity === "string"
            ? rarity
            : undefined,
      });

    return res.status(200).json({
      success: true,
      data: printings,
    });
  } catch (error) {
    next(error);
  }
}



}

export const cardController =
  new CardController();