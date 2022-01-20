import {
  BookOutlined,
  HomeOutlined,
  LogoutOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
//import { redirectPage } from "@reach/router";
import { Layout, Menu, Select } from "antd";
import "antd/dist/antd.css";
import React from "react";
import { useMediaQuery } from "react-responsive";
import logo from "../../public/logo.png";
import "../../utilities.css";
import AddGroup from "./AddGroup";
import SearchBar from "./SearchBar";
const { Option } = Select;

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default function SideBar(props) {
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  let myPages = props.myPages
    ? props.myPages.sort((a, b) => {
        return a.name.localeCompare(b.name);
      })
    : [];
  const [addGroup, setAddGroup] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(isMobile);
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      collapsedWidth={50}
      onCollapse={setCollapsed}
      width={isMobile ? "100%" : "20%"}
      style={{ overflow: "auto" }}
      theme={"light"}
    >
      {collapsed ? (
        <div style={{ margin: "25px 10px 15px 10px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={logo} style={{ height: "30px" }} />
          </div>
        </div>
      ) : (
        <div style={{ margin: "15px 10px 0px 10px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              fontFamily: "Chakra Petch",
              color: " #4090F7",
              fontWeight: "700",
            }}
          >
            <img src={logo} style={{ height: "30px" }} /> <div style={{ width: "10px" }} />
            interstellar
          </div>
        </div>
      )}

      {props.notLoggedIn ? (
        <React.Fragment />
      ) : (
        <React.Fragment>
          <SearchBar
            redirectPage={props.redirectPage}
            collapsed={collapsed}
            allPages={props.allPages}
          />
          {!collapsed && (
            <Select
              defaultValue={props.semester}
              onChange={(value) => {
                props.changeSemester(value);
              }}
              style={{ width: "calc(100% - 32px)", margin: "0px 16px 16px 16px" }}
            >
              <Option value="spring-2022">Spring 2022</Option>
              <Option value="iap-2022">IAP 2022</Option>
              <Option value="fall-2021">Fall 2021</Option>
              <Option value="spring-2021">Spring 2021</Option>
              <Option value="iap-2021">IAP 2021</Option>
              <Option value="fall-2020">Fall 2020</Option>
              <Option value="spring-2020">Spring 2020</Option>
            </Select>
          )}

          <Menu
            theme="light"
            selectedKeys={[props.selectedPageName === "" ? ".ho!!me." : props.selectedPageName]}
            defaultOpenKeys={!isMobile ? ["c", "g"] : []}
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

            {props.loggedIn && (
              <Menu.Item
                key=".log!!out."
                onClick={() => {
                  props.logout();
                }}
                icon={<LogoutOutlined />}
              >
                Logout
              </Menu.Item>
            )}

            {/* <Menu.Item
            key=".log!!state."
            onClick={() => {
              props.logState();
            }}
          >
            Log State
          </Menu.Item> */}
          </Menu>
          <AddGroup
            visible={addGroup}
            setVisible={setAddGroup}
            semester={props.semester}
            redirectPage={props.redirectPageOverall}
            pageIds={props.pageIds}
            updatePageIds={props.updatePageIds}
          />
        </React.Fragment>
      )}
    </Sider>
  );
}
