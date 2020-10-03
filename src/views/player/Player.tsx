import React, { useState, useEffect } from "react";
import { Main } from "./Player.styles";
import { Active, Join, Lobby } from "./components";
import { User, UserGame, SocketMessage } from "./../../types";
import { GenerateNewPlayerGameState, GetUserInfo } from "./Player.functions";
import { CraftMessage } from "./../../utilities";
import useWebSocket from "react-use-websocket";

export const Player = () => {
  // Setup user state
  const [user] = useState<User>(GetUserInfo());
  // Setup game state that the user knows about
  const [gameInfo, updateGameInfo] = useState<UserGame>();

  const { sendMessage } = useWebSocket(process.env.REACT_APP_WEBSOCKET || "", {
    onMessage: (event: MessageEvent<any>) => {
      handleMessage(event);
    },
  });

  console.log("First Step:", gameInfo);

  // Setup gameInfo on first load
  useEffect(() => {
    console.log("useEffect");
    updateGameInfo(GenerateNewPlayerGameState());
  }, []);

  // Error state
  const [currentError, setError] = useState("");

  // Handle Messages
  const handleMessage = (event: MessageEvent<any>) => {
    const socketData: SocketMessage<any> = JSON.parse(event?.data);
    if (
      socketData?.RefID === user.PlayerID &&
      socketData?.Sender !== "player" &&
      gameInfo
    ) {
      // This pertains to us
      switch (socketData?.Action) {
        // ========= user_join_game =========
        // Action For the user joining the game
        // Will accept a GameCode and Key to identify the game in question
        // And then sets the user to be in the lobby
        case "user_join_game":
          console.log("user join game", gameInfo);
          if (socketData?.Payload?.Success) {
            // We've joined the game
            updateGameInfo({
              ...gameInfo,
              GameCode: socketData?.Payload?.Code,
              Key: socketData?.Payload?.Code,
              GameState: "lobby",
              Hand: socketData?.Payload?.Hand,
            });
          } else {
            // Something went wrong
            setError(socketData?.Payload?.Error);
          }
          break;
        // ========= update_game_state =========
        // Action for the game updating the user state
        // The game will run all necessary logic and will simply
        // Inform the user as to what state they're in
        case "update_game_state":
          // Update the player game state
          updateGameInfo({
            ...gameInfo,
            GameState: socketData.Payload.PlayerGameState,
          });
          break;
      }
    }
  };

  console.log("gameInfo: ", gameInfo);

  // A switch for returning the proper player view depending on the state
  const switchState = (state?: string) => {
    if (state) {
      switch (state) {
        case "join":
        default:
          return (
            <Join
              Error={currentError}
              OnCompleted={(code: string, nick: string) => {
                setError("");
                // Attempt to join the game
                sendMessage(
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
          );
        case "lobby":
          return <Lobby />;
        case "observer":
          return <div>Observe</div>;
        case "active":
          return <Active Hand={gameInfo?.Hand} />;
        case "judge":
          return <div>Judge</div>;
      }
    }
  };

  return <Main>{switchState(gameInfo?.GameState)}</Main>;
};
