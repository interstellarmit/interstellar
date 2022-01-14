import { Spin } from "antd";
import React from "react";

export default function MySpin(props) {
  return (
    <center>
      <div style={{ margin: "100px 100px 100px 100px" }}>
        <Spin size="large" tip="Loading..." />
      </div>
    </center>
  );
}
