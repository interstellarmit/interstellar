import { Descriptions, Layout, PageHeader, Typography } from "antd";
import React, { Component } from "react";
import { post } from "../../utilities";
import MySpin from "../modules/MySpin";

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

class UserPage extends Component {
  constructor(props) {
    super(props);
    let selectedPage = this.props.computedMatch.params.selectedPage;
    this.state = {
      pageName: selectedPage,

      worked: false,
      name: "",
      profileVisible: false,
      curLoc: "",
      bio: "",
      activities: "",
      restaurant: "",
      hometown: "",
      advice: "",
      classYear: "",

      pageLoaded: false,
    };
    props.updateSelectedPageName(selectedPage);
  }

  viewProfile() {
    post("/api/viewProfile", { pageName: this.state.pageName }).then((data) => {
      this.setState({
        worked: data.worked,
        name: data.name,
        profileVisible: data.profileVisible,
        curLoc: data.curLoc,
        bio: data.bio,
        activities: data.activities,
        restaurant: data.restaurant,
        hometown: data.hometown,
        advice: data.advice,
        pageLoaded: true,
        classYear: data.classYear,
      });
    });
  }

  componentDidMount() {
    this.viewProfile();
  }

  render() {
    if (!this.state.pageLoaded) {
      return <MySpin />;
    }

    if (!this.state.profileVisible) {
      return (
        <Layout style={{ background: "rgba(240, 242, 245, 1)", height: "100vh" }}>
          <PageHeader
            className="site-layout-sub-header-background"
            style={{ padding: "20px 30px 0px 30px", background: "#fff" }}
            title={this.state.name}
            subTitle={"Profile"}
          ></PageHeader>

          <Content
            style={{
              padding: "0px 30px 30px 30px",
              background: "#fff",
              height: "calc(100% - 64px)",
            }}
          >
            <br></br>
            Sorry, this user's profile is private.
          </Content>
        </Layout>
      );
    }

    let userInfo = [
      { label: "Currently lives in", value: this.state.curLoc },
      { label: "Originally from", value: this.state.hometown },
      { label: "Bio", value: this.state.bio },
      { label: "Activities", value: this.state.activities },
      { label: "Favorite Boston Restaurant", value: this.state.restaurant },
      { label: "Advice", value: this.state.advice },
    ];
    let anyInfo =
      userInfo.filter((entry) => {
        return entry.value && entry.value.length > 0;
      }).length > 0;
    return (
      <Layout style={{ background: "rgba(240, 242, 245, 1)", height: "100vh" }}>
        <PageHeader
          className="site-layout-sub-header-background"
          style={{ padding: "20px 30px 0px 30px", background: "#fff" }}
          title={this.state.name}
          subTitle={this.state.classYear ? "Class of " + this.state.classYear : undefined}
          // title={this.state.page.name}
          // subTitle={this.state.page.title}
        ></PageHeader>

        <Content
          style={{
            padding: "20px 30px 30px 30px",
            background: "#fff",
            height: "calc(100% - 64px)",
          }}
        >
          <Descriptions column={1} bordered={anyInfo}>
            {userInfo
              .filter((entry) => {
                return entry.value && entry.value.length > 0;
              })
              .map((entry) => {
                return <Descriptions.Item label={entry.label}>{entry.value}</Descriptions.Item>;
              })}
          </Descriptions>
          {anyInfo ? "" : "This user has not added a profile yet."}
        </Content>
      </Layout>
    );
  }
}

export default UserPage;
