'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, type Match, type Standings } from '@/lib/api';
import { getCurrentUser } from '@/lib/currentUser';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState, Notice } from '@/components/ui/Feedback';
import { Input } from '@/components/ui/Field';

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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold">Matches</h2>
        <Button onClick={generate} disabled={generating}>
          {matches.length > 0
            ? generating
              ? 'Regenerating…'
              : 'Regenerate matches'
            : generating
              ? 'Generating…'
              : 'Generate matches'}
        </Button>
      </div>
      {error && <Notice>{error}</Notice>}

      {matches.length === 0 && (
        <EmptyState title="No matches yet">
          Approve RSVPs above, then generate a round robin.
        </EmptyState>
      )}

      {rounds.map((round) => (
        <div key={round} className="mb-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-sun">
            Round {round}
          </h3>
          <Card className="p-0">
            <ul className="divide-y divide-line">
              {matches
                .filter((m) => m.roundNumber === round)
                .map((m) => {
                  const score = m.scores[m.scores.length - 1];
                  return (
                    <li
                      key={m.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm"
                    >
                      <span>
                        <span className="mr-2 rounded-md bg-leaf px-2 py-0.5 text-xs font-semibold">
                          Court {m.courtNumber}
                        </span>
                        {participantNames(m, 1)} <span className="text-muted">vs</span>{' '}
                        {participantNames(m, 2)}
                      </span>
                      {score ? (
                        <span className="font-display text-lg font-bold text-lime">
                          {score.team1Score} – {score.team2Score}
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Input
                            aria-label="Team 1 score"
                            inputMode="numeric"
                            className="w-16 text-center"
                            placeholder="0"
                            value={scores[m.id]?.t1 ?? ''}
                            onChange={(e) =>
                              setScores((s) => ({
                                ...s,
                                [m.id]: { t1: e.target.value, t2: s[m.id]?.t2 ?? '' },
                              }))
                            }
                          />
                          <span className="text-muted">–</span>
                          <Input
                            aria-label="Team 2 score"
                            inputMode="numeric"
                            className="w-16 text-center"
                            placeholder="0"
                            value={scores[m.id]?.t2 ?? ''}
                            onChange={(e) =>
                              setScores((s) => ({
                                ...s,
                                [m.id]: { t1: s[m.id]?.t1 ?? '', t2: e.target.value },
                              }))
                            }
                          />
                          <Button variant="secondary" size="sm" onClick={() => submitScore(m.id)}>
                            Save
                          </Button>
                        </div>
                      )}
                    </li>
                  );
                })}
            </ul>
          </Card>
        </div>
      ))}

      {standings && Object.keys(standings).length > 0 && (
        <div className="mt-8">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-sun">Standings</h3>
          <Card className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted">
                  <th className="px-5 py-3 font-medium">Player</th>
                  <th className="px-3 py-3 text-right font-medium">W</th>
                  <th className="px-3 py-3 text-right font-medium">L</th>
                  <th className="px-5 py-3 text-right font-medium">Point diff</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(standings)
                  .sort((a, b) => b[1].wins - a[1].wins || b[1].pointDiff - a[1].pointDiff)
                  .map(([key, s], i) => (
                    <tr key={key} className="border-t border-line">
                      <td className="px-5 py-3 font-medium">
                        {i === 0 && <span aria-hidden>🥇 </span>}
                        {nameByKey[key] ?? key}
                      </td>
                      <td className="px-3 py-3 text-right text-lime">{s.wins}</td>
                      <td className="px-3 py-3 text-right">{s.losses}</td>
                      <td className="px-5 py-3 text-right">{s.pointDiff}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </section>
  );
}
