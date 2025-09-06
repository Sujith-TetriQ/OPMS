// import React, { useState } from "react";
// import { MdOutlineChatBubbleOutline } from "react-icons/md";
// import { AiOutlineHeart } from "react-icons/ai";

// // Icons
// import { MdAnnouncement, MdNotifications, MdWarning, MdPostAdd } from "react-icons/md";
// import { FaBullhorn, FaExclamationTriangle, FaBell, FaRegCommentDots } from "react-icons/fa";
// import { FiThumbsUp, FiMessageCircle, FiShare2 } from "react-icons/fi";
// import { BsCalendarDate } from "react-icons/bs";

// import "./index.css";

// const RecentPost = ({recentPosts}) => {

 
//   const getPostIcon = (type) => {
//     switch (type) {
//       case "announcement":
//         return <FaBullhorn className="text-success me-1" />;
//       case "alert":
//         return <FaExclamationTriangle className="text-danger me-1" />;
//       case "notification":
//         return <FaBell className="text-primary me-1" />;
//       case "message":
//         return <FaRegCommentDots className="text-info me-1" />;
//       default:
//         return null;
//     }
//   };


//   return (
//     <>


//       {/* Recent Posts Section */}

//       <div className="recent-posts">

//         <div className="recent-header d-flex align-items-center mb-3">
//           {/* Left: Icon + Title */}
//           <div className="d-flex align-items-center ">
//             {/* <FiMessageCircle className="text-primary me-2" /> */}


//             <MdOutlineChatBubbleOutline />
//             <h3 className="fw-bold mb-0 recentTitle">Recent Posts</h3>
//           </div>

//           {/* Divider line */}
//           <div className="flex-grow-1 border-bottom mx-3"></div>

//           {/* Right: Text */}
//           <span className="text-muted small">Last 3 months</span>
//         </div>

//         {/* Post List */}
//         <div className="recent-posts-list">
//           {recentPosts.map((post) => (
//             <div key={post.id} className="post-card border rounded-3 p-3 mb-3 shadow-sm bg-white postDetails">
//               {/* User Info */}
//               <div className="d-flex align-items-start mb-2">
//                 <img
//                   src={post.avatar || "https://via.placeholder.com/40?text=SJ"}
//                   alt="User Avatar"
//                   className="rounded-circle me-2"
//                   width="40"
//                   height="40"
//                 />
//                 <div className="flex-grow-1">
//                   <div className="d-flex align-items-center">
//                     <h5 className="mb-0 me-2 userName">{post.user}</h5>
//                     <span className={`badge ${post.type === "announcement" ? "bg-success-subtle text-success" : "bg-secondary-subtle text-dark"}`}>
//                       {getPostIcon(post.type)} {post.type}
//                     </span>
//                   </div>
//                   <small className="text-muted">
//                     {post.role} • {post.team} • {post.timeAgo}
//                   </small>
//                 </div>
//                 {/* <span className="text-muted small">...</span> */}
//               </div>

//               {/* Post Content */}
//               <p className="mb-2">{post.content}</p>

//               {/* Optional Image */}
//               {post.image && (
//                 <img
//                   src={post.image}
//                   alt="Post Content"
//                   className="img-fluid rounded mb-2"
//                 />
//               )}

//               {/* Actions */}
//               <div className="actions d-flex justify-content-between text-muted small">
//                 <span>
//                   <AiOutlineHeart />{post.likes}
//                 </span>
//                 <span>
//                   <FiMessageCircle /> {post.comments}
//                 </span>
//                 <span>
//                   <FiShare2 /> {post.shares}
//                 </span>
//                 <span>
//                   <BsCalendarDate /> {post.date}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//     </>
//   );
// };

// export default RecentPost;
// import React, { useState } from "react";
// //import Post from "./post";
// import Post from "@components/post";
// //import dummyPosts from "./dummyPosts";

// export default function RecentPost({postDeatils}) {
//   const [posts, setPosts] = useState(postDeatils);
//   const API_URL = "https://demomain.com/dashboard/post";

//   /** 🔹 Like Toggle */
//   const handleLike = async (postId, isLiking) => {
//     setPosts((prev) =>
//       prev.map((p) =>
//         p.id === postId
//           ? {
//               ...p,
//               reactions: {
//                 ...p.reactions,
//                 likes: isLiking ? p.reactions.likes + 1 : p.reactions.likes - 1,
//               },
//             }
//           : p
//       )
//     );

//     try {
//       const post = posts.find((p) => p.id === postId);
//       await fetch(`${API_URL}/${postId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ reactions: post.reactions }),
//       });
//     } catch (err) {
//       console.error("Error updating like:", err);
//     }
//   };

