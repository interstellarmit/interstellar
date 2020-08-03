import React, { Component, useState } from "react";
import { Menu, Dropdown, Layout, AutoComplete, Input } from "antd";
const { Option } = AutoComplete;
import { DownOutlined } from "@ant-design/icons";
import { SelectProps } from "antd/es/select";
export default function SearchBar(props) {
  const [query, setQuery] = React.useState("");
  const [options, setOptions] = useState([]);
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
  return (
    <AutoComplete
      dropdownClassName="certain-category-search-dropdown"
      dropdownMatchSelectWidth={500}
      style={{ width: "calc(100% - 32px)", margin: "16px" }}
      onChange={(query) => {
        setQuery(query);
      }}
      onSelect={(name) => {
        let page = props.allPages.filter((page) => {
          return page.name === name;
        })[0];
        props.redirectPage("/" + page.pageType.toLowerCase() + "/" + page.name);
      }}
    >
      {props.allPages
        .filter((page) => {
          return page.name.startsWith(query);
        })
        .map((page) => (
          <Option key={page.name} value={page.name}>
            {page.name + ": " + page.title}
          </Option>
        ))}
    </AutoComplete>
  );
}
