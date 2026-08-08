export interface YgoProDeckResponse {
  data: YgoProDeckCard[];
}

export interface YgoProDeckCard {
  id: number;

  name: string;

  typeline?: string[];

  type: string;

  humanReadableCardType?: string;

  frameType: string;

  desc: string;

  race?: string;
  archetype?: string;
  attribute?: string;

  atk?: number;
  def?: number;
  level?: number;
  scale?: number;

  linkval?: number;
  linkmarkers?: string[];

  ygoprodeck_url?: string;

  card_sets?: YgoProDeckCardSet[];

  card_images?: YgoProDeckCardImage[];

  card_prices?: YgoProDeckCardPrice[];

  banlist_info?: YgoProDeckBanlistInfo;

  misc_info?: YgoProDeckMiscInfo[];
}

export interface YgoProDeckCardSet {
  set_name: string;
  set_code: string;

  set_rarity?: string;
  set_rarity_code?: string;

  set_price?: string;
}

export interface YgoProDeckCardImage {
  id: number;

  image_url: string;
  image_url_small: string;
  image_url_cropped: string;
}

export interface YgoProDeckCardPrice {
  cardmarket_price?: string;
  tcgplayer_price?: string;
  ebay_price?: string;
  amazon_price?: string;
  coolstuffinc_price?: string;
}

export interface YgoProDeckBanlistInfo {
  ban_tcg?: string;
  ban_ocg?: string;
  ban_goat?: string;
}

export interface YgoProDeckMiscInfo {
  beta_name?: string;

  treated_as?: string;

  tcg_date?: string;
  ocg_date?: string;

  konami_id?: number;

  has_effect?: boolean | number;

  md_rarity?: string;

  views?: number;
  viewsweek?: number;

  upvotes?: number;
  downvotes?: number;

  genesys_points?: number;
  genesys_ocg_points?: number;

  formats?: string[];
}



