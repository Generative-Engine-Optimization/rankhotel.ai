import type { Locale } from "./config";
import citiesJson from "../data/observatory/cities.json";
import citySnapshotsJson from "../data/observatory/city-snapshots.json";
import citationSourcesJson from "../data/observatory/citation-sources.json";
import hotelSnapshotsJson from "../data/observatory/hotel-snapshots.json";
import hotelsJson from "../data/observatory/hotels.json";
import promptsJson from "../data/observatory/prompts.json";

export const ENGINES = ["ChatGPT", "Gemini", "Perplexity", "Claude"];
export const MENTION_WEIGHT = 0.55;
export const POSITION_WEIGHT = 0.45;
export const WINDOW_DAYS = 30;

export type City = (typeof citiesJson)[number];
export type Hotel = (typeof hotelsJson)[number];
export type CitySnapshot = (typeof citySnapshotsJson)[number];
export type HotelSnapshot = (typeof hotelSnapshotsJson)[number];
export type CitationSource = (typeof citationSourcesJson)[number];
export type Prompt = (typeof promptsJson)[number];

export type RankedHotel = {
  hotel: Hotel;
  stats: HotelSnapshot;
};

export type CityView = {
  city: City;
  snapshot: CitySnapshot;
  hotels: RankedHotel[];
  sources: CitationSource[];
};

const cities = [...citiesJson].sort((a, b) => a.sort - b.sort);
const hotels = [...hotelsJson];
const citySnapshots = [...citySnapshotsJson];
const hotelSnapshots = [...hotelSnapshotsJson].sort((a, b) => a.rank - b.rank);
const citationSources = [...citationSourcesJson].sort(
  (a, b) => b.occurrences - a.occurrences,
);
const prompts = [...promptsJson];

export function listCities(): City[] {
  return cities;
}

export function listPrompts(): Prompt[] {
  return prompts;
}

export function findCity(locale: Locale, slug: string): City | undefined {
  return cities.find((city) => city.slug[locale] === slug);
}

export function localizedCityPaths(locale: Locale) {
  return cities.map((city) => ({ params: { city: city.slug[locale] } }));
}

export function hotelName(key: string): string {
  return hotels.find((hotel) => hotel.key === key)?.name ?? key;
}

export function hotelsOf(cityKey: string): RankedHotel[] {
  return hotelSnapshots
    .filter((stat) => stat.city === cityKey)
    .map((stats) => ({
      stats,
      hotel: hotels.find((hotel) => hotel.key === stats.hotel),
    }))
    .filter((entry): entry is RankedHotel => Boolean(entry.hotel));
}

export function cityView(city: City): CityView | undefined {
  const snapshot = citySnapshots.find((row) => row.city === city.key);
  if (!snapshot) return undefined;
  return {
    city,
    snapshot,
    hotels: hotelsOf(city.key),
    sources: citationSources.filter((source) => source.city === city.key),
  };
}

export function italyView() {
  const rows = cities
    .map((city) => {
      const snapshot = citySnapshots.find((row) => row.city === city.key);
      return snapshot ? { city, snapshot } : null;
    })
    .filter((row): row is { city: City; snapshot: CitySnapshot } =>
      Boolean(row),
    );

  const cityByKey = new Map(cities.map((city) => [city.key, city]));
  const hotelByKey = new Map(hotels.map((hotel) => [hotel.key, hotel]));
  const leaderboard = hotelSnapshots
    .map((stats) => ({
      stats,
      city: cityByKey.get(stats.city),
      hotel: hotelByKey.get(stats.hotel),
    }))
    .filter(
      (
        entry,
      ): entry is { stats: HotelSnapshot; city: City; hotel: Hotel } =>
        Boolean(entry.city && entry.hotel),
    )
    .sort(
      (a, b) =>
        b.stats.percentile - a.stats.percentile ||
        b.stats.score - a.stats.score,
    )
    .slice(0, 10);

  return {
    cities: rows.sort(
      (a, b) => b.snapshot.aggregatorShare - a.snapshot.aggregatorShare,
    ),
    hotelsMonitored: cities.reduce((sum, city) => sum + city.hotelsMonitored, 0),
    responsesAnalyzed: rows.reduce(
      (sum, entry) => sum + entry.snapshot.responsesAnalyzed,
      0,
    ),
    aggregatorShare:
      rows.reduce((sum, entry) => sum + entry.snapshot.aggregatorShare, 0) /
      rows.length,
    leaderboard,
  };
}
