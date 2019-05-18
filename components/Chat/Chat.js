import React from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import Title from '../Title/Title';
import MessageList from '../MessageList/MessageList';
import SendMessageForm from '../SendMessageForm/SendMessageForm';

const DUMMY_DATA = [
    {
      senderId: "perborgen",
      text: "who'll win?"
    },
    {
      senderId: "janedoe",
      text: "who'll win?"
    }
  ]

const instanceLocator = "v1:us1:b44b6ece-ed77-4379-bbcd-7b3a6d5b4071"
const testToken = `https://us1.pusherplatform.io/services/chatkit_token_provider/v1/b44b6ece-ed77-4379-bbcd-7b3a6d5b4071/token`
const username = "katrusya"
const roomId = "19432220"


export default class Chat extends React.Component {
  
    constructor() {
        super()
        this.state = {
        messages: DUMMY_DATA
        }
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount() {
        const chatManager = new ChatManager({
          instanceLocator: instanceLocator,
          userId: username,
          tokenProvider: new TokenProvider({
            url: testToken
          })
       })

       chatManager.connect().then(currentUser => {
            this.currentUser = currentUser;
            currentUser.subscribeToRoomMultipart({
            roomId: roomId,
            hooks: {
              onMessage: message => {
                  this.setState({
                    messages: [...this.state.messages, 
                      {
                        senderId: message.senderId,
                        text: message.parts[0].payload.content
                      }]
                  })
              }
            }
        })
        })
    }

    sendMessage(text) {
        this.currentUser.sendMessage({
            text,
            roomId: roomId
        })
    }
    
  
    render() {
        return (
        <div className="Chat">
            <Title />
            <MessageList 
                  roomId={this.state.roomId}
                  messages={this.state.messages} />
            <SendMessageForm
                    sendMessage={this.sendMessage} />
        </div>
        )
    }
  }

  