import React, { Component, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, NavLink, Switch } from "react-router-dom";
import { List, Avatar, Row, Col, Button, Typography, Divider } from "antd";
const { Title, Text } = Typography;
import LoungeList from "./LoungeList";
import Chat from "./Chat";
import AddLounge from "./AddLounge";
import UserList from "./UserList";
import gatherDemo from "../../public/GatherDemo.png";
export default function LoungesTab(props) {
  let lounge = props.lounges
    ? props.lounges.filter((lounge) => {
        return lounge.main;
      })[0]
    : undefined;

  if (!lounge) return <div>No lounge exists</div>;

  let loungeCode =
    lounge.zoomLink === "" ? (
      <></>
    ) : (
      <center>
        <a
          href={lounge.zoomLink}
          target="_blank"
          style={{
            backgroundColor: "#3F90F7",
            padding: "20px",
            borderRadius: "10px",
            color: "white",
            fontSize: 25,
          }}
          onClick={() => {
            /*
              if (props.loungeId !== lounge._id) {
                props.removeSelfFromLounge(props.loungeId, () => {
                  props.addSelfToLounge(lounge._id, () => {
                    props.setLoungeId(lounge._id);
                  });
                });
              }
              */
          }}
        >
          Hop In The Lounge
        </a>
      </center>
    );
  useEffect(() => {
    document.getElementsByClassName("ant-tabs-content")[0].style.height = "100%";
  });
  return (
    <Row gutter={[16, 16]} style={{ height: "100%" }}>
      <Col span={12} style={{ height: "100%" }}>
        <div
          style={{
            backgroundImage: "url(" + gatherDemo + ")",
            height: "100%",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
          }}
        >
          {loungeCode}
        </div>
      </Col>
      <Col span={12} style={{ height: "100%" }}>
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #d9d9d9",
            boxSizing: "borderBox",
            height: "calc(50% - 10px)",
            borderRadius: "10px",
            padding: "20px 20px 20px 20px",
            margin: "0px 0px 0px 10px",
            boxShadow: "0 10px 25px rgba(0,0,0,.02), 0 4px 10px rgba(0,0,0,.02)",
          }}
        >
          <UserList
            users={lounge.userIds.map((user) => {
              return (
                props.users.find((oneUser) => {
                  return oneUser.userId === user;
                }) || { userId: "", name: "Former Member" }
              );
            })}
          />
        </div>
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #d9d9d9",
            boxSizing: "borderBox",
            height: "calc(50% - 10px)",
            borderRadius: "10px",
            padding: "20px 20px 20px 20px",
            margin: "20px 0px 0px 10px",
            boxShadow: "0 10px 25px rgba(0,0,0,.02), 0 4px 10px rgba(0,0,0,.02)",
          }}
        >
          <Chat page={props.page} pageId={props.page._id} />
        </div>
      </Col>
    </Row>
  );
  /*
  const [addNewLounge, setAddNewLounge] = React.useState(false);
  
  return (
    <Router>
      <Switch>
        <Route
          path={
            "/" + props.page.pageType.toLowerCase() + "/" + props.page.name + "/lounges/:loungeId?"
          }
          render={({ match, history }) => {
            let loungeId =
              match.params.loungeId ||
              (
                props.lounges.filter((lounge) => {
                  return lounge.pageId === props.page._id && lounge.main;
                })[0] || {}
              )._id ||
              props.loungeId;
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
                  {lounge.zoomLink === "" ? (
                    <></>
                  ) : (
                    <a
                      href={lounge.zoomLink}
                      target="_blank"
                      style={{
                        backgroundColor: "#3F90F7",
                        padding: "20px",
                        borderRadius: "10px",
                        color: "white",
                        fontSize: 50,
                      }}
                    >
                      Hop In The Lounge
                    </a>
                  )}
                  {/ * <Row>
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
                  </Row> * /}
                </React.Fragment>
              );
            }
            return (
              <Switch>
                <Row gutter={[16, 16]}>
                  <Col span={18}>
                    <div
                      style={{
                        backgroundImage: "url(" + gatherDemo + ")",
                        height: "600px",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {loungeCode}
                    </div>
                  </Col>
                  <Col span={6}>
                    {/ * <Button
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
                      admin={props.page.adminIds.includes(props.user.userId) || props.isSiteAdmin}
                    />
                    <LoungeList
                      lounges={props.lounges}
                      redirect={(link) => {
                        history.push(link);
                      }}
                      users={props.users}
                      page={props.page}
                    /> * /}
                    <UserList
                      users={lounge.userIds.map((user) => {
                        return props.users.filter((oneUser) => {
                          return oneUser.userId === user;
                        })[0];
                      })}
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
  */
}
