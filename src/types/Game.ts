type GamePlayer = {
  Nickname: string;
  PlayerID: string;
  Hand: string[];
  Points: number;
  TurnsPlayed: number;
};

export type Game = {
  Code: string; // Easily identifiable 6-digit code for people to join games
  Key: string; // Much more intricate identifier for a game
  Players: GamePlayer[]; // The players of the game
  Deck: string[]; // A deck of words the players will draw from
};
