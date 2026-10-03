'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, type Match, type Standings } from '@/lib/api';
import { getCurrentUser } from '@/lib/currentUser';

function participantNames(m: Match, team: number) {
  return m.participants
    .filter((p) => p.team === team)
    .map((p) => p.user?.fullName ?? p.reserveName ?? 'Unknown')
    .join(' & ');
}

export default function MatchesPanel({
  eventId,
  courtCount,
  matches,
}: {
  eventId: string;
  courtCount: number;
  matches: Match[];
}) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [standings, setStandings] = useState<Standings | null>(null);
  const [scores, setScores] = useState<Record<string, { t1: string; t2: string }>>({});

  useEffect(() => {
    if (matches.length === 0) return;
    api.getStandings(eventId).then(setStandings).catch(() => setStandings(null));
  }, [eventId, matches]);

  const rounds = [...new Set(matches.map((m) => m.roundNumber))].sort((a, b) => a - b);

  const nameByKey: Record<string, string> = {};
  for (const m of matches) {
    for (const p of m.participants) {
      const key = p.userId ?? `reserve:${p.reserveName}`;
      nameByKey[key] = p.user?.fullName ?? p.reserveName ?? 'Unknown';
    }
  }

  async function generate() {
    setGenerating(true);
    setError(null);
    try {
      await api.generateMatches(eventId, courtCount);
      router.refresh();
    } catch {
      setError('Could not generate matches — make sure enough RSVPs are approved.');
    } finally {
      setGenerating(false);
    }
  }

  async function submitScore(matchId: string) {
    const user = getCurrentUser();
    const entry = scores[matchId];
    if (!user || !entry) return;
    try {
      await api.submitScore(matchId, {
        submittedBy: user.id,
        team1Score: Number(entry.t1),
        team2Score: Number(entry.t2),
      });
      router.refresh();
    } catch {
      setError('Could not submit that score.');
    }
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-medium">Matches</h2>
        <button
          className="rounded bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
          onClick={generate}
          disabled={generating}
        >
          {matches.length > 0
            ? generating
              ? 'Regenerating…'
              : 'Regenerate matches'
            : generating
              ? 'Generating…'
              : 'Generate matches'}
        </button>
      </div>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {matches.length === 0 && (
        <p className="text-sm text-gray-500">
          No matches yet. Approve RSVPs above, then generate a round robin.
        </p>
      )}

      {rounds.map((round) => (
        <div key={round} className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-gray-500">Round {round}</h3>
          <ul className="divide-y divide-gray-200">
            {matches
              .filter((m) => m.roundNumber === round)
              .map((m) => {
                const score = m.scores[m.scores.length - 1];
                return (
                  <li key={m.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <span>
                      Court {m.courtNumber}: {participantNames(m, 1)} vs {participantNames(m, 2)}
                    </span>
                    {score ? (
                      <span className="font-medium">
                        {score.team1Score} – {score.team2Score}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <input
                          className="w-12 rounded border px-1 py-0.5 text-center"
                          placeholder="0"
                          value={scores[m.id]?.t1 ?? ''}
                          onChange={(e) =>
                            setScores((s) => ({ ...s, [m.id]: { t1: e.target.value, t2: s[m.id]?.t2 ?? '' } }))
                          }
                        />
                        <span>–</span>
                        <input
                          className="w-12 rounded border px-1 py-0.5 text-center"
                          placeholder="0"
                          value={scores[m.id]?.t2 ?? ''}
                          onChange={(e) =>
                            setScores((s) => ({ ...s, [m.id]: { t1: s[m.id]?.t1 ?? '', t2: e.target.value } }))
                          }
                        />
                        <button
                          className="ml-1 text-xs underline"
                          onClick={() => submitScore(m.id)}
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      ))}

      {standings && Object.keys(standings).length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold text-gray-500">Standings</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="py-1">Player</th>
                <th className="py-1 text-right">W</th>
                <th className="py-1 text-right">L</th>
                <th className="py-1 text-right">Point diff</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(standings)
                .sort((a, b) => b[1].wins - a[1].wins || b[1].pointDiff - a[1].pointDiff)
                .map(([key, s]) => (
                  <tr key={key} className="border-t">
                    <td className="py-1">{nameByKey[key] ?? key}</td>
                    <td className="py-1 text-right">{s.wins}</td>
                    <td className="py-1 text-right">{s.losses}</td>
                    <td className="py-1 text-right">{s.pointDiff}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
