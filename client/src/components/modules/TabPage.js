import React, { Component, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch
} from "react-router-dom";

import { Tabs } from 'antd';

const { TabPane } = Tabs;

export default function TabPage(props) {
  
  return (
    <Router>
      <Switch>
        <Route path={"/"+props.page.pageType.toLowerCase()+"/"+props.page.name+":routeLink?"}
        render= {({ match, history }) => {
          return (
            <Switch>
    <Tabs defaultActiveKey={match.params.routeLink} onChange={
      key => {
        console.log(match);
        history.push("/"+props.page.pageType.toLowerCase()+"/"+props.page.name+"/"+key);
      }
    }>
      {props.children.map((child, index) => {
        return <TabPane tab={props.labels[index]} key={props.routerLinks[index]}>
        {child}
      </TabPane>

      })}
    </Tabs>
     </Switch>
     )}} />
      
    </Switch>
    </Router>
  );
};
