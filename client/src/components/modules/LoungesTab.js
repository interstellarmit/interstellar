import React, { Component, useState } from "react";
import { BrowserRouter as Router, Route, NavLink, Switch } from "react-router-dom";
import { List, Avatar, Row, Col, Button, Typography } from "antd";
const { Title, Text } = Typography;
import LoungeList from "./LoungeList";
import Chat from "./Chat";
import AddLounge from "./AddLounge";
import UserList from "./UserList";
export default function LoungesTab(props) {
  const [addNewLounge, setAddNewLounge] = React.useState(false);

  return (
    <Router>
      <Switch>
        <Route
          path={
            "/" + props.page.pageType.toLowerCase() + "/" + props.page.name + "/lounges/:loungeId?"
          }
          render={({ match, history }) => {
            let loungeId = match.params.loungeId || props.loungeId;
            let loungeArr = props.lounges.filter((cur) => {
              return cur._id === loungeId;
            });
            let lounge = loungeArr.length === 0 ? "" : loungeArr[0];
            let loungeCode = <></>;

            if (lounge !== "") {
              if (props.loungeId !== loungeId) {
                props.removeSelfFromLounge(props.loungeId, () => {
                  props.addSelfToLounge(loungeId, () => {
                    props.setLoungeId(loungeId);
                  });
                });
              }

              loungeCode = (
                <React.Fragment>
                  <Title level={3}>
                    <center>{lounge.name}</center>
                  </Title>
                  <center>
                    {lounge.zoomLink === "" ? (
                      <></>
                    ) : (
                      <h3>
                        {"Zoom Link: "}{" "}
                        <a href={lounge.zoomLink} target="_blank">
                          {lounge.zoomLink}
                        </a>
                      </h3>
                    )}
                  </center>
                  <Row>
                    <Col span={6}>
                      <UserList
                        users={lounge.userIds.map((user) => {
                          return props.users.filter((oneUser) => {
                            return oneUser.userId === user;
                          })[0];
                        })}
                      />
                    </Col>
                    <Col span={18}>
                      <Chat loungeId={loungeId} />
                    </Col>
                  </Row>
                </React.Fragment>
              );
            }
            return (
              <Switch>
                <Row>
                  <Col span={18}>{loungeCode}</Col>
                  <Col span={6}>
                    <Button
                      onClick={() => {
                        setAddNewLounge(true);
                      }}
                      shape={"round"}
                    >
                      Add New Lounge
                    </Button>
                    <AddLounge
                      createNewLounge={props.createNewLounge}
                      visible={addNewLounge}
                      setVisible={setAddNewLounge}
                    />
                    <LoungeList
                      lounges={props.lounges}
                      redirect={(link) => {
                        history.push(link);
                      }}
                      users={props.users}
                      page={props.page}
                    />
                  </Col>
                </Row>
              </Switch>
            );
          }}
        />
      </Switch>
    </Router>
  );
}
