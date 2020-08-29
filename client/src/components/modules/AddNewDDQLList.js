import React, { Component, useState, useEffect, useRef } from "react";
import {
  List,
  Modal,
  Row,
  Col,
  Button,
  Form,
  Input,
  DatePicker,
  Checkbox,
  ConfigProvider,
  Empty,
} from "antd";
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
      <ConfigProvider
        renderEmpty={() => {
          return <Empty description="Empty public feed" />;
        }}
      >
        <List
          dataSource={
            props.dataSource.filter((data) => {
              return data.marker ? false : true;
            }).length > 0
              ? props.dataSource
              : []
          }
          renderItem={(item) => {
            if (item.marker) return <div ref={scrollToRef} />;
            return props.renderItem(item);
          }}
        />
      </ConfigProvider>
    </div>
  );
}
