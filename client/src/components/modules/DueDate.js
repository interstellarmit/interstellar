import React, { Component, useState } from "react";
import { List, Avatar, Button } from "antd";
import { PlusOutlined, MinusOutlined, CheckCircleTwoTone, UnCheck } from "@ant-design/icons";
import Checkbox from "@material-ui/core/Checkbox";
import { get, post } from "../../utilities";
export default function DueDate(props) {
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
                props.verifyDDQL({
                  objectId: props.dueDate._id,
                  verified: !props.verified,
                });
              }}
            >
              <CheckCircleTwoTone twoToneColor={props.verified ? "#52c41a" : undefined} />{" "}
              {props.verified ? "Pushed to Everyone" : "Push to Everyone"}
            </Button>,
          ]
        : []
      ).concat(
        !props.verified
          ? [
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
            ]
          : []
      )}
    >
      <List.Item.Meta
        avatar={
          props.added || props.verified ? (
            props.completed ? (
              <Checkbox
                checked={true}
                onChange={() => {
                  props.addOrCompleteDDQL({
                    objectId: props.dueDate._id,
                    action: "uncomplete",
                  });
                }}
                color="primary"
              />
            ) : (
              <Checkbox
                checked={false}
                onChange={() => {
                  props.addOrCompleteDDQL({
                    objectId: props.dueDate._id,
                    action: "complete",
                  });
                }}
                color="primary"
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
