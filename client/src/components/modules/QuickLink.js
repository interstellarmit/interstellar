import React, { Component, useState } from "react";

import { List, Avatar, Button, Tooltip } from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  LinkOutlined,
  CheckCircleTwoTone,
  EditOutlined,
} from "@ant-design/icons";
import AddNewDDQL from "./AddNewDDQL";
export default function QuickLink(props) {
  const [showEdit, setShowEdit] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  let editDDQL = (
    <AddNewDDQL
      editDDQL={props.editDDQL}
      visible={showEdit}
      setVisible={setShowEdit}
      DDQL={props.quickLink}
      type={"QuickLink"}
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
          ? (props.verify && props.quickLink.visibility === "Public"
              ? [
                  <Tooltip title={props.verified ? "Pushed to Everyone" : "Push to Everyone"}>
                    <Button
                      onClick={() => {
                        props.verifyDDQL({
                          objectId: props.quickLink._id,
                          verified: !props.verified,
                        });
                      }}
                      icon={
                        <CheckCircleTwoTone twoToneColor={props.verified ? "#52c41a" : undefined} />
                      }
                      shape="circle"
                      type="text"
                    ></Button>
                  </Tooltip>,
                ]
              : []
            )
              .concat(
                props.added
                  ? [
                      <Tooltip title="Link">
                        <Button
                          onClick={() => {
                            window.open(props.quickLink.url, "_blank");
                          }}
                          icon={<LinkOutlined />}
                          shape={"circle"}
                          type="text"
                        ></Button>
                      </Tooltip>,
                    ]
                  : []
              )
              .concat(
                props.verified || props.home
                  ? []
                  : [
                      props.added ? (
                        <Tooltip title="Remove">
                          <Button
                            onClick={() => {
                              props.addOrCompleteDDQL({
                                objectId: props.quickLink._id,
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
                                objectId: props.quickLink._id,
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
              )
              .concat(
                (props.verify || props.quickLink.creatorId === props.userId) && !props.home ? (
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
          <Avatar
            src={"https://s2.googleusercontent.com/s2/favicons?domain_url=" + props.quickLink.url}
          />
        }
        title={props.quickLink.title}
        description={props.home ? props.pageMap[props.quickLink.pageId] : undefined}
      />
    </List.Item>
  );
}
