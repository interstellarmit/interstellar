import React, { Component, useState } from "react";
import { List, Avatar, Button, Alert } from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  CheckCircleTwoTone,
  LinkOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Checkbox from "@material-ui/core/Checkbox";
import AddNewDDQL from "./AddNewDDQL";
import { get, post } from "../../utilities";
export default function DueDate(props) {
  const [showEdit, setShowEdit] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const formatDueDate = (duedate) => {
    return (
      new Date(duedate.toString()).toString().substring(0, 11) +
      new Date(duedate.toString()).toLocaleString([], { hour: "2-digit", minute: "2-digit" })
    );
    // duedate.toString().substring(0, 11) + duedate.toString().substring(16, 21);
  };

  let timeUntilDue = Math.floor(
    (new Date(props.dueDate.dueDate.toString()).getTime() - new Date().getTime()) /
      1000.0 /
      60.0 /
      60.0
  );

  let editDDQL = (
    <AddNewDDQL
      editDDQL={props.editDDQL}
      visible={showEdit}
      setVisible={setShowEdit}
      DDQL={props.dueDate}
      type={"DueDate"}
      edit={true}
    />
  );

  return (
    <List.Item
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      style={{ backgroundColor: hover ? "#F6F6F6" : undefined }}
      actions={
        hover
          ? (props.verify && props.dueDate.visibility === "Public"
              ? [
                  <Button
                    onClick={() => {
                      props.verifyDDQL({
                        objectId: props.dueDate._id,
                        verified: !props.verified,
                      });
                    }}
                    icon={
                      <CheckCircleTwoTone twoToneColor={props.verified ? "#52c41a" : undefined} />
                    }
                    shape={"round"}
                  >
                    {props.verified ? "Pushed to Everyone" : "Push to Everyone"}
                  </Button>,
                ]
              : []
            )
              .concat(
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
                          icon={<MinusOutlined />}
                          shape={"round"}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            props.addOrCompleteDDQL({
                              objectId: props.dueDate._id,
                              action: "add",
                            });
                          }}
                          icon={<PlusOutlined />}
                          shape={"circle"}
                        ></Button>
                      ),
                    ]
                  : []
              )
              .concat(
                props.dueDate.url ? (
                  <Button
                    onClick={() => {
                      window.open(props.dueDate.url, "_blank");
                    }}
                    icon={<LinkOutlined />}
                    shape={"round"}
                  >
                    Link
                  </Button>
                ) : (
                  <></>
                )
              )
              .concat(
                props.verify || props.dueDate.creatorId === props.userId ? (
                  <Button
                    onClick={() => {
                      setShowEdit(true);
                    }}
                    shape={"round"}
                    icon={<EditOutlined />}
                  >
                    Edit
                  </Button>
                ) : (
                  <></>
                )
              )
          : undefined
      }
    >
      {editDDQL}
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
      {timeUntilDue < 24 ? (
        timeUntilDue < 3 ? (
          timeUntilDue < 0 ? (
            <Alert message={"Due " + -1 * timeUntilDue + " hours ago"} type="error" />
          ) : (
            <Alert message={"Due in " + timeUntilDue + " hours"} type="error" />
          )
        ) : (
          <Alert message={"Due in " + timeUntilDue + " hours"} type="warning" />
        )
      ) : (
        <></>
      )}
    </List.Item>
  );
}
