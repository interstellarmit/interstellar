import React, { Component, useState } from "react";
import { List, Avatar, Button, Checkbox } from "antd";
import { PlusOutlined, MinusOutlined, CheckCircleTwoTone, UnCheck } from "@ant-design/icons";
import { get, post } from "../../utilities";
export default function DueDate(props) {
  const [verified, setVerified] = React.useState(props.dueDate.verified);
  const formatDueDate = (duedate) => {
    return (
      new Date(duedate.toString()).toString().substring(0, 11) +
      new Date(duedate.toString()).toLocaleString([], { hour: "2-digit", minute: "2-digit" })
    );
    // duedate.toString().substring(0, 11) + duedate.toString().substring(16, 21);
  };
  return (
    <List.Item
      actions={(props.verify && props.dueDate.visibility === "Public"
        ? [
            <Button
              onClick={() => {
                post("/api/verifyDDQL", {
                  objectId: props.dueDate._id,
                  verified: !verified,
                }).then((data) => {
                  if (data.verified) setVerified(!verified);
                });
              }}
            >
              <CheckCircleTwoTone twoToneColor={verified ? "#52c41a" : undefined} />{" "}
              {verified ? "Pushed to Everyone" : "Push to Everyone"}
            </Button>,
          ]
        : []
      ).concat([
        props.added ? (
          <Button
            onClick={() => {
              props.addOrCompleteDDQL({
                objectId: props.dueDate._id,
                action: "remove",
              });
            }}
          >
            <MinusOutlined />
          </Button>
        ) : (
          <Button
            onClick={() => {
              props.addOrCompleteDDQL({
                objectId: props.dueDate._id,
                action: "add",
              });
            }}
          >
            <PlusOutlined />
          </Button>
        ),
      ])}
    >
      <List.Item.Meta
        avatar={
          props.added ? (
            props.completed ? (
              <Checkbox
                checked={true}
                onClick={() => {
                  props.addOrCompleteDDQL({
                    objectId: props.dueDate._id,
                    action: "uncomplete",
                  });
                }}
              />
            ) : (
              <Checkbox
                checked={false}
                onClick={() => {
                  props.addOrCompleteDDQL({
                    objectId: props.dueDate._id,
                    action: "complete",
                  });
                }}
              />
            )
          ) : (
            <></>
          )
        }
        title={props.dueDate.title}
        description={
          (props.home ? "(" + props.pageMap[props.dueDate.pageId] + ") " : "") +
          formatDueDate(props.dueDate.dueDate)
        }
      />
    </List.Item>
  );
}
