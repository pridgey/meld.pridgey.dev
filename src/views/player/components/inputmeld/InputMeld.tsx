import React, { useRef } from "react";

type InputMeldProps = {
  WordOne: string;
  WordTwo: string;
  OnInputMeld: (meld: string) => void;
};

export const InputMeld = ({
  WordOne,
  WordTwo,
  OnInputMeld,
}: InputMeldProps) => {
  const inputRef = useRef(document.createElement("input"));
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>The words are:</h1>
      <h2>
        {WordOne} & {WordTwo}
      </h2>
      <label htmlFor="meld">Input your Meld:</label>
      <input
        type="text"
        id="meld"
        ref={inputRef}
        placeholder="Maybe something like 'candlestick'?"
      />
      <button onClick={() => OnInputMeld(inputRef.current.value)}>
        Submit Meld
      </button>
    </div>
  );
};
