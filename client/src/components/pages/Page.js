import React, { Component } from "react";
import { get, post } from "../../utilities";
import DashboardTab from "../modules/DashboardTab";
import ForumTab from "../modules/ForumTab";
import LoungeTab from "../modules/LoungeTab";
import InfoTab from "../modules/InfoTab";
import TabPage from "../modules/TabPage";
import { Spin } from 'antd';
import { Button } from 'antd';
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

  addNewDDQL = (DDQL) => {
    if(DDQL.objectType === "DueDate") {
      let DDQLs = this.state.dueDates
      DDQLs.push(DDQL) 
      this.setState({dueDates: DDQLs})
    } 
    else {
      let DDQLs = this.state.quickLinks
      DDQLs.push(DDQL) 
      this.setState({quickLinks: DDQLs})
    }
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
        pageLoaded: true,
        inPage: data.inPage  
    })})
    // remember -- api calls go here!
  }

  render() {
    if(!this.state.pageLoaded) {
      return (<Spin />)
    }

    let addClassButton = this.state.inPage ? 
      <Button onClick={() => {
        post("/api/removeSelfFromPage", {pageId: this.state.page._id}).then((data) => {
          if(data.removed) {
            this.props.updatePageIds(this.props.pageIds.filter((id)=>{return id!==this.state.page._id}))
            this.setState({inPage: false})
          }
          else
            console.log("error")

        })
      }}>Remove Class </Button> :
        <Button onClick={() => {
          post("/api/addSelfToPage", {pageId: this.state.page._id}).then((data) => {
            if(data.added)  {
              let newPageIds = this.props.pageIds
              newPageIds.push(this.state.page._id)
              this.props.updatePageIds(newPageIds)
              this.setState({inPage: true})
            }
            else
              console.log("error")

          })
        }}>Add Class</Button>
    return (
      <>
        {addClassButton}
        <TabPage
          labels={["Dashboard", "Lounges", "Forum", "Info"]}
          routerLinks={["dashboard", "lounges", "forum", "info"]}
          defaultRouterLink={this.state.inPage ? "info" : "info"}
          page={this.state.page}
        > 
        
          <DashboardTab />
          <LoungeTab />
          <ForumTab />
          <InfoTab users={this.state.users} inPage={this.state.inPage} page={this.state.page} user={this.props.user} />

        </TabPage>
      </>
    );
  }
}

export default Page;
