import React from "react";

type LobbyProps = {
  GameCode: string;
  Players: string[];
  OnGameStart: () => void;
};

export const Lobby = ({ GameCode, Players, OnGameStart }: LobbyProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>{GameCode}</h1>
      <h2>Join over at {window.location.host}/play</h2>
      {(Players.length || 0) >= 3 && (
        <button type="button" onClick={() => OnGameStart()}>
          Start Game
        </button>
      )}
      <ul>
        {Players.map((player, index) => (
          <li key={`pl-${index}`}>{player}</li>
        ))}
      </ul>
    </div>
  );
};
