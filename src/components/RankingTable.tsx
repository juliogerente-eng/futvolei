import RatingBadge from "./RatingBadge";

interface RankingEntry {
  position: number;
  id: string;
  name: string;
  city: string;
  avatar_url: string | null;
  rating: number;
}

interface RankingTableProps {
  entries: RankingEntry[];
  highlightUserId?: string;
}

export default function RankingTable({
  entries,
  highlightUserId,
}: RankingTableProps) {
  if (entries.length === 0) {
    return (
      <div
        className="text-center py-12 rounded-xl"
        style={{
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-secondary)",
        }}
      >
        <p className="text-4xl mb-3">🏐</p>
        <p>Nenhum atleta no ranking ainda</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      <table className="w-full">
        <thead>
          <tr
            style={{
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <th className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 text-text-secondary w-16">
              #
            </th>
            <th className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 text-text-secondary">
              Atleta
            </th>
            <th className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 text-text-secondary hidden sm:table-cell">
              Cidade
            </th>
            <th className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 text-text-secondary">
              Nível
            </th>
            <th className="text-right text-xs font-semibold uppercase tracking-wider px-4 py-3 text-text-secondary">
              Rating
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const isHighlighted = entry.id === highlightUserId;

            return (
              <tr
                key={entry.id}
                className="transition-colors"
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  background: isHighlighted
                    ? "var(--color-primary-glow)"
                    : "transparent",
                }}
              >
                {/* Position */}
                <td className="px-4 py-3">
                  <span
                    className="font-bold text-lg"
                    style={{
                      color:
                        entry.position <= 3
                          ? entry.position === 1
                            ? "#F59E0B"
                            : entry.position === 2
                            ? "#94A3B8"
                            : "#CD7F32"
                          : "var(--color-text-secondary)",
                    }}
                  >
                    {entry.position <= 3
                      ? ["🥇", "🥈", "🥉"][entry.position - 1]
                      : entry.position}
                  </span>
                </td>

                {/* Athlete */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{
                        background: "var(--color-bg-hover)",
                        color: "var(--color-primary)",
                      }}
                    >
                      {entry.avatar_url ? (
                        <img
                          src={entry.avatar_url}
                          alt={entry.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        entry.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="font-medium text-sm">{entry.name}</span>
                  </div>
                </td>

                {/* City */}
                <td
                  className="px-4 py-3 text-sm hidden sm:table-cell"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {entry.city}
                </td>

                {/* Level */}
                <td className="px-4 py-3">
                  <RatingBadge rating={entry.rating} size="sm" showRating={false} />
                </td>

                {/* Rating */}
                <td className="px-4 py-3 text-right">
                  <span className="font-mono font-bold text-sm">
                    {entry.rating}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
