import React, { useState } from "react";
import { AutoComplete, Input, Select } from "antd";
const { Option, OptGroup } = Select;

export default function MultipleSearchBar(props) {
  const [query, setQuery] = useState("");

  let search = (name) => {
    let page = props.allPages.filter((page) => {
      return page.name === name;
    })[0];
    if (!page) return;
    if (!name) return;
    setQuery("");
    props.redirectPage("/" + page.pageType.toLowerCase() + "/" + page.name);
  };
  if (props.collapsed) {
    return <></>;
  }

  let options = [
    {
      label: "Classes",
      options: props.allPages
        .filter((page) => {
          return (
            (page.name.toLowerCase().startsWith(query.toLowerCase()) ||
              page.title.toLowerCase().includes(query.toLowerCase())) &&
            page.pageType == "Class"
          );
        })
        .map((page) => {
          return {
            value: page.name,
            label: (
              <div key={page.name} value={page.name}>
                {page.title == "" ? page.name : page.name + ": " + page.title}
              </div>
            ),
          };
        }),
    },
    {
      label: "Groups",
      options: props.allPages
        .filter((page) => {
          return (
            ((page.name.toLowerCase().includes(query.toLowerCase()) ||
              page.title.toLowerCase().includes(query.toLowerCase())) &&
              page.pageType == "Group" &&
              !page.locked) ||
            (page.pageType == "Group" && page.name.toLowerCase() === query.toLowerCase())
          );
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
    },
  ];

  return (
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder="Please select"
      defaultValue={[]}
      onChange={(value) => {
        console.log(value);
      }}
    >
      <OptGroup label="Classes">
        {options[0].options.map((option) => {
          return <Option key={option.value}> {option.label} </Option>;
        })}
      </OptGroup>
      <OptGroup label="Groups">
        {options[1].options.map((option) => {
          return <Option key={option.value}> {option.label} </Option>;
        })}
      </OptGroup>
    </Select>
  );
}
