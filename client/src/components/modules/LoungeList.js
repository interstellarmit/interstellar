import React, { Component, useState } from "react";
import { List, Avatar, ConfigProvider, Empty } from "antd";
import LoungeListItem from "./LoungeListItem";
export default function LoungeList(props) {
  let datasource = props.lounges.sort((a, b) => {
    if (a.userIds.length > b.userIds.length) return -1;
    if (a.userIds.length < b.userIds.length) return 1;
    return a.name.localeCompare(b.name);
  });
  return (
    <div style={{ maxHeight: "100%", overflow: "auto" }}>
      <ConfigProvider
        renderEmpty={() => {
          return <Empty description="No lounges" />;
        }}
      >
        <List
          dataSource={datasource}
          renderItem={(oneLounge) => {
            return (
              <LoungeListItem
                name={oneLounge.name}
                users={oneLounge.userIds.map((user) => {
                  return (
                    props.users.find((oneUser) => {
                      return oneUser.userId === user;
                    }) || { userId: "", name: "Former Member" }
                  );
                })}
                home={props.home}
                pageName={props.page.name}
                redirect={() => {
                  props.redirect(
                    "/" + props.page.pageType.toLowerCase() + "/" + props.page.name + "/lounge"
                  );
                }}
              />
            );
          }}
        />
      </ConfigProvider>
    </div>
  );
}
