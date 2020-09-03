import React, { Component, useState } from "react";
import { List, Avatar, ConfigProvider, Button, Empty, Alert } from "antd";
import { get, post } from "../../utilities";
export default function AdminRequests(props) {
  const [finishedRequests, setFinishedRequests] = React.useState([]);
  let removeRequest = (id) => {
    let reqs = finishedRequests.map((r) => {
      return r;
    });
    reqs.push(id);
    setFinishedRequests(reqs);
    post("/api/honorRequest", {
      requestId: id,
    });
  };
  return (
    <div style={{ maxHeight: "70vh", overflow: "auto" }}>
      <Alert
        message="This is where you approve requests for users who wish to help admin this page"
        type="info"
        showIcon
        style={{ height: "100%" }}
        closable
      />
      <ConfigProvider
        renderEmpty={() => {
          return <Empty description="No requests" />;
        }}
      >
        <List
          dataSource={props.adminRequests.filter((request) => {
            return !finishedRequests.includes(request._id) && !request.honored;
          })}
          renderItem={(request) => {
            return (
              <List.Item
                actions={[
                  <Button
                    onClick={() => {
                      post("/api/addRemoveAdmin", {
                        isAdmin: false,
                        userId: request.userId,
                        pageId: request.pageId,
                      }).then((data) => {
                        if (data.success) {
                          removeRequest(request._id);
                        }
                      });
                    }}
                  >
                    Add as Admin
                  </Button>,
                  <Button
                    onClick={() => {
                      removeRequest(request._id);
                    }}
                  >
                    Delete Request
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={request.name + " requests admin privileges for " + request.pageName}
                />
              </List.Item>
            );
          }}
        />
      </ConfigProvider>
    </div>
  );
}
