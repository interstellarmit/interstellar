import React, { Component, useState, useEffect, useRef } from "react";
import DueDate from "./DueDate";
import AddNewDDQL from "./AddNewDDQL";
import QuickLink from "./QuickLink";
import {
  List,
  Avatar,
  Button,
  Space,
  Switch,
  Typography,
  Empty,
  ConfigProvider,
  PageHeader,
} from "antd";
const { Title, Text } = Typography;
import { get, post } from "../../utilities";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
export default function DDQLSection(props) {
  const scrollToRef = useRef(null);
  useEffect(() => {
    if (!scrollToRef.current) return;
    scrollToRef.current.scrollIntoView({ behavior: "smooth" });
  });
  let initialAdded = props.dataSource
    .filter((ddql) => {
      return ddql.addedUserIds.includes(props.user.userId);
    })
    .map((ddql) => {
      return ddql._id;
    });
  let initialVerified = props.dataSource
    .filter((ddql) => {
      return ddql.verified;
    })
    .map((ddql) => {
      return ddql._id;
    });
  let initialCompleted = props.dataSource
    .filter((ddql) => {
      return (ddql.completedUserIds || []).includes(props.user.userId);
    })
    .map((ddql) => {
      return ddql._id;
    });
  const [showCompleted, setShowCompleted] = React.useState(false);
  const [addedDDQLs, setAddedDDQLs] = React.useState(initialAdded); // ids
  const [verifiedDDQLs, setVerifiedDDQLs] = React.useState(initialVerified); // ids
  const [completedDDQLs, setCompletedDDQLs] = React.useState(initialCompleted); // ids
  const [showAddNewDueDate, setShowAddNewDueDate] = React.useState(false);
  const verifyDDQL = (input) => {
    post("/api/verifyDDQL", input).then((data) => {
      if (data.verified) {
        if (input.verified) {
          let newVerified = verifiedDDQLs.map((id) => {
            return id;
          });
          newVerified.push(input.objectId);

          setVerifiedDDQLs(newVerified);
        } else {
          let newVerified = verifiedDDQLs.filter((id) => {
            return id !== input.objectId;
          });

          setVerifiedDDQLs(newVerified);
        }
      }
    });
  };
  const addOrCompleteDDQL = (input) => {
    post("/api/addOrCompleteDDQL", Object.assign(input, { amount: "single" })).then((result) => {
      if (!result.done) return;
      if (input.action === "add") {
        let newAddedDDQLs = addedDDQLs.concat([]);
        newAddedDDQLs.push(input.objectId);
        setAddedDDQLs(newAddedDDQLs);
      } else if (input.action === "remove") {
        let newAddedDDQLs = addedDDQLs.filter((id) => {
          return id !== input.objectId;
        });
        setAddedDDQLs(newAddedDDQLs);
        let newCompletedDDQLs = completedDDQLs.filter((id) => {
          return id !== input.objectId;
        });
        setCompletedDDQLs(newCompletedDDQLs);
      } else if (input.action === "complete") {
        let newCompletedDDQLs = completedDDQLs.concat([]);

        newCompletedDDQLs.push(input.objectId);
        setCompletedDDQLs(newCompletedDDQLs);
      } else if (input.action === "uncomplete") {
        let newCompletedDDQLs = completedDDQLs.filter((id) => {
          return id !== input.objectId;
        });
        setCompletedDDQLs(newCompletedDDQLs);
      }
    });
  };

  let dataSource = props.dataSource;
  let addedDataSource = dataSource.filter((ddql) => {
    return !ddql.deleted && (addedDDQLs.includes("" + ddql._id) || ddql.verified);
  });

  let addNewDueDate = showAddNewDueDate ? (
    <AddNewDDQL
      public={dataSource.filter((ddql) => {
        return ddql.visibility === "Public" && !addedDDQLs.includes("" + ddql._id);
      })}
      createNewDDQL={(input) => {
        props.createNewDDQL(input, (id) => {
          let newAddedDDQLs = addedDDQLs.concat([]);
          newAddedDDQLs.push(id);
          setAddedDDQLs(newAddedDDQLs);
        });
      }}
      visible={showAddNewDueDate}
      setVisible={setShowAddNewDueDate}
      addOrCompleteDDQL={addOrCompleteDDQL}
      type={props.type}
    />
  ) : (
    <></>
  );

  return (
    <>
      <PageHeader
        title={props.type === "DueDate" ? "Due Dates" : "Quicklinks"}
        extra={[
          props.type === "QuickLink" ? (
            <></>
          ) : (
            <Button
              onClick={() => {
                setShowCompleted(!showCompleted);
              }}
              shape={"round"}
            >
              {!showCompleted ? "Show Completed" : "Hide Completed"}
            </Button>
          ),
          !props.home ? (
            <Button
              onClick={() => {
                setShowAddNewDueDate(true);
              }}
              type="primary"
              shape="round"
              icon={<PlusOutlined />}
            >
              Add
            </Button>
          ) : (
            <></>
          ),
        ]}
      ></PageHeader>

      {props.home ? <></> : addNewDueDate}
      <div style={{ maxHeight: "250px", overflow: "auto" }}>
        <ConfigProvider
          renderEmpty={() => {
            return (
              <Empty
                description={"No " + (props.type === "DueDate" ? "Due Dates" : "Quicklinks")}
              />
            );
          }}
        >
          <List
            size="large"
            dataSource={addedDataSource
              .filter((item) => {
                if (item.deleted) return false;
                if (!showCompleted) return !completedDDQLs.includes("" + item._id);
                return true;
              })
              .concat(
                props.type === "DueDate"
                  ? [
                      {
                        objectType: "DueDate",
                        dueDate: new Date(new Date() - 1000 * 60 * 60 * 24 * 7),
                        marker: true,
                      },
                    ]
                  : []
              )
              .sort((a, b) => {
                let diff = 0;
                if (a.objectType === "DueDate") {
                  diff = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                } else {
                  diff = (a.addedUserIds.length - b.addedUserIds.length) * -1;
                }
                return diff === 0 ? (a._id + "").localeCompare(b._id + "") : diff;
              })}
            renderItem={(item) => {
              // console.log("hi:" + completedDDQLs.includes("" + item._id));
              if (item.marker) return <div ref={scrollToRef} />;
              return props.type === "DueDate" ? (
                <DueDate
                  dueDate={item}
                  addOrCompleteDDQL={addOrCompleteDDQL}
                  added={addedDDQLs.includes("" + item._id)}
                  completed={completedDDQLs.includes("" + item._id)}
                  home={props.home}
                  pageMap={props.pageMap}
                  verify={
                    props.page
                      ? props.page.adminIds.includes(props.user.userId) || props.isSiteAdmin
                      : false
                  }
                  verified={verifiedDDQLs.includes("" + item._id)}
                  verifyDDQL={verifyDDQL}
                  editDDQL={props.editDDQL}
                  userId={props.user.userId}
                />
              ) : (
                <QuickLink
                  quickLink={item}
                  addOrCompleteDDQL={addOrCompleteDDQL}
                  added={addedDDQLs.includes("" + item._id)}
                  home={props.home}
                  pageMap={props.pageMap}
                  userId={props.user.userId}
                  verify={
                    props.page
                      ? props.page.adminIds.includes(props.user.userId) || props.isSiteAdmin
                      : false
                  }
                  verified={verifiedDDQLs.includes("" + item._id)}
                  verifyDDQL={verifyDDQL}
                  editDDQL={props.editDDQL}
                />
              );
            }}
          />
        </ConfigProvider>
      </div>
    </>
  );
}
