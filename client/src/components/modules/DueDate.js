import React, { Component, useState } from "react";
import { List, Avatar, Button } from 'antd';
export default function DueDate(props) {
  let formatDueDate = (date) => {
    return date
  }
  return (
    <List.Item actions={[
      props.added ?
      <Button onClick={() => {props.addOrCompleteDDQL({
        objectId: props.dueDate._id,
        action: "remove"
      })}}>Remove</Button>
      :
      <Button onClick={() => {props.addOrCompleteDDQL({
        objectId: props.dueDate._id,
        action: "add"
      })}}>Add</Button>,

      props.added ? (props.completed ?
      <Button onClick={() => {props.addOrCompleteDDQL({
        objectId: props.dueDate._id,
        action: "uncomplete"
      })}}>Uncomplete</Button>
      :
      <Button onClick={() => {props.addOrCompleteDDQL({
        objectId: props.dueDate._id,
        action: "complete"
      })}}>Complete</Button>) : <></>


    ]}>
      <List.Item.Meta
        
        title={props.dueDate.title}
        description={formatDueDate(props.dueDate.dueDate)}
        />
    </List.Item>
  );
}
