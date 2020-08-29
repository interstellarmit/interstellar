import React, { Component, useState } from "react";
import DDQLSection from "./DDQLSection";
import { Row, Col, Typography, Alert, Button } from "antd";
const { Title, Text } = Typography;
import LoungeList from "./LoungeList";
import UserList from "./UserList";
import { post } from "../../utilities";
export default function DashboardTab(props) {
  const [showDueDate, setShowDueDate] = React.useState(true);
  let users = props.users.filter((user) => {
    return user.userId !== props.user.userId;
  });
  if (props.inPage) {
    users.push(Object.assign(props.user, { pageIds: props.pageIds }));
  }
  const [alreadyRequested, setAlreadyRequested] = React.useState(0);
  return (
    <>
      <Row>
        {props.seeHelpText ? (
          <Col span={12}>
            <Alert
              message={"Help create a " + props.page.pageType.toLowerCase() + " calendar"}
              description={
                <div>
                  The add button lets you: <br /> - add new due dates and quicklinks for everyone to
                  see <br />- view a public feed of other students' duedates and quicklinks to add
                  to your own feed.
                </div>
              }
              type="info"
              showIcon
              closable
              afterClose={() => {
                props.setSeeHelpText(false);
              }}
            />
          </Col>
        ) : (
          <React.Fragment />
        )}
        {!props.page.adminIds.includes(props.user.userId) && props.page.adminIds.length < 5 ? (
          <Col span={props.seeHelpText ? 12 : 24}>
            <Alert
              message="Request ability to push out due dates from public feed to everyone automatically
      "
              description={
                <div>
                  {alreadyRequested >= 1 ? (
                    alreadyRequested === 1 ? (
                      "You already submitted a request"
                    ) : (
                      "Request Sent"
                    )
                  ) : (
                    <Button
                      type="primary"
                      style={{ marginTop: "10px" }}
                      onClick={() => {
                        post("/api/requestAdmin", {
                          pageId: props.page._id,
                          pageName: props.page.name,
                        }).then((data) => {
                          if (data.alreadyRequested) setAlreadyRequested(1);
                          else if (data.requested) setAlreadyRequested(2);
                        });
                      }}
                    >
                      Become {props.page.name} Due Date Verifier
                    </Button>
                  )}
                </div>
              }
              type="info"
              showIcon
              closeable
              style={{ height: "100%" }}
              closable
            />
          </Col>
        ) : (
          <React.Fragment />
        )}
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={16}>
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
        </Col>
        <Col span={8}>
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
