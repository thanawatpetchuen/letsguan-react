import { Player, MatchPlayer } from "./player";

export interface Fixture {
  id: string;
  date: Date;
  courts: Court[];
  matches: Match[];
  players: Player[];
  playerMatchCount: {
    [id: string]: number;
  };
}

export interface Court {
  id: string;
  name: string;
  numberOfPlayers: number;
}

export interface Match {
  id: string;
  status: number;
  players: MatchPlayer[];
  startTime: Date;
  endTime: Date;
  winnerSide: string;
  court: Court;
}

export interface CourtStatuses {
  [id: string]: {
    court: Court;
    match: Match;
  };
}

export enum StatusENUM {
  PENDING = 0,
  RUNNING = 1,
  END = 2,
}

const statusMap = {
  [StatusENUM.PENDING]: "PENDING",
  [StatusENUM.RUNNING]: "RUNNING",
  [StatusENUM.END]: "END",
};

export const getStatus = (m: Match) => {
  if (m) {
    return statusMap[m.status as StatusENUM];
  }
};
