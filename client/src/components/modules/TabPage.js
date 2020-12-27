import React, { Component, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, NavLink, Switch } from "react-router-dom";
import { Tabs } from "antd";

const { TabPane } = Tabs;

export default function TabPage(props) {
  let url = props.page
    ? "/" + props.semester + "/" + props.page.pageType.toLowerCase() + "/" + props.page.name
    : "";

  return (
    <Router>
      <Switch>
        <Route
          path={url + "/:routeLink?"}
          render={({ match, history }) => {
            return (
              <Switch>
                <Tabs
                  style={{
                    height: "100%",
                  }}
                  defaultActiveKey={match.params.routeLink || props.defaultRouterLink}
                  onChange={(key) => {
                    if (key === "forum") {
                      // console.log("clear");
                      props.clearForumCounter();
                    }
                    history.push(url + "/" + key);
                  }}
                >
                  {(Array.isArray(props.children) ? props.children : [props.children]).map(
                    (child, index) => {
                      return (
                        <TabPane
                          style={{
                            height: "100%",
                          }}
                          tab={props.labels[index]}
                          key={props.routerLinks[index]}
                        >
                          {child}
                        </TabPane>
                      );
                    }
                  )}
                </Tabs>
              </Switch>
            );
          }}
        />
      </Switch>
    </Router>
  );
}
