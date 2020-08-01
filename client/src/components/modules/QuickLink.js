import React, { Component, useState } from 'react';

import { List, Avatar, Button } from 'antd';
import {PlusOutlined, MinusOutlined} from "@ant-design/icons"; 
export default function QuickLink(props) {
  
  return (
    <List.Item actions={[
      props.added ?
      <Button onClick={() => {props.addOrCompleteDDQL({
        objectId: props.quickLink._id,
        action: "remove"
      })}}><MinusOutlined /></Button>
      :
      <Button onClick={() => {props.addOrCompleteDDQL({
        objectId: props.quickLink._id,
        action: "add"
      })}}><PlusOutlined /></Button>

      


    ]}
      onClick={() => {
        window.open(props.quickLink.url, '_blank')
      }}
    >
      <List.Item.Meta
        avatar={<Avatar src={"https://s2.googleusercontent.com/s2/favicons?domain_url=" +
        props.quickLink.url} />}
        title={props.quickLink.title}
        
        />
    </List.Item>
  );
};
