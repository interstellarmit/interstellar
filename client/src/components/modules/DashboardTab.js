import React, { Component, useState } from "react";
import DDQLSection from "./DDQLSection";
import { Row, Col, Typography } from "antd";
const { Title, Text } = Typography;
import LoungeList from "./LoungeList";
export default function DashboardTab(props) {
  return (
    <>
      <Row>
        <Col span={24}>
          <DDQLSection
            dataSource={props.dueDates}
            users={props.users}
            page={props.page}
            createNewDDQL={props.createNewDDQL}
            editDDQL={props.editDDQL}
            user={props.user}
            isSiteAdmin={props.isSiteAdmin}
            type="DueDate"
          />

          <DDQLSection
            dataSource={props.quickLinks}
            users={props.users}
            page={props.page}
            createNewDDQL={props.createNewDDQL}
            isSiteAdmin={props.isSiteAdmin}
            editDDQL={props.editDDQL}
            user={props.user}
            type="QuickLink"
          />
        </Col>
      </Row>
    </>
  );
  /*
        <Col span={12}>
          <Title level={4}>{"Open Lounges"}</Title>
          <LoungeList
            redirect={(link) => props.redirectPage(link)}
            lounges={props.lounges}
            users={props.users}
            page={props.page}
          />
        </Col>*/
}
