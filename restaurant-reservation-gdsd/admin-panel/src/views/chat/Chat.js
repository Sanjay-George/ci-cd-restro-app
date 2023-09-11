import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
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
} from '@chatscope/chat-ui-kit-react'
import { useQuery, useQueryClient } from 'react-query'
import { getListOfConnectedRestaurants, getChatMessages } from '../../query/chat'
import UserList from './UserList'

const socketUrl = process.env.REACT_APP_SOCKET_URL || '127.0.0.1:5001'
const socket = io(socketUrl, {
  auth: {
    token: localStorage.getItem('token'),
  },
})

export default function ChatWrapper() {
  const queryClient = useQueryClient()

  const [chatId, setChatId] = useState(-1)
  const [chatMeta, setChatMeta] = useState({})

  const [chatMessages, setChatMessages] = useState([])
  const [message, setMessage] = useState('')

  const { data: chatData, isLoading } = useQuery(
    ['chats', { chatId }],
    () => getChatMessages(chatId),
    {
      enabled: !!chatId,
    },
  )

  useEffect(() => {
    socket.on('chat-s2c', (msg) => {
      if (chatMeta.recipientId === msg.senderId) {
        setChatMessages((chatMessages) => [...chatMessages, msg])
      } else {
        // TODO: add in the userslist if user is new
        queryClient.invalidateQueries({ queryKey: ['connected-users'] })
      }
    })
    return () => {
      socket.removeAllListeners('chat-s2c')
    }
  }, [chatMeta.recipientId, queryClient])

  useEffect(() => {
    if (!chatData || !chatData.data.length) {
      return
    }
    setChatMessages(chatData.data)
  }, [chatData])

  const handleSendMessageClick = () => {
    if (!message.length || chatMeta.recipientId <= 0) return

    const messageObj = {
      // token: userToken,
      message: message,
      chatId: chatId,
      senderId: chatMeta.userId,
      destinationId: chatMeta.recipientId,
      timestamp: Date.now(),
    }

    setChatMessages((chatMessages) => [...chatMessages, messageObj])
    socket.emit('chat-c2s', messageObj)

    setMessage('')
  }

  return (
    <>
      <div
        style={{
          height: 'calc(100vh - 150px)',
          position: 'relative',
          textAlign: 'left',
        }}
      >
        <MainContainer responsive>
          <Sidebar position="left" scrollable={false}>
            <UserList chatId={chatId} setChatId={setChatId} setChatMeta={setChatMeta} />
          </Sidebar>

          <ChatContainer>
            <ConversationHeader>
              <ConversationHeader.Back />
              <ConversationHeader.Content
                userName={chatMeta?.recipientLastName}
                // info="Active sometime ago"
              />
            </ConversationHeader>
            {chatMessages && chatMessages.length && (
              <MessageList>
                {/* <MessageSeparator content="Unread messages" /> */}

                {chatMessages.map((item, index) => {
                  const direction = item.senderId === chatMeta.userId ? 'outgoing' : 'incoming'
                  const sender =
                    item.senderId === chatMeta.userId ? 'You' : chatMeta.recipientLastName
                  return (
                    <Message
                      key={index}
                      model={{
                        message: item.message,
                        // sentTime: "15 mins ago",
                        sender: sender,
                        direction: direction,
                        position: 'single',
                      }}
                    ></Message>
                  )
                })}
              </MessageList>
            )}

            <MessageInput
              placeholder="Type message here"
              value={message}
              onChange={(val) => setMessage(val)}
              onSend={handleSendMessageClick}
              style={{ textAlign: 'left' }}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </>
  )
}
