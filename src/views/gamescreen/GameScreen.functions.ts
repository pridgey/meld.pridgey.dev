import { Game, SocketMessage, RoundPlayer } from "../../types";
import { v4 } from "uuid";
import { CraftMessage, RandomNumber } from "./../../utilities";
import { Settings } from "./../../config";
import { Words } from "./../../words";
import { SendMessage } from "react-use-websocket";

export const CreateNewGame = (): Game => {
  // First generate the easy code for users
  let gameCode = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < 6; i++) {
    gameCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  // Return the new Game Settings
  return {
    Code: gameCode,
    Key: v4(),
    Players: [],
    Deck: GenerateGameDeck(),
    GameState: "lobby",
    RoundInfo: [],
  };
};

export const HandleNewMessage = (
  message: SocketMessage<any>,
  gameSettings: Game | null,
  updateGameSettings: React.Dispatch<React.SetStateAction<Game | null>>,
  sendMessage: SendMessage
) => {
  if (
    gameSettings &&
    message.Sender !== "game" &&
    message.RefID === gameSettings.Code
  ) {
    switch (message.Action) {
      case "user_join_game":
        const joinResult = CanUserJoinGame(
          gameSettings,
          message?.Payload?.Nick,
          message?.Payload?.PlayerID
        );
        if (typeof joinResult === "boolean") {
          // New Player passed all the checks

          // Add the player if they're new
          if (
            !gameSettings?.Players?.some(
              (player) => player.PlayerID === message.Payload.PlayerID
            )
          ) {
            const gamePlayers = gameSettings?.Players;
            gamePlayers?.push({
              Nickname: message?.Payload?.Nick,
              PlayerID: message?.Payload?.PlayerID,
              Hand: gameSettings.Deck.slice(0, 10),
              TurnsPlayed: 0,
              Points: 0,
            });
            updateGameSettings({
              ...gameSettings,
              Players: gamePlayers,
            });
          }

          // Everything's good, tell the player they're in
          sendMessage(
            CraftMessage({
              Action: "user_join_game",
              RefID: message.Payload.PlayerID,
              Sender: "game",
              Payload: {
                Success: true,
                Code: gameSettings.Code,
                Key: gameSettings.Key,
                Hand: gameSettings.Deck.splice(0, 10),
              },
            })
          );
        } else {
          // Something went wrong with our join, let the player know why
          sendMessage(
            CraftMessage({
              Action: "user_join_game",
              RefID: message.Payload.PlayerID,
              Sender: "game",
              Payload: {
                Success: false,
                Error: joinResult as string,
              },
            })
          );
        }
        break;
      case "submit_word":
        let currentRound: RoundPlayer[] = gameSettings.RoundInfo;

        // Update player's submitted word
        currentRound
          .find((player) => player.PlayerID === message.Payload.PlayerID)
          ?.Words.push(message.Payload.Word);

        // Quick update the gameSettings
        updateGameSettings({
          ...gameSettings,
          RoundInfo: currentRound,
        });

        // Are we ready to guess?
        if (currentRound.some((player) => player.Words.length === 0)) {
          // Still have players with no words selected
          const remainingPlayer = currentRound.find(
            (player) => player.Words.length === 0
          );

          // ready next player
          sendMessage(
            CraftMessage({
              Action: "update_game_state",
              RefID: remainingPlayer?.PlayerID,
              Sender: "game",
              Payload: {
                PlayerGameState: "word-select",
              },
            })
          );
        } else {
          // All players have a word, let's move on
          currentRound.forEach((player) => {
            sendMessage(
              CraftMessage({
                Action: "update_game_state",
                RefID: player.PlayerID,
                Sender: "game",
                Payload: {
                  PlayerGameState: "guess-meld",
                },
              })
            );
          });
        }
        break;
    }
  }
};

export const CanUserJoinGame = (
  gameSettings: Game | null,
  NicknameToCheck: string,
  PlayerIDToCheck: string
) => {
  if (gameSettings) {
    // Have we hit our max players?
    if (gameSettings.Players?.length >= Settings.MAX_PLAYERS) {
      return "That game is full";
    }

    // Is there anyone with that name already?
    if (
      gameSettings.Players?.some(
        (player) =>
          player.Nickname === NicknameToCheck &&
          player.PlayerID !== PlayerIDToCheck
      )
    ) {
      return "That nickname is taken";
    }

    // If we're here we must be good
    return true;
  }
  // Game Settings doesn't exist
  return "Error Connecting to Game";
};

const GenerateGameDeck = () => {
  const generatedDeck: string[] = [];

  // Loop through words until we fill a deck with random words
  // This could probably be better
  while (generatedDeck.length !== 80) {
    // Generate a random number within the deck size
    const random = RandomNumber(0, Words.All.length);

    // Grab that random word
    const word = Words.All[random];

    // Check if the deck has this word already
    if (!generatedDeck.includes(word)) {
      // The deck doesn't have this word so add it
      generatedDeck.push(word);
    }
  }

  // When all is said and done, return the deck
  return generatedDeck;
};

export const StartRound = (sendMessage: SendMessage, GameSettings: Game) => {
  let updatedGameSettings: Game = GameSettings;
  if (GameSettings) {
    // Initialize new Round
    let newRound: RoundPlayer[] = [];

    // Pick two players
    const players = GameSettings.Players;
    // Sort the players by turns played
    players.sort((a, b) => (a.TurnsPlayed > b.TurnsPlayed ? 1 : -1));

    // Grab our first two
    newRound.push({
      PlayerID: players[0].PlayerID,
      Words: [],
      Guesses: [],
    });
    newRound.push({
      PlayerID: players[1].PlayerID,
      Words: [],
      Guesses: [],
    });

    updatedGameSettings.RoundInfo = newRound;

    // Tell the first two players that they're playing
    // Tell the rest that they're observers
    players.forEach((player, index) => {
      sendMessage(
        CraftMessage({
          Action: "update_game_state",
          RefID: player.PlayerID,
          Sender: "game",
          Payload: {
            PlayerGameState:
              index === 0
                ? "word-select" // player 1 gets to pick first
                : index === 1
                ? "word-wait" // player 2 has to wait for player 1
                : "observer", // everyone else is the observers for this round
          },
        })
      );
    });
  }
  return updatedGameSettings;
};
