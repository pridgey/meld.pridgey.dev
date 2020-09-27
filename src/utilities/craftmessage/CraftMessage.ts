import { SocketMessage } from "./../../types";

export const CraftMessage = (Message: SocketMessage<any>) => {
  return JSON.stringify(Message);
};
