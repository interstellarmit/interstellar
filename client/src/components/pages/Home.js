import React, { Component } from "react";
import { get, post } from "../../utilities";



class Home extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      users: [],
      dueDates: [],
      quickLinks: [],
      lounges: [],
    };
    props.updateSelectedPageName("")
  }

  componentDidMount() {
    post("api/joinPage", {home: true}).then((data) => {
      this.setState({
        users: data.users,
        dueDates: data.dueDates,
        quickLinks: data.quickLinks,
        lounges: data.lounges,
    })})
  }

  render() {
    return (
      <>
        Home
      </>
    );
  }
}

export default Home;
