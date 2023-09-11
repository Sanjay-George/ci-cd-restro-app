import http from "../utils/http";

export function getListOfConnectedRestaurants(userId) {
  return http({
    url: `/chats/v2/connected-users/`,
    method: "get",
  });
}

export function getChatMessages(chatId) {
    return http({
      url: `/chats/${chatId}/`,
      method: "get",
    });
  }