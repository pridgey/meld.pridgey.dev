import React, { useState } from "react";
import { displayPlayerHand } from "./SelectWord.functions";

type SelectWordProps = {
  Hand?: string[];
  OnWordSelect: (word: string) => void;
};

export const SelectWord = ({ Hand, OnWordSelect }: SelectWordProps) => {
  // Configure Word Selection State
  const [wordSelected, setWordSelected] = useState("");

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {!!wordSelected.length ? (
        <h1>You picked {wordSelected}</h1>
      ) : (
        <>
          <h1>You're Playing!</h1>
          <h2>Pick a word to play</h2>
          {displayPlayerHand(Hand).map((card, index) => {
            return (
              <button
                onClick={() => {
                  OnWordSelect(card);
                  setWordSelected(card);
                }}
                key={`wordselect-${index}`}
              >
                {card}
              </button>
            );
          })}
        </>
      )}
    </div>
  );
};
