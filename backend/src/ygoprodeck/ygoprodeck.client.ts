import { env } from "@/config/env";

import type {
  YgoProDeckCard,
  YgoProDeckResponse,
} from "./ygoprodeck.types";

class YgoProDeckClient {
  private readonly baseUrl =
    env.YGOPRODECK_API_URL;

  async getCardByName(
    name: string
  ): Promise<YgoProDeckCard | null> {
    const url = new URL(
      `${this.baseUrl}/cardinfo.php`
    );

    url.searchParams.set(
      "name",
      name
    );

    url.searchParams.set(
      "misc",
      "yes"
    );

    const response = await fetch(url);

    if (response.status === 400) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `Error consultando YGOPRODeck: ${response.status} ${response.statusText}`
      );
    }

    const result =
      (await response.json()) as YgoProDeckResponse;

    return result.data?.[0] ?? null;
  }

  async getCardById(
    id: number
  ): Promise<YgoProDeckCard | null> {
    const url = new URL(
      `${this.baseUrl}/cardinfo.php`
    );

    url.searchParams.set(
      "id",
      String(id)
    );

    url.searchParams.set(
      "misc",
      "yes"
    );

    const response = await fetch(url);

    if (response.status === 400) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `Error consultando YGOPRODeck: ${response.status} ${response.statusText}`
      );
    }

    const result =
      (await response.json()) as YgoProDeckResponse;

    return result.data?.[0] ?? null;
  }

  async searchCards(
    params: Record<string, string>
  ): Promise<YgoProDeckCard[]> {
    const url = new URL(
      `${this.baseUrl}/cardinfo.php`
    );

    Object.entries(params).forEach(
      ([key, value]) => {
        url.searchParams.set(key, value);
      }
    );

    const response = await fetch(url);

    if (response.status === 400) {
      return [];
    }

    if (!response.ok) {
      throw new Error(
        `Error consultando YGOPRODeck: ${response.status} ${response.statusText}`
      );
    }

    const result =
      (await response.json()) as YgoProDeckResponse;

    return result.data ?? [];
  }
}

export const ygoprodeckClient =
  new YgoProDeckClient();