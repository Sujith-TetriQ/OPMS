import React, { useState } from "react";
import Select from "react-select";
import { useTheme } from '@context/ThemeContext';
import {
  MdAnnouncement,
  MdNotifications,
  MdWarning,
  MdPostAdd,
  MdCheck,
  MdOutlineChatBubbleOutline,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdLock, MdLockOpen 
} from "react-icons/md";
import { FiUpload, FiImage, FiVideo } from "react-icons/fi";
import "./index.css";
 
// Post Type Options
const postTypeOptions = [
  { value: "normal", label: "Normal Post", color: "blue", icon: MdPostAdd },
  {
    value: "announcement",
    label: "Announcement",
    color: "green",
    icon: MdAnnouncement,
  },
  {
    value: "notification",
    label: "Notification",
    color: "orange",
    icon: MdNotifications,
  },
  { value: "alert", label: "Alert", color: "red", icon: MdWarning },
];
 
// Department Options
const departmentOptions = [
  { value: "all", label: "All Organisation" },
  { value: "multiple", label: "Multiple Departments" },
  { value: "engineering", label: "Engineering" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "hr", label: "Human Resources" },
];
 
const CreatePost = ({ setPosts }) => {
  const [postType, setPostType] = useState(postTypeOptions[0]);
  const [departments, setDepartments] = useState([]);
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("image");
  const [openAccordian, setOpenAccordian] = useState(false);
   const { themeColor, themeMode } = useTheme();
 
  const isFormValid = postType && departments.length > 0 && content;
  const roleMapping = {
    "All Organisation": "Super Admin",
    "Multiple Departments": "Admin",
    Engineering: "Software Developer",
    Marketing: "Marketing Specialist",
    Sales: "Sales Executive",
    "Human Resources": "HR Manager",
};
const getInitials = (fullName) => {
  if (!fullName) return "";
  return fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};


 
  const handlePost = () => {
    if (!isFormValid) return;
      const selectedDepartment = departments[0]?.label || "Engineering";

      const role = roleMapping[selectedDepartment] || "Employee"; // default if not found
      // Example: you may get name & profilePic from user session/login
      const name = "John Smith";
 
    const newPost = {
      id: Date.now(),
      user: {
      name,
      profilePic: "https://randomuser.me/api/portraits/men/99.jpg", // static
      
      department: selectedDepartment, // dynamic
      role, // dynamic from mapping
    },
      createdAt: new Date().toISOString(),
      content,
      postType,
      departments,
      [fileType]: selectedFile ? URL.createObjectURL(selectedFile) : null,
      reactions: { likes: 0 },
      comments: [],
    };
 
    setPosts((prev) => [newPost, ...prev]);
 
    setContent("");
    setDepartments([]);
    setSelectedFile(null);
    setPostType(postTypeOptions[0]);
    setFileType("image");
    setOpenAccordian(false);
  };
 
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
 
  const handleDepartmentChange = (selected) => {
    if (!selected) {
      setDepartments([]);
      return;
    }
    if (selected.some((d) => d.value === "all")) {
      setDepartments([{ value: "all", label: "All Organisation" }]);
      return;
    }
    const allOtherDepartments = departmentOptions.filter(
      (d) => d.value !== "all"
    );
    if (selected.length === allOtherDepartments.length) {
      setDepartments([{ value: "all", label: "All Organisation" }]);
      return;
    }
    setDepartments(selected);
  };
 
  const filteredDepartments = departments.some((d) => d.value === "all")
    ? []
    : departmentOptions.filter(
        (opt) => !departments.some((d) => d.value === opt.value)
      );
 
  return (
    <>
      <div
        className="overlay"
        onClick={() => setOpenAccordian(!openAccordian)}
      />
      <div className="create-post">
        <div className="create-post-header">
          <div className="header-title">
            <MdOutlineChatBubbleOutline />
            <span className="header-title-text">Create Post</span>
          </div>
          <div>
            {openAccordian ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </div>
        </div>
 
        {openAccordian && (
          <>
            <hr />
            <label className="label">Post Type</label>
            <Select
              options={postTypeOptions}
              value={postType}
              isSearchable={false}
              onChange={(val) => setPostType(val)}
              components={{
                Option: ({
                  innerRef,
                  innerProps,
                  data,
                  isSelected,
                  isFocused,
                }) => (
                  <div
                    ref={innerRef}
                    {...innerProps}
                    className={`option ${isSelected ? "selected" : ""} ${
                      isFocused ? "focused" : ""
                    }`}
                  >
                    <div className="option-inner">
                      <div className="option-label">
                        <span
                          className="color-dot"
                          style={{ backgroundColor: data.color }}
                        />
                        <span className="option-icon">
                          {data.icon && <data.icon />}
                        </span>
                        <span>{data.label}</span>
                      </div>
                      {isSelected && <MdCheck />}
                    </div>
                  </div>
                ),
              }}
            />
 
            <label className="label">Department Access</label>
            <Select
              options={filteredDepartments}
              value={departments}
              onChange={handleDepartmentChange}
              isMulti
              placeholder="Select"
              closeMenuOnSelect={false}
              isSearchable={false}
              components={{
                Option: ({
                  innerRef,
                  innerProps,
                  data,
                  isSelected,
                  isFocused,
                }) => (
                  <div
                    ref={innerRef}
                    {...innerProps}
                    className={`option ${isSelected ? "selected" : ""} ${
                      isFocused ? "focused" : ""
                    }`}
                  >
                    <div className="option-inner">
                      <div className="option-label">
                        <span
                          className="color-dot"
                          style={{ backgroundColor: data.color }}
                        />
                        {data.label}
                      </div>
                      {isSelected && <MdCheck />}
                    </div>
                  </div>
                ),
              }}
            />
            {/* Access Info based on Department Selection */}
            {departments.length > 0 && (
              <div className="access-info">
                {departments[0]?.value === "all" ? (
                  <span className="public-access"><MdLockOpen />Public Access</span>
                ) : (
                  <span className="restricted-access"><MdLock />Restricted Access</span>
                )}
              </div>
            )}
 
            <label className="label">Content</label>
            <textarea
              placeholder="What would you like to share?"
              value={content}
              className="textarea-focus"
              onChange={(e) => {
                const val = e.target.value;
                if (val.length === 1 && val[0] === " ") return;
                if (val.length > 1 && val.endsWith("  ")) return;
                if (val.includes("\n")) return;
                setContent(val);
              }}
            />
 
            <div className="file-upload" tabIndex={0}>
              <div
                className="upload-placeholder"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <FiUpload className="upload-icon" />
                <p>Add {fileType === "image" ? "images" : "videos"}</p>
              </div>
              <input
                id="fileInput"
                type="file"
                accept={fileType === "image" ? "image/*" : "video/*"}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
 
              <div className="tabs">
                <button
                  className={`tab-btn ${fileType === "image" ? "active" : ""}`}
                  onClick={() => setFileType("image")}
                  type="button"
                >
                  <FiImage /> Image
                </button>
                <button
                  className={`tab-btn ${fileType === "video" ? "active" : ""}`}
                  onClick={() => setFileType("video")}
                  type="button"
                >
                  <FiVideo /> Video
                </button>
              </div>
 
              {selectedFile && (
                <div className="file-preview">
                  <span className="file-meta">
                    <span className="file-type-icon">
                      {fileType === "image" ? <FiImage /> : <FiVideo />}
                    </span>
                    <span className="file-name">{selectedFile.name}</span>
                    <button
                      className="remove-file"
                      onClick={() => setSelectedFile(null)}
                      type="button"
                    >
                      ✕
                    </button>
                  </span>
                </div>
              )}
            </div>
 
            <div className="postButtonContainer">
              <button
                className={`postButtonCss ${
                  isFormValid ? "postButtonCssActive" : "postButtonCssDisabled"
                }`}
                disabled={!isFormValid}
                onClick={handlePost}
              >
                <postType.icon /> Post {postType?.label}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
 
export default CreatePost;