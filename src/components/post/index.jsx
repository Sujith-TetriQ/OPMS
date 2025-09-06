import React, { useState } from "react";
import "./index.css";

// export default function Post({ post, onLike, onAddComment, onEditComment }) {
//   // Local states
//   const [newComment, setNewComment] = useState(""); // new comment input
//   const [hasLiked, setHasLiked] = useState(false); // track user like
//   const [showComments, setShowComments] = useState(false); // toggle comment section
//   const [editingCommentId, setEditingCommentId] = useState(null); // track which comment is being edited
//   const [editText, setEditText] = useState(""); // edited text

//   // Helper: show how many days ago the post was created
//   const formatTimeAgo = (date) => {
//     const diff = Math.floor(
//       (new Date() - new Date(date)) / (1000 * 60 * 60 * 24)
//     );
//     return diff === 0 ? "Today" : diff === 1 ? "1 day ago" : `${diff} days ago`;
//   };

//   // Handle like/unlike click
//   const handleLikeClick = () => {
//     setHasLiked(!hasLiked); // toggle local state
//     onLike(post.id, !hasLiked); // send to parent (and API)
//   };

//   // Handle adding new comment
//   const handleCommentSubmit = () => {
//     if (!newComment.trim()) return; // ignore empty
//     onAddComment(post.id, newComment); // notify parent
//     setNewComment(""); // clear input
//   };

//   // Handle clicking edit on an existing comment
//   const handleEditClick = (comment) => {
//     setEditingCommentId(comment.id); // store which comment is editing
//     setEditText(comment.body); // pre-fill text
//   };

//   // Handle saving the edited comment
//   const handleSaveEdit = () => {
//     if (!editText.trim()) return;
//     onEditComment(post.id, editingCommentId, editText); // notify parent + API
//     setEditingCommentId(null); // exit edit mode
//     setEditText(""); // clear input
//   };

//   return (
//     <div className="post">
//       {/* ------------------ HEADER ------------------ */}
//       <div className="post-header">
//         <img
//           src={post.user.profilePic}
//           alt={post.user.name}
//           className="post-profile-pic"
//         />
//         <div>
//           <div className="post-user-name">{post.user.name}</div>
//           <div className="post-user-meta">
//             {post.user.role} · {post.user.department} ·{" "}
//             {formatTimeAgo(post.createdAt)}
//           </div>
//         </div>
//       </div>

//       {/* ------------------ CONTENT ------------------ */}
//       <div className="post-content">{post.content}</div>
//       {post.image && <img src={post.image} alt="Post" className="post-image" />}

//       {/* ------------------ ACTIONS ------------------ */}
//       <div className="post-actions">
//         {/* Like button */}
//         <div className="post-action" onClick={handleLikeClick}>
//           {hasLiked ? "❤️" : "🤍"} {post.reactions.likes}
//         </div>

//         {/* Toggle comments */}
//         <div
//           className="post-action"
//           onClick={() => setShowComments(!showComments)}
//         >
//           💬 {post.comments.length}
//         </div>

//         {/* Date */}
//         <div className="post-date">
//           {new Date(post.createdAt).toLocaleDateString()}
//         </div>
//       </div>

//       {/* ------------------ COMMENTS ------------------ */}
//       {showComments && (
//         <div className="post-comments">
//           {/* Input to add new comment */}
//           <div className="comment-input-wrapper">
//             <img
//               src="https://randomuser.me/api/portraits/men/99.jpg"
//               alt="You"
//               className="comment-profile-pic"
//             />
//             <input
//               type="text"
//               placeholder="Write your comment here..."
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               className="comment-input"
//             />
//             <button onClick={handleCommentSubmit} className="comment-send-btn">
//               📤
//             </button>
//           </div>

//           {/* Comment List */}
//           {post.comments.map((comment) => (
//             <div key={comment.id} className="comment">
//               {/* Profile picture */}
//               <img
//                 src={comment.user.profilePic}
//                 alt={comment.user.name}
//                 className="comment-profile-pic"
//               />

//               <div className="comment-body">
//                 {/* Comment header with user details + edit/save button */}
//                 <div className="comment-header">
//                   <div>
//                     <div className="comment-user-name">{comment.user.name}</div>
//                     <div className="comment-user-role">{comment.user.role}</div>
//                   </div>

//                   {/* Show edit/save icon only for current user */}
//                   {comment.user.name === "You" && (
//                     <>
//                       {editingCommentId === comment.id ? (
//                         <button
//                           onClick={handleSaveEdit}
//                           className="comment-icon-btn"
//                           title="Save"
//                         >
//                           💾
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleEditClick(comment)}
//                           className="comment-icon-btn"
//                           title="Edit"
//                         >
//                           ✏️
//                         </button>
//                       )}
//                     </>
//                   )}
//                 </div>

