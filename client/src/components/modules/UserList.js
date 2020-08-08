import React, { Component, useState } from "react";
import { List, Empty, ConfigProvider } from "antd";
import ProfilePic from "./ProfilePic";

export default function UserList(props) {
  props.users.sort((a, b) => (a.name > b.name ? 1 : -1));
  return (
    <div style={{ maxHeight: "70vh", overflow: "auto" }}>
      <ConfigProvider
        renderEmpty={() => {
          return <Empty description="No users" />;
        }}
      >
        <List
          dataSource={props.users}
          size="large"
          renderItem={(user) => {
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
                            if (!page) return false;
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
      </ConfigProvider>
    </div>
  );
}
