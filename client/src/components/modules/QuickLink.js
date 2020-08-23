import React, { Component, useState } from "react";

import { List, Avatar, Button } from "antd";
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
      actions={
        hover
          ? (props.verify && props.quickLink.visibility === "Public"
              ? [
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
                    shape="round"
                  >
                    {props.verified ? "Pushed to Everyone" : "Push to Everyone"}
                  </Button>,
                ]
              : []
            )
              .concat(
                props.added
                  ? [
                      <Button
                        onClick={() => {
                          window.open(props.quickLink.url, "_blank");
                        }}
                        icon={<LinkOutlined />}
                        shape={"round"}
                      >
                        Link
                      </Button>,
                    ]
                  : []
              )
              .concat(
                props.verified || props.home
                  ? []
                  : [
                      props.added ? (
                        <Button
                          onClick={() => {
                            props.addOrCompleteDDQL({
                              objectId: props.quickLink._id,
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
                              objectId: props.quickLink._id,
                              action: "add",
                            });
                          }}
                          icon={<PlusOutlined />}
                          shape={"circle"}
                        ></Button>
                      ),
                    ]
              )
              .concat(
                (props.verify || props.quickLink.creatorId === props.userId) && !props.home ? (
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
