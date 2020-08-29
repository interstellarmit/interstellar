import React, { Component, useState } from "react";
import { List, Empty, ConfigProvider, Row, Col } from "antd";
import ProfilePic from "./ProfilePic";
import { get, post } from "../../utilities";
import { Button } from "antd";

import { UserOutlined } from "@ant-design/icons";

export default function UserList(props) {
  const [adminIds, setAdminIds] = React.useState(props.adminIds);
  props.users.sort((a, b) => (a.name > b.name ? 1 : -1));
  let firstSplit = Math.ceil(props.users.length / 3);
  let secondSplit =
    Math.ceil(props.users.length / 3) +
    Math.ceil((props.users.length - Math.ceil(props.users.length / 3)) / 2);
  let userList1 = props.users.slice(0, firstSplit);
  let userList2 = props.users.slice(firstSplit, secondSplit);
  let userList3 = props.users.slice(secondSplit, props.users.length);
  return (
    <div style={{ maxHeight: "70vh", overflow: "auto" }}>
      <ConfigProvider
        renderEmpty={() => {
          return <Empty description="No users" />;
        }}
      >
        <List
          dataSource={props.users}
          size="medium"
          renderItem={(user) => {
            return (
              <List.Item
                actions={
                  props.adminIds && props.isSiteAdmin && !props.dashboard
                    ? [
                        <Button
                          onClick={() => {
                            post("/api/addRemoveAdmin", {
                              isAdmin: adminIds.includes(user.userId),
                              userId: user.userId,
                              pageId: props.page._id,
                            }).then((data) => {
                              console.log(data);
                              if (data.success) {
                                if (adminIds.includes(user.userId)) {
                                  let newAdminIds = adminIds.filter((id) => {
                                    return id !== user.userId;
                                  });
                                  setAdminIds(newAdminIds);
                                } else {
                                  let newAdminIds = adminIds.map((id) => {
                                    return id;
                                  });
                                  newAdminIds.push(user.userId);
                                  setAdminIds(newAdminIds);
                                }
                              }
                            });
                          }}
                        >
                          <UserOutlined /> {adminIds.includes(user.userId) ? "Admin" : "Student"}
                        </Button>,
                      ]
                    : []
                }
              >
                <List.Item.Meta
                  avatar={<ProfilePic user={user} />}
                  title={user.name}
                  description={
                    props.allPages && props.showClasses && user.pageIds
                      ? user.pageIds
                          .map((id) => {
                            return props.allPages.find((pg) => {
                              return pg._id === id;
                            });
                          })
                          .filter((page) => {
                            if (!page) return false;
                            return page.pageType === "Class";
                          })
                          .map((page) => {
                            return page.name;
                          })

                          .join(", ")
                      : undefined
                  }
                />
              </List.Item>
            );
          }}
        />
        {/* <Row>
          <Col span={8}>
            <List
              dataSource={userList1}
              size="medium"
              renderItem={(user) => {
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<ProfilePic user={user} />}
                      title={user.name}
                      description={
                        props.allPages && props.showClasses && user.pageIds
                          ? user.pageIds
                            .map((id) => {
                              return props.allPages.find((pg) => {
                                return pg._id === id;
                              });
                            })
                            .filter((page) => {
                              if (!page) return false;
                              return page.pageType === "Class";
                            })
                            .map((page) => {
                              return page.name;
                            })

                            .join(", ")
                          : undefined
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Col>
          <Col span={8}>
            <List
              dataSource={userList2}
              size="medium"
              renderItem={(user) => {
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<ProfilePic user={user} />}
                      title={user.name}
                      description={
                        props.allPages && props.showClasses && user.pageIds
                          ? user.pageIds
                            .map((id) => {
                              return props.allPages.find((pg) => {
                                return pg._id === id;
                              });
                            })
                            .filter((page) => {
                              if (!page) return false;
                              return page.pageType === "Class";
                            })
                            .map((page) => {
                              return page.name;
                            })

                            .join(", ")
                          : undefined
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Col>
          <Col span={8}>
            <List
              dataSource={userList3}
              size="medium"
              renderItem={(user) => {
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<ProfilePic user={user} />}
                      title={user.name}
                      description={
                        props.allPages && props.showClasses && user.pageIds
                          ? user.pageIds
                            .map((id) => {
                              return props.allPages.find((pg) => {
                                return pg._id === id;
                              });
                            })
                            .filter((page) => {
                              if (!page) return false;
                              return page.pageType === "Class";
                            })
                            .map((page) => {
                              return page.name;
                            })

                            .join(", ")
                          : undefined
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Col>
        </Row> */}
      </ConfigProvider>
    </div>
  );
}
