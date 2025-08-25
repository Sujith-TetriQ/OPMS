import React, { useState } from "react";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";

// Icons
import { MdAnnouncement, MdNotifications, MdWarning, MdPostAdd } from "react-icons/md";
import { FaBullhorn, FaExclamationTriangle, FaBell, FaRegCommentDots } from "react-icons/fa";
import { FiThumbsUp, FiMessageCircle, FiShare2 } from "react-icons/fi";
import { BsCalendarDate } from "react-icons/bs";

import "./index.css";

const RecentPost = () => {

  const recentPosts = [
    {

      id: 1,
      user: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      type: "announcement",
      role: "HR Manager",
      team: "Human Resources",
      timeAgo: "3d ago",
      date: "13/08/2025",
      content:
        "Exciting news! We're expanding our remote work policy starting next month. All employees will have the flexibility to work from home up to 3 days per week. Check your email for the complete guidelines.",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&h=300&fit=crop",
      likes: 24,
      comments: 8,
      shares: 3,

    },
    {
      id: 2,
      user: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      type: "announcement",
      role: "HR Manager",
      team: "Human Resources",
      timeAgo: "3d ago",
      date: "13/08/2025",
      content:
        "Exciting news! We're expanding our remote work policy starting next month. All employees will have the flexibility to work from home up to 3 days per week. Check your email for the complete guidelines.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop",
      likes: 24,
      comments: 8,
      shares: 3,
    },
  ];
  const getPostIcon = (type) => {
    switch (type) {
      case "announcement":
        return <FaBullhorn className="text-success me-1" />;
      case "alert":
        return <FaExclamationTriangle className="text-danger me-1" />;
      case "notification":
        return <FaBell className="text-primary me-1" />;
      case "message":
        return <FaRegCommentDots className="text-info me-1" />;
      default:
        return null;
    }
  };


  return (
    <>


      {/* Recent Posts Section */}

      <div className="recent-posts">

        <div className="recent-header d-flex align-items-center mb-3">
          {/* Left: Icon + Title */}
          <div className="d-flex align-items-center ">
            {/* <FiMessageCircle className="text-primary me-2" /> */}


            <MdOutlineChatBubbleOutline />
            <h3 className="fw-bold mb-0 recentTitle">Recent Posts</h3>
          </div>

          {/* Divider line */}
          <div className="flex-grow-1 border-bottom mx-3"></div>

          {/* Right: Text */}
          <span className="text-muted small">Last 3 months</span>
        </div>

        {/* Post List */}
        <div className="recent-posts-list">
          {recentPosts.map((post) => (
            <div key={post.id} className="post-card border rounded-3 p-3 mb-3 shadow-sm bg-white postDetails">
              {/* User Info */}
              <div className="d-flex align-items-start mb-2">
                <img
                  src={post.avatar || "https://via.placeholder.com/40?text=SJ"}
                  alt="User Avatar"
                  className="rounded-circle me-2"
                  width="40"
                  height="40"
                />
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0 me-2 userName">{post.user}</h5>
                    <span className={`badge ${post.type === "announcement" ? "bg-success-subtle text-success" : "bg-secondary-subtle text-dark"}`}>
                      {getPostIcon(post.type)} {post.type}
                    </span>
                  </div>
                  <small className="text-muted">
                    {post.role} • {post.team} • {post.timeAgo}
                  </small>
                </div>
                {/* <span className="text-muted small">...</span> */}
              </div>

              {/* Post Content */}
              <p className="mb-2">{post.content}</p>

              {/* Optional Image */}
              {post.image && (
                <img
                  src={post.image}
                  alt="Post Content"
                  className="img-fluid rounded mb-2"
                />
              )}

              {/* Actions */}
              <div className="actions d-flex justify-content-between text-muted small">
                <span>
                  <AiOutlineHeart />{post.likes}
                </span>
                <span>
                  <FiMessageCircle /> {post.comments}
                </span>
                <span>
                  <FiShare2 /> {post.shares}
                </span>
                <span>
                  <BsCalendarDate /> {post.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </>
  );
};

export default RecentPost;
