import { cardRepository } from "./card.repository";


import { ygoprodeckClient } from "@/ygoprodeck/ygoprodeck.client";
import { mapYgoProDeckCardToCardInput } from "@/ygoprodeck/ygoprodeck.mapper";

import type {
  Card,
  CardQuery,
  UpsertCardInput,
} from "./card.types";

class CardService {
  async getCards(
    filters: CardQuery = {}
  ): Promise<Card[]> {
    return cardRepository.findAll(filters);
  }

  async getCardById(
    id: string
  ): Promise<Card> {
    const card = await cardRepository.findById(id);

    if (!card) {
      throw new Error("Carta no encontrada.");
    }

    return card;
  }

  async getCardByYgoProDeckId(
    ygoprodeckId: number
  ): Promise<Card | null> {
    return cardRepository.findByYgoProDeckId(
      ygoprodeckId
    );
  }

  async saveCard(
    input: UpsertCardInput
  ): Promise<Card> {
    if (!input.name.trim()) {
      throw new Error(
        "El nombre de la carta es obligatorio."
      );
    }

    if (!input.type.trim()) {
      throw new Error(
        "El tipo de la carta es obligatorio."
      );
    }

    if (!Number.isInteger(input.ygoprodeck_id)) {
      throw new Error(
        "ygoprodeck_id debe ser un número entero."
      );
    }

    return cardRepository.upsert(input);
  }



  async importCardByName(
  name: string
): Promise<Card> {
  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new Error(
      "El nombre de la carta es obligatorio."
    );
  }

  // 1. Consultar YGOPRODeck
  const externalCard =
    await ygoprodeckClient.getCardByName(
      normalizedName
    );

  if (!externalCard) {
    throw new Error(
      "Carta no encontrada en YGOPRODeck."
    );
  }

  // 2. Transformar formato externo
  // al formato de nuestra DB
  const cardInput =
    mapYgoProDeckCardToCardInput(
      externalCard
    );

  // 3. Guardar en Supabase
  return this.saveCard(cardInput);
}


}

///////











export const cardService =
  new CardService();