//   /** 🔹 Add Comment */
//   const handleAddComment = async (postId, text) => {
//     const newComment = {
//       id: Date.now(),
//       body: text,
//       user: { name: "You", role: "Frontend Developer" },
//       date: new Date().toISOString(),
//     };

//     setPosts((prev) =>
//       prev.map((p) =>
//         p.id === postId
//           ? { ...p, comments: [...(p.comments || []), newComment] }
//           : p
//       )
//     );

//     try {
//       await fetch(`${API_URL}/${postId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           comments: [...(post.comments || []), newComment],
//         }),
//       });
//     } catch (err) {
//       console.error("Error adding comment:", err);
//     }
//   };

//   /** 🔹 Edit Comment */
//   const handleEditComment = async (postId, commentId, newText) => {
//     setPosts((prev) =>
//       prev.map((p) =>
//         p.id === postId
//           ? {
//               ...p,
//               comments: p.comments.map((c) =>
//                 c.id === commentId ? { ...c, body: newText } : c
//               ),
//             }
//           : p
//       )
//     );

//     try {
//       const post = posts.find((p) => p.id === postId);
//       const updatedComments = post.comments.map((c) =>
//         c.id === commentId ? { ...c, body: newText } : c
//       );

//       await fetch(`${API_URL}/${postId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ comments: updatedComments }),
//       });
//     } catch (err) {
//       console.error("Error editing comment:", err);
//     }
//   };

//   return (
//     // <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
//       <div style={{  }}>
//       {posts.map((post) => (
//         <Post
//           key={post.id}
//           post={post}
//           onLike={handleLike}
//           onAddComment={handleAddComment}
//           onEditComment={handleEditComment}
//         />
//       ))}
//     </div>
//   );
// }
// import React, { useState } from "react";
// import Post from "@components/post";

 
// export default function PostList({ posts, setPosts}) {
//   //const [posts, setPosts] = useState(postDeatils);
//   const API_URL = "https://demomain.com/dashboard/post";
 
//   /** 🔹 Like Toggle */
//   const handleLike = async (postId, isLiking) => {
//     setPosts((prev) =>
//       prev.map((p) =>
//         p.id === postId
//           ? {
//               ...p,
//               reactions: {
//                 ...p.reactions,
//                 likes: isLiking ? p.reactions.likes + 1 : p.reactions.likes - 1,
//               },
//             }
//           : p
//       )
//     );
 
//     try {
//       const post = posts.find((p) => p.id === postId);
//       await fetch(`${API_URL}/${postId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ reactions: post.reactions }),
//       });
//     } catch (err) {
//       console.error("Error updating like:", err);
//     }
//   };
 
//   /** 🔹 Add Comment */
//   const handleAddComment = async (postId, text) => {
//     const newComment = {
//       id: Date.now(),
//       body: text,
//       user: { name: "You", role: "Frontend Developer" },
//       date: new Date().toISOString(),
//     };
 
//     setPosts((prev) =>
//       prev.map((p) =>
//         p.id === postId
//           ? { ...p, comments: [...(p.comments || []), newComment] }
//           : p
//       )
//     );
 
//     try {
//       const post = posts.find((p) => p.id === postId);
//       await fetch(`${API_URL}/${postId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           comments: [...(post.comments || []), newComment],
//         }),
//       });
//     } catch (err) {
//       console.error("Error adding comment:", err);
//     }
//   };
 
//   /** 🔹 Edit Comment */
//   const handleEditComment = async (postId, commentId, newText) => {
//     setPosts((prev) =>
//       prev.map((p) =>
//         p.id === postId
//           ? {
//               ...p,
//               comments: p.comments.map((c) =>
//                 c.id === commentId ? { ...c, body: newText } : c
//               ),
//             }
//           : p
//       )
//     );
 
//     try {
//       const post = posts.find((p) => p.id === postId);
//       const updatedComments = post.comments.map((c) =>
//         c.id === commentId ? { ...c, body: newText } : c
//       );
 
//       await fetch(`${API_URL}/${postId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ comments: updatedComments }),
//       });
//     } catch (err) {
//       console.error("Error editing comment:", err);
//     }
//   };
 
//   return (
//     <div style={{  }}>
//       {posts.map((post) => (
//         <Post
//           key={post.id}
//           post={post}
//           onLike={handleLike}
//           onAddComment={handleAddComment}
//           onEditComment={handleEditComment}
//         />
//       ))}
//     </div>
//   );
// }
import React from "react";
import Post from "@components/post";
import {
  MdAnnouncement,
  MdNotifications,
  MdWarning,
  MdPostAdd,
} from "react-icons/md";

export default function PostList({ posts, setPosts }) {
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
    <div>
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
  );
}

 
