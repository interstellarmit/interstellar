import React, { Component, useState } from 'react';

import { List, Avatar, Button } from 'antd';

export default function QuickLink(props) {
  
  return (
    <List.Item actions={[
      props.added ?
      <Button onClick={() => {props.addOrCompleteDDQL({
        objectId: props.quickLink._id,
        action: "remove"
      })}}>Remove</Button>
      :
      <Button onClick={() => {props.addOrCompleteDDQL({
        objectId: props.quickLink._id,
        action: "add"
      })}}>Add</Button>

      


    ]}>
      <List.Item.Meta
        
        title={props.quickLink.title}
        description={props.quickLink.url}
        />
    </List.Item>
  );
};
