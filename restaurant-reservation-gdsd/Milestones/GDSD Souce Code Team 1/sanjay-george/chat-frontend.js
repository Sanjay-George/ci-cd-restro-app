/*
** File: /src/Pages/Chat/Chat.js
*/

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Input, Modal, Row, Col, Avatar, Button, List, Skeleton } from "antd";
import Cookies from "universal-cookie";

import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  Sidebar,
  Search,
  Conversation,
  ConversationList,
  ConversationHeader,
  TypingIndicator,
  MessageSeparator,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { useQuery  } from "react-query";
import {
  getListOfConnectedRestaurants,
  getChatMessages,
} from "../../query/chat";

const socketUrl = process.env.REACT_APP_SOCKET_URL || "127.0.0.1:5001";
const socket = io(socketUrl, {
  auth: {
    token: localStorage.getItem("token"),
  },
});

export default function ChatWrapper({ showModal, setShowModal, chatDetails }) {
  const { chatId, userId, restaurantOwnerId, restaurantId, recipientLastName } =
    chatDetails;

  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");

  const { data: chatData, isLoading } = useQuery(
    ["chats", { chatId }],
    () => getChatMessages(chatId),
    {
      enabled: !!chatId,
    }
  );

  useEffect(() => {
    socket.on("chat-s2c", msg => {
      console.log(msg);

      if (restaurantOwnerId === msg.senderId) {
        setChatMessages(chatMessages => [...chatMessages, msg]);
      }
    });

    return () => {
      socket.removeAllListeners("chat-s2c");
    }
  }, [restaurantOwnerId]);

  useEffect(() => {
    console.log(chatData?.data);
    if (!chatData || !chatData.data.length) {
      return;
    }
    setChatMessages(chatData.data);
  }, [chatData]);

  const handleSendMessageClick = () => {
    if (!message.length || restaurantOwnerId <= 0) return;

    const messageObj = {
      // token: userToken,
      message: message,
      chatId: chatId,
      senderId: userId,
      destinationId: restaurantOwnerId,
      timestamp: Date.now(),
    };

    setChatMessages((chatMessages) => [...chatMessages, messageObj]);

    console.log(messageObj);
    socket.emit("chat-c2s", messageObj);

    setMessage("");
  };

  return (
    <>
      <Modal
        open={showModal}
        closable={false}
        onOk={handleSendMessageClick}
        onCancel={() => setShowModal(false)}
        okText="Send"
      >
        <div
          style={{
            height: 450
          }}
        >
          <MainContainer responsive>
          
            <ChatContainer>
              <ConversationHeader>
                <ConversationHeader.Back />
                <ConversationHeader.Content
                  userName={recipientLastName}
                />
              </ConversationHeader>
              {chatMessages && chatMessages.length && (
                <MessageList>

                  {chatMessages.map((item, index) => {
                    const direction =
                      item.senderId === userId ? "outgoing" : "incoming";
                    const sender =
                      item.senderId === userId ? "You" : recipientLastName;
                    return (
                      <Message
                        key={index}
                        model={{
                          message: item.message,
                          // sentTime: "15 mins ago",
                          sender: sender,
                          direction: direction,
                          position: "single",
                        }}
                      ></Message>
                    );
                  })}
                </MessageList>
              )}

              <MessageInput
                placeholder="Type message here"
                value={message}
                onChange={(val) => setMessage(val)}
                onSend={handleSendMessageClick}
                style={{ textAlign: "left" }}
                attachButton={false}
                sendButton={false}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      </Modal>
    </>
  );
}


/*
** File: /src/query/
*/

import http from "../utils/http";

export function getListOfConnectedRestaurants(userId) {
  return http({
    url: `/chats/connected-users/`,
    method: "get",
  });
}

export function getChatMessages(chatId) {
    return http({
      url: `/chats/${chatId}/`,
      method: "get",
    });
  }