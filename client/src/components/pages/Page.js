import React, { Component } from "react";
import { get, post } from "../../utilities";
import DashboardTab from "../modules/DashboardTab";
import ForumTab from "../modules/ForumTab";
import LoungeTab from "../modules/LoungeTab";
import InfoTab from "../modules/InfoTab";
import TabPage from "../modules/TabPage";
import { Spin } from 'antd';

class Page extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    let selectedPage = this.props.computedMatch.params.selectedPage
    console.log(selectedPage)
    this.state = {
      pageName: selectedPage,
      users: [],
      dueDates: [],
      quickLinks: [],
      lounges: [],
      page: {},
      pageLoaded: false
    };
    props.updateSelectedPageName(selectedPage)
  }

  componentDidMount() {
    post("/api/joinPage", {pageName: this.state.pageName, schoolId: this.props.schoolId}).then((data) => {
      console.log(data)
      this.setState({
        users: data.users,
        dueDates: data.dueDates,
        quickLinks: data.quickLinks,
        lounges: data.lounges,
        page: data.page,
        pageLoaded: true  
    })})
    // remember -- api calls go here!
  }

  render() {
    if(!this.state.pageLoaded) {
      return (<div>Loading</div>)
    }
    return (
      <>
        <TabPage
          labels={["Dashboard", "Lounges", "Forum", "Info"]}
          routerLinks={["dashboard", "lounges", "forum", "info"]}
          defaultRouterLink={"dashboard"}
          page={this.state.page}
        > 
        
          <DashboardTab />
          <LoungeTab />
          <ForumTab />
          <InfoTab />

        </TabPage>
      </>
    );
  }
}

export default Page;
