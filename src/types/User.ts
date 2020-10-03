export type User = {
  PlayerID: string; // A uuid identifying this specific user
  Nickname?: string; // The user's way of identifying themselves
};

export type GameStates = "join" | "lobby" | "observer" | "active" | "judge";

export type UserGame = {
  GameCode: string;
  Key: string;
  GameState: GameStates;
  Hand: string[];
};
