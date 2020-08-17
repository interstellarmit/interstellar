import React, { Component, useState } from "react";

import { List, Avatar, Button } from "antd";
import { PlusOutlined, MinusOutlined, LinkOutlined, CheckCircleTwoTone } from "@ant-design/icons";
export default function QuickLink(props) {
  return (
    <List.Item
      actions={(props.verify && props.quickLink.visibility === "Public"
        ? [
            <Button
              onClick={() => {
                props.verifyDDQL({
                  objectId: props.quickLink._id,
                  verified: !props.verified,
                });
              }}
            >
              <CheckCircleTwoTone twoToneColor={props.verified ? "#52c41a" : undefined} />{" "}
              {props.verified ? "Pushed to Everyone" : "Push to Everyone"}
            </Button>,
          ]
        : []
      )
        .concat([
          <Button
            onClick={() => {
              window.open(props.quickLink.url, "_blank");
            }}
          >
            <LinkOutlined />
          </Button>,
        ])
        .concat(
          props.verified
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
              ]
        )}
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
