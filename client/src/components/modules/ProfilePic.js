import React, { Component, useState } from 'react';
import { Avatar } from 'antd';

export default function ProfilePic(props) {
  let initials = props.user.name.split(" ").map((name) => {return name[0]}).join("")
  return (
    <Avatar>{initials}</Avatar>
  );
};
