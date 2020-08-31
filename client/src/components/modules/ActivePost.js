import React, { useState, useEffect } from "react";
import { Typography, Comment, Form, Input, Button, List, Divider } from "antd";
import { StarOutlined, StarFilled, DeleteOutlined } from "@ant-design/icons";
import ProfilePic from "./ProfilePic";
import { post } from "../../utilities";
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';

const { TextArea } = Input;
const { Title } = Typography;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length != 1 ? "replies" : "reply"}`}
    itemLayout="horizontal"
    renderItem={(props) => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item style={{ marginTop: "0px" }}>
      <TextArea rows={2} placeholder="Type a reply..." onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item style={{ marginBottom: "0px" }}>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        Add Comment
      </Button>
    </Form.Item>
  </>
);

export default function ActivePost(props) {
  const [comments, setComments] = useState([]);
  const [reacts, setReacts] = useState([]);
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setComments(props.activePost.comments);
    setReacts(props.activePost.post.reacts);
  });

  const poster = props.users.find((oneUser) => {
    return oneUser.userId === props.activePost.post.userId;
  }) || { userId: "", name: "Former Member" };

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleReplySubmit = () => {
    if (!reply) {
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      props.createNewComment({
        text: reply,
        postId: props.activePost.post._id,
      });

      setSubmitting(false);
      setReply("");
    }, 500);
  };

  const handleReact = () => {
    props.updatePost({
      postId: props.activePost.post._id,
      reacting: true,
    });
  };

  const handleDelete = () => {
    props.deletePost({
      postId: props.activePost.post._id,
    });
  };

  return (
    <>
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #d9d9d9",
          boxSizing: "borderBox",
          borderRadius: "10px",
          padding: "20px 20px 20px 20px",
          margin: "0px 0px 0px 10px",
          boxShadow: "0 10px 25px rgba(0,0,0,.02), 0 4px 10px rgba(0,0,0,.02)",
        }}
      >
        {/* Poster + Stardust */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                marginRight: "10px",
              }}
            >
              <ProfilePic size={35} user={poster} />
            </div>
            <div
              style={{
                fontSize: "15px",
              }}
            >
              {poster.name}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                marginRight: "5px",
              }}
            >
              {reacts.length}
            </div>
            <div
              style={{
                cursor: "pointer",
                fontSize: "20px",
                marginRight: "10px",
              }}
              onClick={handleReact}
            >
              {reacts.includes(props.user.userId) ? <StarFilled /> : <StarOutlined />}
            </div>
            <div
              style={{
                cursor: "pointer",
                fontSize: "20px",
              }}
              onClick={handleDelete}
            >
              {poster.userId === props.user.userId || props.isPageAdmin ? <DeleteOutlined /> : ""}
            </div>
          </div>
        </div>

        {/* Title and Text */}
        <Title level={3}>{props.activePost.post.title}</Title>
        <div
          style={{
            fontSize: "15px",
            marginBottom: "10px",
          }}
        >
          {props.activePost.post.text}
        </div>

        {/* Comments */}
        {comments.length > 0 ? (
          <CommentList
            comments={comments.map((c) => {
              var author = props.users.find((oneUser) => {
                return oneUser.userId === c.userId;
              }) || { userId: "", name: "Former Member" };
              return {
                author: author.name,
                avatar: <ProfilePic user={author} />,
                content: <p>{c.text}</p>,
              };
            })}
          />
        ) : (
            <Divider />
          )}

        {/* Editor */}
        <Comment
          avatar={<ProfilePic user={props.user} />}
          content={
            <Editor
              onChange={handleReplyChange}
              onSubmit={handleReplySubmit}
              submitting={submitting}
              value={reply}
            />
          }
        />
      </div>
    </>
  );
}
