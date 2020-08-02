import React, { Component, useState } from "react";
import { List, Avatar } from "antd";
import LoungeListItem from "./LoungeListItem";
export default function LoungeList(props) {
  return (
    <List
      dataSource={props.lounges}
      renderItem={(oneLounge) => {
        return (
          <LoungeListItem
            name={oneLounge.name}
            users={oneLounge.userIds.map((user) => {
              return props.users.find((oneUser) => {
                return oneUser.userId === user;
              });
            })}
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
