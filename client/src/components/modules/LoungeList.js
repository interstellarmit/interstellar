import React, { Component, useState } from "react";
import { List, Avatar } from "antd";
import LoungeListItem from "./LoungeListItem";
export default function LoungeList(props) {
  return (
    <List
      dataSource={props.lounges.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      })}
      renderItem={(oneLounge) => {
        return (
          <LoungeListItem
            name={oneLounge.name}
            users={oneLounge.userIds.map((user) => {
              return props.users.find((oneUser) => {
                return oneUser.userId === user;
              });
            })}
            home={props.home}
            pageName={props.page.name}
            redirect={() => {
              props.redirect(
                "/" +
                  props.page.pageType.toLowerCase() +
                  "/" +
                  props.page.name +
                  "/lounges/" +
                  oneLounge._id
              );
            }}
          />
        );
      }}
    />
  );
}
