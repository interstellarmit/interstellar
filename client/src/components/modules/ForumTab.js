import React, { Component } from "react";
import { post } from "../../utilities";
import { Row, Col, List, Space } from "antd";
import ActivePost from "./ActivePost";
import AddPost from "./AddPost";
import PostListItem from "./PostListItem";

class ForumTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupPosts: [],
      activePost: null,
      select: "all",
    };
  }

  /** API Calls **/
  createNewPost = (data) => {
    post("/api/createNewGroupPost", {
      title: data.title,
      text: data.text,
      labels: data.labels,
      pageId: this.props.page._id,
    }).then((ret) => {
      if (!ret.created) return;
      this.setState({
        groupPosts: [
          {
            post: ret.post,
            comments: [],
          },
          ...this.state.groupPosts,
        ],
      });
    });
  };

  createNewComment = (data) => {
    post("/api/createNewComment", {
      text: data.text,
      postId: data.postId,
      pageId: this.props.page._id,
    }).then((ret) => {
      if (!ret.created) return;
      let groupPosts = this.state.groupPosts;
      let commentedPost = groupPosts.find((onePost) => {
        return onePost.post._id == ret.comment.postId;
      });
      commentedPost.comments.push(ret.comment);
      this.setState({ groupPosts: groupPosts });
    });
  };

  updatePost = (data) => {
    post("/api/updateGroupPost", data).then((ret) => {
      if (!ret.updated) return;

      let updatedGroupPosts = this.state.groupPosts.map((x) => {
        if (x.post._id == ret.post._id) {
          this.setState({
            activePost: {
              post: ret.post,
              comments: x.comments,
            },
          });
          return {
            post: ret.post,
            comments: x.comments,
          };
        } else {
          return x;
        }
      });

      this.setState({
        groupPosts: updatedGroupPosts,
      });
    });
  };

  updateComment = (data) => {
    post("/api/updateComment", data).then((ret) => {
      if (!ret.updated) return;
      let groupPosts = this.state.groupPosts;
      let updatedPost = groupPosts.find((onePost) => {
        return onePost.post._id == ret.comment.postId;
      });
      let updatedComment = updatedPost.comments.find((oneComment) => {
        return oneComment._id == ret.commentId;
      });
      updatedComment = ret.comment;
      this.setState({ groupPosts: groupPosts });
    });
  };

  /** Utility Functions **/
  setActivePost = (post) => {
    this.setState({
      activePost: post,
    });
  };

  componentDidMount() {
    // fix height of div
    document.getElementsByClassName("ant-tabs-content")[0].style.height = "100%";

    post("/api/joinForum", {
      pageId: this.props.page._id,
    }).then((data) => {
      let groupPosts = data.groupPosts;
      groupPosts = groupPosts.sort((a, b) => {
        if (a.post.timestamp > b.post.timestamp) return -1;
        return 1;
      });

      let activePost = null;
      if (groupPosts.length !== 0) {
        activePost = groupPosts[0];
      }

      this.setState({
        groupPosts: groupPosts,
        activePost: activePost,
      });
    });
  }

  render() {
    return (
      <Row style={{ height: "100%" }}>
        <Col style={{ height: "100%" }} span={8}>
          <div
            style={{
              height: "100%",
              overflow: "auto",
            }}
          >
            <AddPost createNewPost={this.createNewPost} page={this.props.page} />
            <List
              itemLayout="vertical"
              size="large"
              dataSource={this.state.groupPosts}
              renderItem={(onePost) => {
                return (
                  <PostListItem
                    isActivePost={onePost.post._id === this.state.activePost.post._id}
                    updatePost={this.updatePost}
                    setActivePost={this.setActivePost}
                    groupPost={onePost}
                    user={this.props.user}
                    poster={this.props.users.find((oneUser) => {
                      return oneUser.userId == onePost.post.userId;
                    })}
                  />
                );
              }}
            />
          </div>
        </Col>
        <Col style={{ height: "100%" }} span={16}>
          <div
            style={{
              height: "100%",
              overflow: "auto",
            }}
          >
            {this.state.activePost !== null && (
              <ActivePost
                createNewComment={this.createNewComment}
                updatePost={this.updatePost}
                user={this.props.user}
                activePost={this.state.activePost}
                users={this.props.users}
              />
            )}
          </div>
        </Col>
      </Row>
    );
  }
}

export default ForumTab;
