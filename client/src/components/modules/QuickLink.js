import React, { Component, useState } from "react";

import { List, Avatar, Button } from "antd";
import { PlusOutlined, MinusOutlined, LinkOutlined, CheckCircleTwoTone } from "@ant-design/icons";
export default function QuickLink(props) {
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
              <CheckCircleTwoTone twoToneColor={verified ? "#52c41a" : undefined} />
            </Button>,
          ]
        : []
      ).concat([
        <Button
          onClick={() => {
            window.open(props.quickLink.url, "_blank");
          }}
        >
          <LinkOutlined />
        </Button>,
        props.added ? (
          <Button
            onClick={() => {
              props.addOrCompleteDDQL({
                objectId: props.quickLink._id,
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
                objectId: props.quickLink._id,
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
