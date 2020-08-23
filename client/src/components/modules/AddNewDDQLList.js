import React, { Component, useState, useEffect, useRef } from "react";
import { List, Modal, Row, Col, Button, Form, Input, DatePicker, Checkbox } from "antd";
import DueDate from "./DueDate";
import moment from "moment";
import QuickLink from "./QuickLink";
export default function AddNewDDQLList(props) {
  const scrollToRef = useRef(null);
  useEffect(() => {
    if (!scrollToRef.current) return;
    scrollToRef.current.scrollIntoView({ behavior: "smooth" });
  });
  return (
    <div style={{ height: "250px", overflow: "auto" }}>
      <List
        dataSource={props.dataSource}
        renderItem={(item) => {
          if (item.marker) return <div ref={scrollToRef} />;
          return props.renderItem(item);
        }}
      />
    </div>
  );
}
