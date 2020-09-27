export type User = {
  PlayerID: string; // A uuid identifying this specific user
  Nickname?: string; // The user's way of identifying themselves
};

export type UserGame = {
  GameCode: string;
  Key: string;
  GameState: "lobby" | "observer" | "active" | "judge";
};
