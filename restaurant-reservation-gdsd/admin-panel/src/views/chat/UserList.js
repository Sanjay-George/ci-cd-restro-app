import React, { useState, useEffect } from "react";

import {
  MainContainer,
  ChatContainer,
  Sidebar,
  Search,
  Conversation,
  ConversationList,
  ConversationHeader,

} from "@chatscope/chat-ui-kit-react";
import { useQuery } from "react-query";
import {
  getListOfConnectedRestaurants,
  getChatMessages,
} from "../../query/chat";

export default function UserList({setChatId, setChatMeta, chatId}) {
  const userToken = localStorage.getItem("token");
  const userid = 1;

  const { isLoading, data: users } = useQuery(
    ["connected-users", { userid }],
    () => getListOfConnectedRestaurants(userid)
  );

  const handleUserChatClick = ({
    chatId,
    userId,
    restaurantOwnerId,
    firstName,
    lastName,
  }) => {
    setChatId(chatId);
    setChatMeta({
        chatId: chatId,
        recipientFirstName: firstName,
        recipientLastName: lastName,
        recipientId: userId,
        userId: restaurantOwnerId,
    })
  };

  if (isLoading) {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  }
  if (!users?.data.length) {
    return (
      <ConversationList>
        <Conversation name="" info="No conversations yet!"></Conversation>
      </ConversationList>
    );
  }

  return (
    <ConversationList>
      {users?.data.map((item) => {
        return (
          <Conversation
            key={item.chatId}
            name={item.lastName}
            onClick={() => {
              handleUserChatClick(item);
            }}
            active={item.chatId === chatId}
          ></Conversation>
        );
      })}
    </ConversationList>
  );
}
