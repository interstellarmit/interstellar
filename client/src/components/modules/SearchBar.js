import React, { Component, useState } from "react";
import { Menu, Dropdown, Layout, AutoComplete, Input } from "antd";
const { Option } = AutoComplete;
import { DownOutlined } from "@ant-design/icons";
import { SelectProps } from "antd/es/select";
export default function SearchBar(props) {
  const [query, setQuery] = React.useState("");
  //const [options, setOptions] = useState([]);
  /*
  searchOptions = (
    <Menu>
      {props.allPages.map((page) => {
        return (
          <Menu.Item
            onClick={() => {
            }}
          >
            {page.name + ": " + page.title}
          </Menu.Item>
        );
      })}
    </Menu>
  );
  <Dropdown overlay={searchOptions}>
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        {props.selectedPageName} <DownOutlined />
      </a>
    </Dropdown>*/
  console.log(props.allPages.length);
  let search = (name) => {
    let page = props.allPages.filter((page) => {
      return page.name === name;
    })[0];
    if (!page) return;
    props.redirectPage("/" + page.pageType.toLowerCase() + "/" + page.name);
  };
  return (
    <AutoComplete
      dropdownClassName="certain-category-search-dropdown"
      dropdownMatchSelectWidth={props.size === "large" ? undefined : 500}
      style={{ width: "calc(100% - 32px)", margin: "16px" }}
      onChange={(query) => {
        setQuery(query);
      }}
      onSearch={search}
      defaultOpen={props.defaultOpen}
      onSelect={search}
      dataSource={props.allPages
        .filter((page) => {
          return (
            page.name.toLowerCase().includes(query.toLowerCase()) ||
            page.title.toLowerCase().includes(query.toLowerCase())
          );
        })
        .map((page) => {
          return (
            <Option key={page.name} value={page.name}>
              {page.name + ": " + page.title}
            </Option>
          );
        })}
    >
      <Input.Search
        size={props.size}
        placeholder={props.placeholder || "Search for a class or group"}
        enterButton={props.collapsed ? undefined : true}
      />
    </AutoComplete>
  );
}
