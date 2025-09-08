import React from "react";
import Post from "@components/post";
import { useTheme } from '@context/ThemeContext';
import {
  MdAnnouncement,
  MdNotifications,
  MdWarning,
  MdPostAdd,
  MdOutlineChatBubbleOutline
} from "react-icons/md";
import "./index.css";

export default function PostList({ posts, setPosts }) {
  const { themeMode } = useTheme();
  const API_URL = "https://demomain.com/dashboard/post";

  /** 🔹 Like Toggle */
  const handleLike = async (postId, isLiking) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              reactions: {
                ...p.reactions,
                likes: isLiking ? p.reactions.likes + 1 : p.reactions.likes - 1,
              },
            }
          : p
      )
    );

    try {
      const post = posts.find((p) => p.id === postId);
      await fetch(`${API_URL}/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reactions: post.reactions }),
      });
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };

  /** 🔹 Add Comment */
  const handleAddComment = async (postId, text) => {
    const newComment = {
      id: Date.now(),
      body: text,
      user: { name: "You", role: "Frontend Developer" },
      date: new Date().toISOString(),
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: [...(p.comments || []), newComment] }
          : p
      )
    );

    try {
      const post = posts.find((p) => p.id === postId);
      await fetch(`${API_URL}/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comments: [...(post.comments || []), newComment],
        }),
      });
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  /** 🔹 Edit Comment */
  const handleEditComment = async (postId, commentId, newText) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                c.id === commentId ? { ...c, body: newText } : c
              ),
            }
          : p
      )
    );

    try {
      const post = posts.find((p) => p.id === postId);
      const updatedComments = post.comments.map((c) =>
        c.id === commentId ? { ...c, body: newText } : c
      );

      await fetch(`${API_URL}/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: updatedComments }),
      });
    } catch (err) {
      console.error("Error editing comment:", err);
    }
  };

  /** 🔹 Extra: Post Type Badge UI */
  const renderPostTypeBadge = (postType) => {
    if (!postType) return null;
    const ICONS = {
      normal: <MdPostAdd />,
      announcement: <MdAnnouncement />,
      notification: <MdNotifications />,
      alert: <MdWarning />,
    };
    const COLORS = {
      normal: "bg-blue-100 text-blue-600",
      announcement: "bg-green-100 text-green-600",
      notification: "bg-orange-100 text-orange-600",
      alert: "bg-red-100 text-red-600",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-medium ${COLORS[postType.value]}`}
        style={{ marginRight: "6px" }}
      >
        {ICONS[postType.value]} <span style={{ marginLeft: "4px" }}>{postType.label}</span>
      </span>
    );
  };

  /** 🔹 Extra: Departments UI */
  const renderDepartments = (departments) => {
    if (!departments || departments.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {departments.map((dept) => (
          <span
            key={dept.value}
            className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs"
          >
            {dept.label}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="recentSection">
       <div className="recent-header d-flex align-items-center mb-3">
          {/* Left: Icon + Title */}
                <div className="d-flex align-items-center ">
                  {/* <FiMessageCircle className="text-primary me-2" /> */}
      
      
                  <MdOutlineChatBubbleOutline />
                  <div className="mb-0 recentTitle">Recent Posts</div>
                </div>
      
                {/* Divider line */}
                <div className="flex-grow-1 border-bottom mx-3"></div>
      
                {/* Right: Text */}
                <span className="text-muted small">Last 3 months</span>
              </div>
              <div className={`postSection ${themeMode === "dark" ? "dark-mode" : ""}`}>
      {posts.map((post) => (
        <div key={post.id} className="">
                  {/* <div key={post.id} className="mb-4 p-3 bg-white shadow rounded-lg"> */}

          {/* 🔹 Post Type + Dept */}
          {/* <div className="mb-2 flex flex-col">
            {renderPostTypeBadge(post.postType)}
            {renderDepartments(post.departments)}
          </div> */}

          {/* 🔹 Post Component (your original UI for content, likes, comments) */}
          <Post
            post={post}
            onLike={handleLike}
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
          />
        </div>
      ))}
      </div>
    </div>
  );
}

 
