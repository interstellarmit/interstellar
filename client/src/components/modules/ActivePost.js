import React, { useState } from "react";

export default function ActivePost(props) {
  return (
    <React.Fragment>
      <h3>{props.post.title}</h3>
      {props.post.text}
    </React.Fragment>
  );
}
