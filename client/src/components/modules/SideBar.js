import React, { Component, useState } from "react";
import { List } from "antd";
import "antd/dist/antd.css";
import "../../utilities.css";
//import { redirectPage } from "@reach/router";
import { Menu, Dropdown, Layout } from "antd";
import SearchBar from "./SearchBar";
import {
  HomeOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
  BookOutlined,
  TeamOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import logo from "../../public/logo_inverted.png";

import AddGroup from "./AddGroup";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default function SideBar(props) {
  let myPages = props.myPages;
  const [addGroup, setAddGroup] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={"20%"}
      style={{ overflow: "auto", height: "100vh" }}
    >
      {collapsed ? (
        <></>
      ) : (
          <div style={{ margin: "15px 10px 0px 10px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                fontSize: "30px",
                fontFamily: "Chakra Petch",
                color: "#fff",
                fontWeight: "700",
                width: "100%",
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={logo} style={{ height: "30px" }} /> <div style={{ width: "10px" }} />
            interstellar
          </div>
          </div>
        )}
      <SearchBar
        redirectPage={props.redirectPage}
        collapsed={collapsed}
        allPages={props.allPages}
      />
      <Menu
        theme="dark"
        selectedKeys={[props.selectedPageName === "" ? ".ho!!me." : props.selectedPageName]}
        defaultOpenKeys={["c", "g"]}
        mode="inline"
      >
        <Menu.Item
          key=".ho!!me."
          onClick={() => {
            props.redirectPage("/");
          }}
          icon={<HomeOutlined />}
        >
          Home
        </Menu.Item>
        <SubMenu key="c" title="Classes" icon={<BookOutlined />}>
          {myPages
            .filter((page) => {
              return page.pageType === "Class";
            })
            .map((page) => {
              return (
                <Menu.Item
                  key={page.name}
                  onClick={() => {
                    props.redirectPage("/" + page.pageType.toLowerCase() + "/" + page.name);
                  }}
                >
                  {page.name}
                </Menu.Item>
              );
            })}
        </SubMenu>
        <SubMenu key="g" title="Groups" icon={<TeamOutlined />}>
          {myPages
            .filter((page) => {
              return page.pageType === "Group";
            })
            .map((page) => {
              return (
                <Menu.Item
                  key={page.name}
                  onClick={() => {
                    props.redirectPage("/" + page.pageType.toLowerCase() + "/" + page.name);
                  }}
                >
                  {page.name}
                </Menu.Item>
              );
            })}
          <Menu.Item
            key=".add!!group."
            onClick={() => {
              setAddGroup(true);
            }}
            icon={<UsergroupAddOutlined />}
          >
            Create Group
          </Menu.Item>
        </SubMenu>

        <Menu.Item
          key=".log!!out."
          onClick={() => {
            props.logout();
          }}
          icon={<LogoutOutlined />}
        >
          Logout
        </Menu.Item>

        {/* <Menu.Item
            key=".log!!state."
            onClick={() => {
              props.logState();
            }}
          >
            Log State
          </Menu.Item> */}
      </Menu>
      <AddGroup visible={addGroup} setVisible={setAddGroup} redirectPage={props.redirectPage} />
    </Sider>
  );
}

/*
    <List>
        <List.Item onClick={() => {

                    props.redirectPage("/")
                }}>
                    Home
        </List.Item>

    </List>

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
    />  */
