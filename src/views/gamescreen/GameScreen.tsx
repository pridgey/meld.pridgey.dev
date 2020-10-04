import React, { useState } from "react";
import { Game, GameState } from "../../types";
import {
  CreateNewGame,
  HandleNewMessage,
  StartRound,
} from "./GameScreen.functions";
import { Lobby } from "./components";
import useWebSocket from "react-use-websocket";

export const GameScreen = () => {
  // Setup Game state
  const [gameSettings, updateGameSettings] = useState<Game | null>(
    CreateNewGame()
  );
  // Setup Websocket
  const { sendMessage } = useWebSocket(process.env.REACT_APP_WEBSOCKET || "", {
    onMessage: (event: MessageEvent<any>) => {
      HandleNewMessage(
        JSON.parse(event.data),
        gameSettings,
        updateGameSettings,
        sendMessage
      );
    },
  });

  // Switch function to return component base on game state
  const gameStateSwitch = (gameState?: GameState) => {
    if (gameSettings) {
      switch (gameState) {
        case "lobby":
        default:
          return (
            <Lobby
              GameCode={gameSettings.Code}
              Players={gameSettings.Players.map((player) => player.Nickname)}
              OnGameStart={() => {
                // Start the game jeeves
                if (gameSettings) {
                  // Begin a round using the new updated settings
                  const updatedGameSettings: Game = StartRound(
                    sendMessage,
                    gameSettings
                  );

                  // Set game state to non-lobby
                  updateGameSettings({
                    ...updatedGameSettings,
                    GameState: "ongoing",
                  });
                }
              }}
            />
          );
        case "ongoing":
          return (
            <div>
              <h1>ongoing</h1>
              <h2>{gameSettings.RoundInfo[0]?.Words[0] || ""}</h2>
              <h2>{gameSettings.RoundInfo[1]?.Words[0] || ""}</h2>
            </div>
          );
      }
    }
  };

  return <>{gameStateSwitch(gameSettings?.GameState)}</>;
};
