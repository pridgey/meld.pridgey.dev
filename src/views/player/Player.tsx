import React, { useState } from "react";
import { Main } from "./Player.styles";
import { Join } from "./components";
import { User, UserGame, SocketMessage } from "./../../types";
import { GetUserInfo } from "./Player.functions";
import { CraftMessage } from "./../../utilities";

export const Player = () => {
  // Setup user state
  const [user] = useState<User>(GetUserInfo());
  // Setup Websocket
  const [socket, updateSocket] = useState<WebSocket>(
    new WebSocket(process.env.REACT_APP_WEBSOCKET || "")
  );
  // Setup game state that the user knows about
  const [gameInfo, updateGameInfo] = useState<UserGame>();

  // Error state
  const [currentError, setError] = useState("");

  // Socket stuff
  socket.onopen = () => {
    // Reconnect on close
    socket.onclose = () => {
      updateSocket(new WebSocket(process.env.REACT_APP_WEBSOCKET || ""));
    };

    // Listen for messages
    socket.onmessage = (event: MessageEvent<any>) => {
      const socketData: SocketMessage<any> = JSON.parse(event?.data);
      if (
        socketData?.RefID === user.PlayerID &&
        socketData?.Sender !== "player"
      ) {
        // This pertains to us
        switch (socketData?.Action) {
          case "user_join_game":
            if (socketData?.Payload?.Success) {
              // We've joined the game
              updateGameInfo({
                GameCode: socketData?.Payload?.Code,
                Key: socketData?.Payload?.Code,
                GameState: "lobby",
              });
            } else {
              // Something went wrong
              setError(socketData?.Payload?.Error);
            }
            break;
        }
      }
    };
  };

  const switchState = (state: string) => {
    switch (state) {
      case "lobby":
      default:
        return <div>Lobby</div>;
      case "observer":
        return <div>Observe</div>;
      case "active":
        return <div>Active</div>;
      case "judge":
        return <div>Judge</div>;
    }
  };

  return (
    <Main>
      {gameInfo ? (
        <>{switchState(gameInfo.GameState)}</>
      ) : (
        <Join
          Error={currentError}
          OnCompleted={(code: string, nick: string) => {
            setError("");
            // Attempt to join the game
            socket.send(
              CraftMessage({
                Action: "user_join_game",
                RefID: user.PlayerID,
                Sender: "player",
                Payload: {
                  Code: code,
                  Nick: nick.toUpperCase(),
                  PlayerID: user.PlayerID,
                },
              })
            );
          }}
        />
      )}
    </Main>
  );
};
