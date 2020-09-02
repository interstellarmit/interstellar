import React, { useState } from "react";
import { AutoComplete, Input } from "antd";
const { Option } = AutoComplete;

export default function SearchBar(props) {
  const [query, setQuery] = useState("");

  let search = (name) => {
    let page = props.allPages.filter((page) => {
      return page.name.toLowerCase() === name.toLowerCase();
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
            page.pageType === "Class"
          );
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
    },
    {
      label: "Groups",
      options: props.allPages
        .filter((page) => {
          return (
            ((page.name.toLowerCase().includes(query.toLowerCase()) ||
              page.title.toLowerCase().includes(query.toLowerCase())) &&
              page.pageType === "Group" &&
              !page.locked) ||
            (page.pageType === "Group" && page.name.toLowerCase() === query.toLowerCase())
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
    <AutoComplete
      dropdownClassName="certain-category-search-dropdown"
      dropdownMatchSelectWidth={props.size === "large" ? undefined : 500}
      style={{ width: "calc(100% - 32px)", margin: "16px" }}
      onChange={(queryy) => {
        setQuery(queryy);
      }}
      defaultOpen={props.defaultOpen}
      onSelect={(selected) => {
        search(selected);
      }}
      options={options}
    >
      <Input.Search
        size={props.size}
        placeholder={props.placeholder || "Search for a class or group"}
        enterButton
        onPressEnter={() => {
          search(query);
        }}
      />
    </AutoComplete>
  );
}
