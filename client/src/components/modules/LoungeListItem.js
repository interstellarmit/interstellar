import React, { Component, useState } from "react";
import { List, Avatar } from "antd";
import ProfilePic from "./ProfilePic";
export default function LoungeListItem(props) {
  return (
    <List.Item onClick={props.redirect}>
<<<<<<< HEAD
      <List.Item.Meta 
        avatar={
          <Avatar.Group maxCount={6}>
              {props.users.map((user)=>{return <ProfilePic user={user} />})}
                </Avatar.Group>
        }
        title={props.name}
      />
              
              
=======
      <Avatar.Group maxCount={6}>
        {props.users.map((user) => {
          return <ProfilePic user={user} />;
        })}
      </Avatar.Group>
      {props.name}
>>>>>>> ca76cca54ff7f57d66fab8c28b0ab52a08966d4a
    </List.Item>
  );
}
