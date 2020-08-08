import React, { Component, useState } from "react";
import { Spin } from "antd";

export default function MySpin(props) {
  return (
    <center>
      <div style={{ margin: "100px 100px 100px 100px" }}>
        <Spin size="large" tip="Loading..." />
      </div>
    </center>
  );
}
