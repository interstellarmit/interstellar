import { UserOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Empty, List } from "antd";
import React from "react";
import { post } from "../../utilities";
import ProfilePic from "./ProfilePic";

export default function UserList(props) {
  const [adminIds, setAdminIds] = React.useState(props.adminIds);
  props.users.sort((a, b) => {
    if (props.adminIds) {
      if (props.adminIds.includes(a.userId) && props.adminIds.includes(b.userId)) {
      } else if (props.adminIds.includes(a.userId)) {
        return -1;
      } else if (props.adminIds.includes(b.userId)) {
        return 1;
      }
    }
    if (!a.name && !b.name) return 0;
    if (!a.name) return 1;
    if (!b.name) return -1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div style={{ maxHeight: "100%", overflow: "auto" }}>
      <ConfigProvider
        renderEmpty={() => {
          return <Empty description="No students" />;
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
                  avatar={
                    <ProfilePic
                      user={user}
                      onClick={
                        user.userId &&
                        (() => {
                          props.redirectPage("/user/" + user.userId);
                        })
                      }
                    />
                  }
                  title={user.name}
                  description={
                    props.allPages && user.pageIds
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
                      : adminIds
                      ? adminIds.includes(user.userId)
                        ? " Admin"
                        : ""
                      : ""
                  }
                />
              </List.Item>
            );
          }}
        />
      </ConfigProvider>
    </div>
  );
}
