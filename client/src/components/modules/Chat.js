import React, { Component } from "react";
import { get, post } from "../../utilities";
import ProfilePic from "./ProfilePic";



class Chat extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      currentMessage: String,
      messages: []
    };
  }

  componentDidMount() {
    socket.on("message", (data) => {
      if(data.loungeId !== this.props.loungeId)
        console.log("Wrong lounge...")
      let messages = this.state.messages
      messages.push({userId: data.userId, userName: data.userName, text: data.text})
      this.setState({messages: messages})
    })
  }
a
  render() {
    return (
      <>
        <List 
          dataSource={messages}
          render={(message) => {
            return <List.Item>
              <ProfilePic user={{userId: message.userId, name: message.name}} />
              {message.name + ": " + message.text}
            </List.Item>
          }}
        />
        <Input />
      </>
    );
  }
}

export default Chat;
