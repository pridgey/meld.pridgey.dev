export type User = {
  PlayerID: string; // A uuid identifying this specific user
  Nickname?: string; // The user's way of identifying themselves
};

export type GameStates =
  | "join"
  | "lobby"
  | "observer"
  | "word-select"
  | "word-wait"
  | "guess-meld"
  | "judge";

export type GameRound = {
  WordOne: string;
  WordTwo: string;
};

export type UserGame = {
  GameCode: string;
  Key: string;
  GameState: GameStates;
  Hand: string[];
  CurrentRound?: GameRound;
};
