type GamePlayer = {
  Nickname: string;
  PlayerID: string;
};

export type Game = {
  Code: string; // Easily identifiable 6-digit code for people to join games
  Key: string; // Much more intricate identifier for a game
  Players: GamePlayer[]; // The players of the game
};
