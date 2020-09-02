import React, { Component, useState } from "react";
import { List, Avatar, Button, Alert, Tooltip } from "antd";
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
      ddql={props.dueDate}
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
      extra={
        hover
          ? (props.verify && props.dueDate.visibility === "Public"
              ? [
                  <Tooltip title={props.verified ? "Pushed to Everyone" : "Push to Everyone"}>
                    <Button
                      onClick={() => {
                        props.verifyDDQL({
                          objectId: props.dueDate._id,
                          verified: !props.verified,
                        });
                      }}
                      icon={
                        <CheckCircleTwoTone twoToneColor={props.verified ? "#52c41a" : "#eb2f96"} />
                      }
                      shape={"circle"}
                      type="text"
                    ></Button>
                  </Tooltip>,
                ]
              : []
            )
              .concat(
                !props.verified && !props.home
                  ? [
                      props.added ? (
                        <Tooltip title="Remove">
                          <Button
                            onClick={() => {
                              props.addOrCompleteDDQL({
                                objectId: props.dueDate._id,
                                action: "remove",
                              });
                            }}
                            icon={<MinusOutlined />}
                            shape={"circle"}
                            type="text"
                          ></Button>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Add">
                          <Button
                            onClick={() => {
                              props.addOrCompleteDDQL({
                                objectId: props.dueDate._id,
                                action: "add",
                              });
                            }}
                            icon={<PlusOutlined />}
                            shape={"circle"}
                            type="text"
                          ></Button>
                        </Tooltip>
                      ),
                    ]
                  : []
              )
              .concat(
                (props.added || props.verified) && props.dueDate.url ? (
                  <Tooltip title="Link">
                    <Button
                      onClick={() => {
                        window.open(props.dueDate.url, "_blank");
                      }}
                      icon={<LinkOutlined />}
                      shape={"circle"}
                      type="text"
                    ></Button>
                  </Tooltip>
                ) : (
                  <></>
                )
              )
              .concat(
                (props.verify || props.dueDate.creatorId === props.userId) && !props.home ? (
                  <Tooltip title="Edit">
                    <Button
                      onClick={() => {
                        setShowEdit(true);
                      }}
                      shape={"circle"}
                      icon={<EditOutlined />}
                      type="text"
                    ></Button>
                  </Tooltip>
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
      {!hover && (props.added || props.verified) && !props.completed && timeUntilDue < 24 * 14 ? (
        timeUntilDue < 24 * 2 ? (
          timeUntilDue < 3 ? (
            timeUntilDue < 0 ? (
              timeUntilDue <= -48 ? (
                <Alert
                  message={"Due " + Math.floor((-1 * timeUntilDue) / 24) + " days ago"}
                  type="error"
                />
              ) : timeUntilDue < -24 ? (
                <Alert
                  message={"Due " + Math.floor((-1 * timeUntilDue) / 24) + " day ago"}
                  type="error"
                />
              ) : (
                <Alert message={"Due " + -1 * timeUntilDue + " hours ago"} type="error" />
              )
            ) : (
              <Alert message={"Due in " + timeUntilDue + " hours"} type="error" />
            )
          ) : (
            <Alert message={"Due in " + timeUntilDue + " hours"} type="warning" />
          )
        ) : (
          <Alert message={"Due in " + Math.floor(timeUntilDue / 24) + " days"} type="success" />
        )
      ) : (
        <></>
      )}
    </List.Item>
  );
}
