export type ProductProps = {
  id: number;
  title: string;
  img: string;
  price: number;
  description: string;
  rate: number;
};

export type Pokemon = {
  name: string;
  url: string;
};

export interface BattleEffect {
  effect_entries: EffectEntry[];
}

export interface EffectEntry {
  effect: string;
  language: Language;
  short_effect: string;
}

export interface Language {
  name: string;
  url: string;
}
