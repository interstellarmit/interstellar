import React, { Component, useState } from 'react';
import { Avatar } from 'antd';

export default function ProfilePic(props) {
  let initials = props.user.name.split(" ").map((name) => { return name[0] })
  initials = initials[0] + initials[initials.length - 1]
  return (
    <Avatar>{initials}</Avatar>
  );
};
