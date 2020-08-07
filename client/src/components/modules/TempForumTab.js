import React, { Component } from "react";
import { post } from "../../utilities";

class TempForumTab extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return `This feature will be launched by semester's start! On the forum, you can post helpful cheat sheets, set up times to PSET with classmates, or drop fire ${this.props.page.name}-related memes.`;
  }
}

export default TempForumTab;
