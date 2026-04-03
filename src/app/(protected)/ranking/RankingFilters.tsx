"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface RankingFiltersProps {
  cities: string[];
  currentCity?: string;
}

export default function RankingFilters({ cities, currentCity }: RankingFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCityChange = (city: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (city) {
      params.set("city", city);
    } else {
      params.delete("city");
    }
    router.push(`/ranking?${params.toString()}`);
  };

  return (
    <select
      value={currentCity || ""}
      onChange={(e) => handleCityChange(e.target.value)}
      className="px-4 py-2 rounded-lg text-sm outline-none"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text)",
      }}
    >
      <option value="">Todas as cidades</option>
      {cities.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  );
}
