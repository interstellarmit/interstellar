import React, { Component } from "react";
import { get, post } from "../../utilities";
import { Row, Col, Button, List } from "antd";
import ActivePost from "./ActivePost";
import AddPost from "./AddPost";
import PostListItem from "./PostListItem";

class ForumTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupPosts: [],
      activePost: null,
    };
  }

  createNewPost = (data) => {
    post("api/createNewGroupPost", {
      title: data.tiltle,
      text: data.text,
      labels: data.labels,
      pageId: this.props.page._id,
    }).then((data) => {
      if (!data.created) return;
      let groupPosts = this.state.groupPosts;
      groupPosts.push({
        post: data.post,
        comments: [],
      });
      this.setState({ groupPosts: groupPosts });
    });
  };

  createNewComment = (data) => {
    post("api/createNewComment", {
      text: data.text,
      postId: data.postId,
      pageId: this.props.page._id,
    }).then((data) => {
      if (!data.created) return;
      let groupPosts = this.state.groupPosts;
      let commentedPost = groupPosts.find((onePost) => {
        return onePost.post._id == data.postId;
      });
      commentedPost.comments.push(data.comment);
      this.setState({ groupPosts: groupPosts });
    });
  };

  componentDidMount() {
    post("/api/joinForum", {
      pageId: this.props.page._id,
    }).then((data) => {
      let activePost = null;
      if (data.groupPosts.length !== 0) activePost = data.groupPosts[0];
      this.setState({
        groupPosts: data.groupPosts,
        activePost: activePost,
      });
    });
  }

  render() {
    return (
      <Row>
        <Col span={12}>
          <AddPost createNewPost={this.createNewPost} />
          <List
            dataSource={this.state.groupPosts}
            renderItem={(onePost) => {
              return (
                <PostListItem
                  title={onePost.post.title}
                  text={onePost.post.text}
                  user={this.props.users.find((oneUser) => {
                    return oneUser.userId == onePost.post.userId;
                  })}
                />
              );
            }}
          />
        </Col>
        <Col span={12}>
          {this.state.activePost !== null ? <ActivePost post={this.state.activePost} /> : ""}
        </Col>
      </Row>
    );
  }
}

export default ForumTab;
