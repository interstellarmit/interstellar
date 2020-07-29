import React, { Component, useState } from 'react';
import { List } from "antd";
import 'antd/dist/antd.css';
import { redirectPage } from '@reach/router';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export default function SideBar(props) {
  
let searchOptions = (
    <Menu>
        {props.allPages.map((page) => {
            return (
                <Menu.Item onClick={() => {
                    props.redirectPage("/"+page.pageType.toLowerCase() + "/" + page.name)
                }}>
                    {page.name + ": " + page.title}
                </Menu.Item>
            )
        })}
    </Menu>
)
  return (<>
    <List>
        <List.Item onClick={() => {
                    
                    props.redirectPage("/")
                }}>
                    Home
        </List.Item>
                
    </List>
    <Dropdown overlay={searchOptions}>
    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
      {props.selectedPageName} <DownOutlined />
    </a>
    </Dropdown>
    <List 
        dataSource = {props.pageIds}
        renderItem = {(pageId) => {
            let page = props.allPages.filter((page) => {
                return page._id === pageId
            })[0]
            let name = page.name
            
            let isSelected = (name === props.selectedPageName)
            return <List.Item
                onClick={() => {
                    
                    props.redirectPage("/" + page.pageType.toLowerCase() + "/"+name)
                }}
            >
                {isSelected ? <b>{name}</b> : name}
            </List.Item>;
        }}
    />
    </>
  );
};
