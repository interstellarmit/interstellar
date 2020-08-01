import React, { Component, useState } from "react";
import { List, Avatar, Button, Checkbox } from 'antd';
import {PlusOutlined, MinusOutlined} from "@ant-design/icons"; 

export default function DueDate(props) {
  const formatDueDate = (duedate) => {
    return (new Date(duedate.toString())).toString().substring(0, 11) + (new Date(duedate.toString())).toLocaleString([], {hour: '2-digit', minute:'2-digit'})
    // duedate.toString().substring(0, 11) + duedate.toString().substring(16, 21);
  };
  return (
    <List.Item actions={[
      props.added ?
      <Button onClick={() => {props.addOrCompleteDDQL({
        objectId: props.dueDate._id,
        action: "remove"
      })}}><MinusOutlined /></Button>
      :
      <Button onClick={() => {props.addOrCompleteDDQL({
        objectId: props.dueDate._id,
        action: "add"
      })}}><PlusOutlined /></Button>

     


    ]}>
      <List.Item.Meta
        avatar={
          props.added ? (props.completed ?
            <Checkbox checked={true} onClick={() => {props.addOrCompleteDDQL({
              objectId: props.dueDate._id,
              action: "uncomplete"
            })}} />
            :
            <Checkbox checked={false} onClick={() => {props.addOrCompleteDDQL({
              objectId: props.dueDate._id,
              action: "complete"
            })}} />) : <></>
        }
        title={props.dueDate.title}
        description={formatDueDate(props.dueDate.dueDate)}
        />
    </List.Item>
  );
}
