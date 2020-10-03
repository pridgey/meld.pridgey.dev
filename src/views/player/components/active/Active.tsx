import React from "react";
import { displayPlayerHand } from "./Active.functions";

type ActiveProps = {
  Hand?: string[];
};

export const Active = ({ Hand }: ActiveProps) => {
  console.log("Hand:", Hand);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>You're Playing!</h1>
      <h2>Pick a word to play</h2>
      <ul>
        {displayPlayerHand(Hand).map((card, index) => {
          return <li key={`c-${index}`}>{card}</li>;
        })}
      </ul>
    </div>
  );
};
