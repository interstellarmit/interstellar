import React, { Component, useState } from "react";
import { List } from "antd";
import ProfilePic from "./ProfilePic";

export default function UserList(props) {
  return (
    <List
      dataSource={props.users}
      size="large"
      renderItem={(user) => {
        console.log(user);
        return (
          <List.Item>
            <List.Item.Meta
              avatar={<ProfilePic user={user} />}
              title={user.name}
              description={
                props.allPages && props.showClasses && user.pageIds
                  ? user.pageIds
                      .map((id) => {
                        return props.allPages.find((pg) => {
                          return pg._id === id;
                        });
                      })
                      .filter((page) => {
                        return page.pageType === "Class";
                      })
                      .map((page) => {
                        return page.name;
                      })

                      .join(", ")
                  : undefined
              }
            />
          </List.Item>
        );
      }}
    />
  );
}
