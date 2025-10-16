import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/message.constants";

export function formatMessage(message: ERROR_MESSAGES | SUCCESS_MESSAGES, itemName: string): string {
  return message.replace('{itemName}', itemName);
}