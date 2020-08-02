import React, { Component, useState } from "react";
import DueDate from "./DueDate";
import AddNewDDQL from "./AddNewDDQL";
import QuickLink from "./QuickLink";
import { List, Avatar, Button, Space, Switch, Typography } from 'antd';
const { Title, Text } = Typography;
import { get, post } from "../../utilities";
import {PlusOutlined, MinusOutlined} from "@ant-design/icons"; 
export default function DDQLSection(props) {
  let initialAdded = props.dataSource.filter((ddql) => {return ddql.addedUserIds.includes(props.user.userId)}).map((ddql)=>{return ddql._id})
  let initialCompleted = props.dataSource.filter((ddql) => {
    return (ddql.completedUserIds || []).includes(props.user.userId)}).map((ddql)=>{return ddql._id})
  const [showCompleted, setShowCompleted] = React.useState(false)
  const [addedDDQLs, setAddedDDQLs] = React.useState(initialAdded); // ids
  const [completedDDQLs, setCompletedDDQLs] = React.useState(initialCompleted); // ids
  const [showAddNewDueDate, setShowAddNewDueDate] = React.useState(false)
  const addOrCompleteDDQL = (input) => {
    post("/api/addOrCompleteDDQL", Object.assign(input, {amount: "single"})).then((result) => {
      if (!result.done) return;
      if (input.action === "add") {
        let newAddedDDQLs = addedDDQLs.concat([])
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
        let newCompletedDDQLs = completedDDQLs.concat([])

        newCompletedDDQLs.push(input.objectId);
        console.log("New")
        console.log(newCompletedDDQLs)
        setCompletedDDQLs(newCompletedDDQLs);
      } else if (input.action === "uncomplete") {
        let newCompletedDDQLs = completedDDQLs.filter((id) => {
          return id !== input.objectId;
        });
        setCompletedDDQLs(newCompletedDDQLs);
      }
    });
  };

  let dataSource = props.dataSource
  let addedDataSource = dataSource.filter((ddql) => {
    return !ddql.deleted && addedDDQLs.includes(""+ddql._id)
  })

  let addNewDueDate = showAddNewDueDate ? <AddNewDDQL
    public = {dataSource.filter((ddql)=>{return (ddql.visibility === "Public") && (!addedDDQLs.includes(""+ddql._id)) })}
    createNewDDQL = {(input) => {
      props.createNewDDQL(input, (id) => {
        let newAddedDDQLs = addedDDQLs.concat([])
        newAddedDDQLs.push(id);
        setAddedDDQLs(newAddedDDQLs);
      })
    }}
    visible = {showAddNewDueDate}
    setVisible = {setShowAddNewDueDate}
    addOrCompleteDDQL={addOrCompleteDDQL}
    type = {props.type}
  />: <></>

  return (
    <>
      <Space align="start">
      <Title level={3}>{props.type === "DueDate" ? "Due Dates" : "Quicklinks"}</Title>
      <Button onClick={()=>{
        setShowAddNewDueDate(true)
      }}><PlusOutlined /></Button>
      {props.type==="QuickLink" ? <></> : <Switch onChange={(checked)=>{setShowCompleted(checked)}} />}
      </Space>
      {addNewDueDate}
      <List
        dataSource={addedDataSource.filter((item)=>{
          if(!showCompleted) 
            return !completedDDQLs.includes(""+item._id)
          return true
        })}
        renderItem={item => {
          console.log("hi:"+ completedDDQLs.includes(""+item._id))
          return (props.type === "DueDate") ?
          <DueDate
              dueDate={item}
              addOrCompleteDDQL={addOrCompleteDDQL}
              added={addedDDQLs.includes(""+item._id)}
              completed={completedDDQLs.includes(""+item._id)}
            
            />
            :
            <QuickLink
              quickLink={item}
              addOrCompleteDDQL={addOrCompleteDDQL}
              added={addedDDQLs.includes(""+item._id)}
            />
        }}
        />

      
   
    </>
  );
}
