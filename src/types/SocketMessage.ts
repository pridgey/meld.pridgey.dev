type MessageActions = "user_join_game" | "check_game_for_user";

export type SocketMessage<T> = {
  Action: MessageActions;
  RefID?: string;
  Sender: "game" | "player";
  Payload: T;
};
