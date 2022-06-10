export interface Player {
  id: string;
  name: string;
  rank: string;
}

export interface MatchPlayer {
    player: Player
    side: string
}