//                 {/* If editing -> input box, else -> normal text */}
//                 {editingCommentId === comment.id ? (
//                   <input
//                     type="text"
//                     value={editText}
//                     onChange={(e) => setEditText(e.target.value)}
//                     className="comment-input"
//                   />
//                 ) : (
//                   <div className="comment-text">{comment.body}</div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

 
// export default function Post({ post, onLike, onAddComment, onEditComment }) {
//   const [newComment, setNewComment] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);

//   const [hasLiked, setHasLiked] = useState(false);
//   const [showComments, setShowComments] = useState(false);
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editText, setEditText] = useState("");
//   const onEmojiClick = (emojiData) => {
//     setNewComment((prev) => prev + emojiData.emoji);
//     setShowEmojiPicker(false);
//   };
//   const formatTimeAgo = (date) => {
//     const diff = Math.floor(
//       (new Date() - new Date(date)) / (1000 * 60 * 60 * 24)
//     );
//     return diff === 0 ? "Today" : diff === 1 ? "1 day ago" : `${diff} days ago`;
//   };
 
//   /** 🔹 Like */
//   const handleLikeClick = () => {
//     setHasLiked(!hasLiked);
//     onLike(post.id, !hasLiked);
//   };
 
//   /** 🔹 Add Comment */
//   const handleCommentSubmit = () => {
//     if (!newComment.trim()) return;
//     onAddComment(post.id, newComment);
//     setNewComment("");
//   };
 
//   /** 🔹 Edit Comment */
//   const handleEditClick = (comment) => {
//     setEditingCommentId(comment.id);
//     setEditText(comment.body);
//   };
 
//   const handleSaveEdit = () => {
//     if (!editText.trim()) return;
//     onEditComment(post.id, editingCommentId, editText);
//     setEditingCommentId(null);
//     setEditText("");
//   };
 
//   return (
//     <div className="post">
//       {/* ------------------ HEADER ------------------ */}
//       <div className="post-header">
//         <img
//           src={post.user.profilePic}
//           alt={post.user.name}
//           className="post-profile-pic"
//         />
//          <div>
//           <div className="user-header">
//            <div className="post-user-name">{post.user.name}</div>
          
//             {post.postType && (
//               <div className="postType text-sm font-semibold text-gray-700">
//                 {post.postType.label}
//               </div>
//             )}
//             </div>
//            <div className="post-user-meta">
//              {post.user.role} · {post.user.department} ·{" "}
//              {formatTimeAgo(post.createdAt)}
//            </div>
//          </div>
//       </div>
 
//       {/* ------------------ CONTENT ------------------ */}
//       <div className="post-content">{post.content}</div>
 
//       {/* 🔹 Media: Image or Video */}
//       {post.image && <img src={post.image} alt="Post" className="post-image" />}
//       {post.video && (
//         <div
//           className="post-video"
//           style={{ display: "flex", justifyContent: "center" }}
//         >
//           {" "}
//           <video
//             src={post.video}
//             className="post-video"
//             muted
//             loop
//             playsInline
//             controls={true}
//           />
//         </div>
//       )}
 
//       {/* ------------------ ACTIONS ------------------ */}
//       <div className="post-actions">
//         <div className="post-action" onClick={handleLikeClick}>
//           {hasLiked ? "❤️" : "🤍"} {post.reactions.likes}
//         </div>
 
//         <div
//           className="post-action"
//           onClick={() => setShowComments(!showComments)}
//         >
//           💬 {post.comments.length}
//         </div>
 
//         <div className="post-date">
//           {new Date(post.createdAt).toLocaleDateString()}
//         </div>
//       </div>
 
//       {/* ------------------ COMMENTS ------------------ */}
//       {showComments && (
//         <div className="post-comments">
//           {/* Input for new comment */}
         
//           <div className="comment-input-wrapper">
//       <img
//         src="https://randomuser.me/api/portraits/men/99.jpg"
//         alt="You"
//         className="comment-profile-pic"
//       />

//       <div className="comment-input-container">
//         <input
//           type="text"
//           placeholder="Write your comment here..."
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           className="comment-input"
//         />

//         <div className="comment-input-icons">
         
//             <div className="icon-separator" /> {/* vertical line */}
//           <button
//             type="button"
//             onClick={handleCommentSubmit}
//             className="comment-send-btn"
//           >
//             <FiSend size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
 
//           {/* List comments */}
//          {post.comments.map((comment) => (
//   <div key={comment.id} className="comment">
//     <img
//       src={comment.user.profilePic}
//       alt={comment.user.name}
//       className="comment-profile-pic"
//     />

//     <div className="comment-body">
//       <div className="comment-header">
//         <div>
//           <div className="comment-user-name">{comment.user.name}</div>
//           <div className="comment-user-role">{comment.user.role}</div>
//         </div>

//         {comment.user.name === "You" && (
//           <>
//             {editingCommentId === comment.id ? (
//               <button
//                 onClick={handleSaveEdit}
//                 className="comment-icon-btn"
//                 title="Save"
//               >
//                 <FiSave size={16} />
//               </button>
//             ) : (
//               <button
//                 onClick={() => handleEditClick(comment)}
//                 className="comment-icon-btn"
//                 title="Edit"
//               >
//                 <FiEdit2 size={16} />
//               </button>
//             )}
//           </>
//         )}
//       </div>

