import { cardRepository } from "./card.repository";


import { ygoprodeckClient } from "@/ygoprodeck/ygoprodeck.client";


import {
  mapYgoProDeckBanlists,
  mapYgoProDeckCardToCardInput,
  mapYgoProDeckFormats,
  mapYgoProDeckImages,
  mapYgoProDeckPrices,
  mapYgoProDeckPrintings,
} from "@/ygoprodeck/ygoprodeck.mapper";


import type {
  Card,
  CardPrintingDetails,
  CardPrintingQuery,
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
) {
  const normalizedName =
    name.trim();

  if (!normalizedName) {
    throw new Error(
      "El nombre de la carta es obligatorio."
    );
  }

  // 1. Obtener datos externos
  const externalCard =
    await ygoprodeckClient.getCardByName(
      normalizedName
    );

  if (!externalCard) {
    throw new Error(
      "Carta no encontrada en YGOPRODeck."
    );
  }

  // 2. Guardar carta principal
  const cardInput =
    mapYgoProDeckCardToCardInput(
      externalCard
    );

  const savedCard =
    await this.saveCard(cardInput);

  // 3. Preparar relaciones
  const printings =
    mapYgoProDeckPrintings(
      externalCard,
      savedCard.id
    );

  const images =
    mapYgoProDeckImages(
      externalCard,
      savedCard.id
    );

  const prices =
    mapYgoProDeckPrices(
      externalCard,
      savedCard.id
    );

  const formats =
    mapYgoProDeckFormats(
      externalCard,
      savedCard.id
    );

  const banlists =
    mapYgoProDeckBanlists(
      externalCard,
      savedCard.id
    );

  // 4. Persistir relaciones
  await cardRepository.upsertPrintings(
    printings
  );

  await cardRepository.upsertImages(
    images
  );

  await cardRepository.upsertExternalPrices(
    prices
  );

  await cardRepository.upsertFormats(
    formats
  );

  await cardRepository.upsertBanlists(
    banlists
  );

  return {
    card: savedCard,

    imported: {
      printings: printings.length,
      images: images.length,
      external_prices: prices.length,
      formats: formats.length,
      banlists: banlists.length,
    },
  };
  
}


///////////////
async getPrintings(
  filters: CardPrintingQuery = {}
): Promise<CardPrintingDetails[]> {
  return cardRepository.findPrintings(
    filters
  );
}


}

///////











export const cardService =
  new CardService();