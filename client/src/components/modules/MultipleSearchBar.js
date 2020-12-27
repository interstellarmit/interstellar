import React, { useState } from "react";
import { AutoComplete, Input, Select, Button } from "antd";
import Search from "antd/lib/input/Search";
const { Option, OptGroup } = Select;
import { SendOutlined } from "@ant-design/icons";
export default function MultipleSearchBar(props) {
  const [query, setQuery] = useState("");
  const [classList, setClassList] = useState([]);

  let search = () => {
    if (classList.length === 0) return;
    //console.log("what's good");
    props.addClasses(classList);
  };
  if (props.collapsed) {
    return <></>;
  }

  let options = [
    {
      label: "Classes",
      options: props.allPages
        .filter((page) => {
          return page.pageType === "Class";
        })
        .map((page) => {
          return {
            value: page.name,
            label: (
              <div key={page.name} value={page.name}>
                {page.title === "" ? page.name : page.name + ": " + page.title}
              </div>
            ),
          };
        }),
    } /*,
    {
      label: "Groups",
      options: props.allPages
        .filter((page) => {
          return page.pageType === "Group";
        })
        .map((page) => {
          return {
            value: page.name,
            label: (
              <div key={page.name} value={page.name}>
                {page.name + ": " + page.title}
              </div>
            ),
          };
        }),
    },*/,
  ];

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Select
        mode="multiple"
        style={{ width: "calc(100% - 46px)" }}
        placeholder={props.placeholder}
        defaultValue={[]}
        defaultOpen
        onChange={(value) => {
          //(value);
          setClassList(value);
        }}
      >
        <OptGroup label="Classes">
          {options[0].options.map((option) => {
            return <Option key={option.value}> {option.label} </Option>;
          })}
        </OptGroup>
      </Select>
      <Button
        onClick={() => {
          search();
        }}
        type="primary"
        style={{ width: "46px" }}
        icon={<SendOutlined />}
      ></Button>
    </div>
  );
}
