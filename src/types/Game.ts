type GamePlayer = {
  Nickname: string;
  PlayerID: string;
  Hand: string[];
  Points: number;
  TurnsPlayed: number;
};

export type GameState = "lobby" | "ongoing";

export type RoundPlayer = {
  PlayerID: string;
  Words: string[];
  Guesses: string[];
};

export type Game = {
  Code: string; // Easily identifiable 6-digit code for people to join games
  Key: string; // Much more intricate identifier for a game
  Players: GamePlayer[]; // The players of the game
  Deck: string[]; // A deck of words the players will draw from
  GameState: GameState; // The current state of the game screen
  RoundInfo: RoundPlayer[]; // Contains the information for a round of the game
};
