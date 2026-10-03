// Pure helper for generating round-robin pairings for singles play.
// Rotating-partners / fixed-pairs formats build on the same idea and
// can be added here as the format is implemented.

export interface PlayerRef {
  userId?: string;
  reserveName?: string;
}

export interface GeneratedMatch {
  roundNumber: number;
  courtNumber: number;
  team1: PlayerRef[];
  team2: PlayerRef[];
}

/**
 * Generates a simple singles round-robin schedule across the given
 * number of courts. Players rest when the field doesn't divide evenly.
 */
export function generateSinglesRoundRobin(
  players: PlayerRef[],
  courtCount: number,
): GeneratedMatch[] {
  const matches: GeneratedMatch[] = [];
  const n = players.length;
  if (n < 2) return matches;

  // Round-robin pairing via the standard "circle method".
  const rounds = n % 2 === 0 ? n - 1 : n;
  const list = [...players];
  if (list.length % 2 !== 0) list.push({ reserveName: 'BYE' });

  const half = list.length / 2;
  for (let round = 0; round < rounds; round++) {
    const roundPairs: [PlayerRef, PlayerRef][] = [];
    for (let i = 0; i < half; i++) {
      const a = list[i];
      const b = list[list.length - 1 - i];
      if (a.reserveName !== 'BYE' && b.reserveName !== 'BYE') {
        roundPairs.push([a, b]);
      }
    }
    roundPairs.slice(0, courtCount).forEach((pair, courtIdx) => {
      matches.push({
        roundNumber: round + 1,
        courtNumber: courtIdx + 1,
        team1: [pair[0]],
        team2: [pair[1]],
      });
    });
    // Rotate: keep first player fixed, rotate the rest.
    list.splice(1, 0, list.pop() as PlayerRef);
  }
  return matches;
}
