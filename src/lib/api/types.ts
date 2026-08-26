// Contratto fra frontend e (futuro) backend. Il generatore in
// tools/generate-observatory.mjs produce esattamente queste forme: quando
// arriveranno i dati reali, questo file è la specifica da rispettare.

import type {
  Category,
  Destination,
  DestinationDetail,
  Meta,
  NationalView,
} from "../observatory";

export type MetaDTO = Meta;
export type NationalDTO = NationalView;
export type CategorySummary = Category;
export type DestinationSummary = Destination;
export type DestinationDetailDTO = DestinationDetail;

export type HotelSummary = {
  key: string;
  name: string;
  destination: string;
  destinationName: Record<string, string>;
  category: string;
  area: string;
  stars: number;
  domain: string;
  synthetic: boolean;
  score: { mean: number; stdDev: number; runs: number; stability: string };
  byEngine: Record<string, number>;
  presence: number;
  avgPosition: number;
  auditScore: number;
  trend: number;
  destinationRank: number;
};

export type QuerySummary = {
  key: string;
  destination: string;
  category: string;
  scope: "destination" | "category";
  funnel: string;
  lang: string;
  level: string;
  cluster: string;
  text: string;
  volume: number;
  cpc: number;
  yoy: number;
  difficulty: number;
  spark: number[];
};

export type QueryFilters = {
  q?: string;
  category?: string;
  destination?: string;
  lang?: string;
  funnel?: string;
  level?: string;
  cluster?: string;
  sort?: "volume" | "cpc" | "yoy" | "difficulty" | "text";
  dir?: "asc" | "desc";
  limit?: number;
};
