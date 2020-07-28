import React, { Component } from "react";
import { get, post } from "../../utilities";



class Page extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    let selectedPage = this.props.computedMatch.params.selectedPage
    this.state = {
      pageName: selectedPage,
      users: [],
      dueDates: [],
      quickLinks: [],
      lounges: [],
      page: {}
    };
    props.updateSelectedPageName(selectedPage)
  }

  componentDidMount() {
    post("api/joinPage", {pageName: this.state.pageName, schoolId: this.props.schoolId}).then((data) => {
      this.setState({
        users: data.users,
        dueDates: data.dueDates,
        quickLinks: data.quickLinks,
        lounges: data.lounges,
        page: data.page  
    })})
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
        Page
      </>
    );
  }
}

export default Page;
