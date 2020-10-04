type MessageActions =
  | "user_join_game"
  | "check_game_for_user"
  | "submit_word"
  | "update_game_state";

export type SocketMessage<T> = {
  Action: MessageActions;
  RefID?: string;
  Sender: "game" | "player";
  Payload: T;
};
