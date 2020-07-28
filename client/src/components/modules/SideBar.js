import React, { Component, useState } from 'react';
import { List } from "antd";
import 'antd/dist/antd.css';
import { redirectTo } from '@reach/router';

export default function SideBar(props) {
  
  return (
    <List 
        dataSource = {props.pageIds}
        renderItem = {(pageId) => {
            let name = allPages.filter((page) => {
                return page._id === pageId
            })[0].name
            let isSelected = (name === props.selectedPageName)
            return <List.Item
                onClick={() => {
                    
                    props.redirectTo("/class/"+name)
                }}
            >
                {isSelected ? <b>name</b> : name}
            </List.Item>;
        }}
    />
  );
};
