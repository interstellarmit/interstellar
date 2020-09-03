import React, { Component, useState } from "react";
import { List, Avatar, ConfigProvider, Button, Empty, Alert } from "antd";
import { get, post } from "../../utilities";
export default function DueDateAdmin(props) {
  const formatDueDate = (duedate) => {
    return (
      new Date(duedate.toString()).toString().substring(0, 11) +
      new Date(duedate.toString()).toLocaleString([], { hour: "2-digit", minute: "2-digit" })
    );
    // duedate.toString().substring(0, 11) + duedate.toString().substring(16, 21);
  };

  const [ddqls, setDDQLs] = React.useState([]);
  return (
    <div style={{ maxHeight: "70vh", overflow: "auto" }}>
      <Alert
        message="This is all unverified public duedates and quicklinks"
        description={
          <Button
            type="primary"
            style={{ marginTop: "10px" }}
            onClick={() => {
              post("/api/getUnverifiedDDQLs").then((data) => {
                setDDQLs(
                  data
                    .map((ddql) => {
                      let pg = props.allPages.find((pg) => {
                        return pg._id === ddql.pageId;
                      });
                      if (pg) return Object.assign(ddql, { page: pg });
                      else return ddql;
                    })
                    .filter((ddql) => {
                      if (ddql.page) return ddql.page.pageType === "Class";
                      return false;
                    })
                    .sort((a, b) => {
                      return a.page.name.localeCompare(b.page.name);
                    })
                );
              });
            }}
          >
            Pull Due Dates and Quicklinks
          </Button>
        }
        type="info"
        showIcon
        style={{ height: "100%" }}
        closable
      />
      <ConfigProvider
        renderEmpty={() => {
          return <Empty description="No unverified public duedates or quicklinks" />;
        }}
      >
        <List
          dataSource={ddqls}
          renderItem={(ddql) => {
            let name = (ddql.page || { name: "Not Found" }).name;
            return (
              <List.Item>
                <List.Item.Meta
                  title={ddql.title}
                  description={
                    "(" + name + ") " + (ddql.dueDate ? formatDueDate(ddql.dueDate) : "")
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