//       {editingCommentId === comment.id ? (
//         <input
//           type="text"
//           value={editText}
//           onChange={(e) => setEditText(e.target.value)}
//           className="comment-edit-input"
//         />
//       ) : (
//         <div className="comment-text">{comment.body}</div>
//       )}
//     </div>
//   </div>
// ))}
//         </div>
//       )}
//     </div>
//   );
// }

import {  FiMoreVertical } from "react-icons/fi";

import { FiSend,FiSmile } from "react-icons/fi";

import { FiEdit2, FiSave } from "react-icons/fi"; // clean line icons

export default function Post({ post, onLike, onAddComment, onEditComment, onDeleteComment }) {
  const [newComment, setNewComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  // Dummy logged-in user info
  const currentUser = {
    id: "me",
    name: "You",
    role: "Developer",
    profilePic: "https://randomuser.me/api/portraits/men/99.jpg",
  };

  /** Relative time (e.g., 2m, 1h, 3d) */
  const formatRelativeTime = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  /** Like */
  const handleLikeClick = () => {
    setHasLiked(!hasLiked);
    onLike(post.id, !hasLiked);
  };

  /** Add new comment */
  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: Date.now(),
      user: currentUser,
      body: newComment,
      createdAt: new Date().toISOString(),
    };

    // Prepend comment (newest on top)
    setComments([newCommentObj, ...comments]);
    onAddComment(post.id, newCommentObj);
    setNewComment("");
  };

  /** Edit comment */
  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.body);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;

    const updatedComments = comments.map((c) =>
      c.id === editingCommentId ? { ...c, body: editText } : c
    );

    setComments(updatedComments);
    onEditComment(post.id, editingCommentId, editText);
    setEditingCommentId(null);
    setEditText("");
  };

  /** Delete comment */
  const handleDeleteComment = (commentId) => {
    const updatedComments = comments.filter((c) => c.id !== commentId);
    setComments(updatedComments);
    onDeleteComment?.(post.id, commentId);
  };

  return (
    <div className="post">
      {/* ------------------ HEADER ------------------ */}
      <div className="post-header">
        <img src={post.user.profilePic} alt={post.user.name} className="post-profile-pic" />
        <div>
          <div className="user-header">
            <div className="post-user-name">{post.user.name}</div>
            {post.postType && (
              <div className="postType text-sm font-semibold text-gray-700">
                {post.postType.label}
              </div>
            )}
          </div>
          <div className="post-user-meta">
            {post.user.role} · {post.user.department}
          </div>
        </div>
      </div>

      {/* ------------------ CONTENT ------------------ */}
      <div className="post-content">{post.content}</div>

      {/* Media */}
      {post.image && <img src={post.image} alt="Post" className="post-image" />}
      {post.video && (
        <video src={post.video} className="post-video" muted loop playsInline controls />
      )}

      {/* ------------------ ACTIONS ------------------ */}
      <div className="post-actions">
        <div className="post-action" onClick={handleLikeClick}>
          {hasLiked ? "❤️" : "🤍"} {post.reactions.likes}
        </div>

        <div className="post-action" onClick={() => setShowComments(!showComments)}>
          💬 {comments.length}
        </div>

        <div className="post-date">{new Date(post.createdAt).toLocaleDateString()}</div>
      </div>

      {/* ------------------ COMMENTS ------------------ */}
      {showComments && (
        <div className="post-comments">
          {/* Input */}
          <div className="comment-input-wrapper">
            <img src={currentUser.profilePic} alt="You" className="comment-profile-pic" />

            <div className="comment-input-container">
              <input
                type="text"
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="comment-input"
              />

              <div className="comment-input-icons">
                <div className="icon-separator" />
                <button
                  type="button"
                  onClick={handleCommentSubmit}
                  className="comment-send-btn"
                  title="Send"
                >
                  <FiSend size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* List comments */}
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <img
                src={comment.user.profilePic}
                alt={comment.user.name}
                className="comment-profile-pic"
              />

              <div className="comment-body">
                <div className="comment-header">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="comment-user-name">{comment.user.name}</span>
                      <span className="comment-time text-xs text-gray-500">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <div className="comment-user-role">{comment.user.role}</div>
                  </div>

                  <div className="comment-actions">
                    {comment.user.name === currentUser.name ? (
                      editingCommentId === comment.id ? (
                        <button
                          onClick={handleSaveEdit}
                          className="comment-icon-btn"
                          title="Save"
                        >
                          <FiSave size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditClick(comment)}
                          className="comment-icon-btn"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                      )
                    ) : null}

                    {/* More options */}
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="comment-icon-btn"
                      title="More"
                    >
                      <FiMoreVertical size={16} />
                    </button>
                  </div>
                </div>

                {editingCommentId === comment.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="comment-edit-input"
                  />
                ) : (
                  <div className="comment-text">{comment.body}</div>
                )}

                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

 
