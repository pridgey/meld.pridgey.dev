import React, { useState } from "react";
import { Game } from "../../types";
import { CreateNewGame, HandleNewMessage } from "./GameScreen.functions";

export const GameScreen = () => {
  // Setup Game state
  const [gameSettings, updateGameSettings] = useState<Game | null>(
    CreateNewGame()
  );
  // Setup Websocket
  const [socket, updateSocket] = useState<WebSocket>(
    new WebSocket(process.env.REACT_APP_WEBSOCKET || "")
  );

  // Setup socket to listen to messages
  socket.onopen = () => {
    // Reconnect on close
    socket.onclose = () => {
      updateSocket(new WebSocket(process.env.REACT_APP_WEBSOCKET || ""));
    };

    socket.onmessage = (event: MessageEvent<any>) => {
      // Receiving a message
      const socketData = JSON.parse(event?.data);

      HandleNewMessage(socketData, gameSettings, updateGameSettings, socket);
    };
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>{gameSettings?.Code}</h1>
      <h2>Join over at {window.location.host}/play</h2>
      {(gameSettings?.Players?.length || 0) >= 3 && (
        <button type="button">Start Game</button>
      )}
      <p>Game Settings:</p>
      <ul>
        <li>Code: {gameSettings?.Code}</li>
        <li>Key: {gameSettings?.Key}</li>
        <li>Players:</li>
        <ul>
          {gameSettings?.Players?.map((player, index) => {
            return (
              <>
                <li key={`n-${index}`}>{player.Nickname}</li>
                <ul key={`u-${index}`}>
                  <li key={`i-${index}`}>{player.PlayerID}</li>
                </ul>
              </>
            );
          })}
        </ul>
      </ul>
    </div>
  );
};
