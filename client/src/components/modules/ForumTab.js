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
    };
  }

  createNewPost = (data) => {
    post("/api/createNewGroupPost", {
      title: data.title,
      text: data.text,
      labels: data.labels,
      pageId: this.props.page._id,
    }).then((ret) => {
      if (!ret.created) return;
      let groupPosts = this.state.groupPosts;
      groupPosts.push({
        post: ret.post,
        comments: [],
      });
      this.setState({ groupPosts: groupPosts });
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
      let groupPosts = this.state.groupPosts;
      let updatedPost = groupPosts.find((onePost) => {
        return onePost.post._id == ret.post.postId;
      });
      updatedPost = ret.post;
      this.setState({ groupPosts: groupPosts });
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

  componentDidMount() {
    post("/api/joinForum", {
      pageId: this.props.page._id,
    }).then((data) => {
      let groupPosts = data.groupPosts;
      groupPosts = data.groupPosts.sort((a, b) => {
        return a.post.timestamp - b.post.timestamp;
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
      <Row>
        <Col span={9}>
          <AddPost createNewPost={this.createNewPost} page={this.props.page} />
          <List
            itemLayout="vertical"
            size="large"
            dataSource={this.state.groupPosts}
            renderItem={(onePost) => {
              return (
                <PostListItem
                  onClick={() => {
                  }}
                  groupPost={onePost}
                  user={this.props.users.find((oneUser) => {
                    return oneUser.userId == onePost.post.userId;
                  })}
                />
              );
            }}
          />
        </Col>
        <Col span={15}>
          {this.state.activePost !== null ? <ActivePost activePost={this.state.activePost} /> : ""}
        </Col>
      </Row>
    );
  }
}

export default ForumTab;
