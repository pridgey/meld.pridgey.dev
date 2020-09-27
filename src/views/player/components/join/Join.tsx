import React from "react";
import { strings } from "./Join.strings";

type JoinProps = {
  Error: string;
  OnCompleted: (code: string, nick: string) => void;
};

export const Join = ({ Error, OnCompleted }: JoinProps) => {
  return (
    <div>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onSubmit={(event: React.FormEvent) => {
          // HTML! Stop it!
          event.preventDefault();

          // Get our values
          const code = (document.getElementById("code") as HTMLInputElement)
            ?.value;
          const nick = (document.getElementById("nick") as HTMLInputElement)
            ?.value;

          // Send the needed info back to the Player component
          OnCompleted(code, nick);
        }}
      >
        <h1>{strings.JoinTheGame}</h1>
        {!!Error.length && <h2>{Error}</h2>}
        <label htmlFor="code" style={{ display: "block" }}>
          {strings.Gamecode}
        </label>
        <input
          id="code"
          style={{ margin: "15px 0px" }}
          type="text"
          name="code"
          placeholder={strings.GamecodePlaceholder}
          maxLength={6}
        />
        <label htmlFor="nick" style={{ display: "block" }}>
          {strings.Nickname}
        </label>
        <input
          id="nick"
          style={{ margin: "15px 0px" }}
          type="text"
          name="nick"
          placeholder={strings.NicknamePlaceholder}
          maxLength={15}
        />
        <button type="submit">{strings.Ready}</button>
      </form>
    </div>
  );
};
