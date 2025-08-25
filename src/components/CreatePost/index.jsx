import React, { useState } from "react";
import Select, { components } from "react-select";


// Icons
import {
  MdAnnouncement,
  MdNotifications,
  MdWarning,
  MdPostAdd,
  MdCheck,
  MdOutlineChatBubbleOutline
} from "react-icons/md";
import { FiUpload, FiImage, FiVideo } from "react-icons/fi";

import { FiUsers } from "react-icons/fi";
import "./index.css";

// 🔹 Custom Option Renderer
const CustomOption = (props) => {
  const { data, innerProps, isSelected, isFocused } = props;

  return (
    <div
      {...innerProps}
      className="d-flex justify-content-between align-items-center p-2"
      style={{
        cursor: "pointer",
        backgroundColor: isSelected
          ? ""
          : isFocused
            ? "#e0e0e0"
            : "white",
        borderRadius: "10px",
        margin: "5px",
      }}
    >
      <div className="d-flex align-items-center">
        {data.color && (
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: data.color,
              display: "inline-block",
              marginRight: 8,
            }}
          />
        )}
        {data.icon && <span className="me-2">{data.icon}</span>}
        {data.label}
      </div>
      {isSelected && <MdCheck size={18} className="text-muted" />}
    </div>
  );
};

// 🔹 Reusable SingleValue Renderer
const CustomSingleValue = (props) => {
  const { data } = props;
  return (
    <components.SingleValue {...props}>
      <div className="d-flex align-items-center">
        {data.color && (
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: data.color,
              display: "inline-block",
              marginRight: 8,
            }}
          />
        )}
        {data.icon && <span className="me-2">{data.icon}</span>}
        {data.label}
      </div>
    </components.SingleValue>
  );
};

// 🔹 Custom MultiValue Renderer (for chips with icons)
const CustomMultiValueLabel = (props) => {
  const { data } = props;
  return (
    <components.MultiValueLabel {...props}>
      <div className="d-flex align-items-center">
        {data.icon && <span className="me-1">{data.icon}</span>}
        {data.label}
      </div>
    </components.MultiValueLabel>
  );
};

const CreatePost = () => {
  const [postType, setPostType] = useState({
    value: "normal",
    label: "Normal Post",
    icon: <MdPostAdd />,
    color: "blue",
  });

  const departments = [
    { value: "all", label: "All Organisation", icon: <MdPostAdd /> },
    { value: "multiple", label: "Multiple Departments", icon: <FiUsers /> },
    { value: "engineering", label: "Engineering", icon: <FiUsers /> },
    { value: "marketing", label: "Marketing", icon: <FiUsers /> },
    { value: "sales", label: "Sales", icon: <FiUsers /> },
    { value: "hr", label: "Human Resources", icon: <FiUsers /> },
  ];

  // 🔹 Multi-select: store array
  const [departmentAccess, setDepartmentAccess] = useState([]);

  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("image");

  const isFormValid = postType && departmentAccess.length > 0 && content;

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 🔹 Handle Department Select with Smart "All" Logic
  const handleDepartmentChange = (selected) => {
    if (!selected) {
      setDepartmentAccess([]);
      return;
    }

    const lastSelected = selected[selected.length - 1];
    if (lastSelected?.value === "all") {
      setDepartmentAccess(departments);
      return;
    }

    const allWithoutAll = departments.filter((d) => d.value !== "all");
    const selectedWithoutAll = selected.filter((d) => d.value !== "all");

    if (selectedWithoutAll.length === allWithoutAll.length) {
      setDepartmentAccess(departments);
    } else {
      setDepartmentAccess(selectedWithoutAll);
    }
  };

  // 🔹 Dropdown Options
  const postTypes = [
    {
      value: "normal",
      label: "Normal Post",
      icon: <MdPostAdd />,
      color: "blue",
    },
    {
      value: "announcement",
      label: "Announcement",
      icon: <MdAnnouncement />,
      color: "green",
    },
    {
      value: "notification",
      label: "Notification",
      icon: <MdNotifications />,
      color: "orange",
    },
    {
      value: "alert",
      label: "Alert",
      icon: <MdWarning />,
      color: "red",
    },
  ];

  // 🔹 Custom styles for scrollable selected values
  const customStyles = {
    valueContainer: (provided) => ({
      ...provided,
      maxHeight: "70px", // fixed height
      overflowY: "auto", // enable scroll
      flexWrap: "wrap",
    }),
    control: (provided) => ({
      ...provided,
      minHeight: "45px",
    }),
  };

  return (
    <>
      {/* Create Post Section */}
      <div className="create-post">
        <div className="createPost-header">
          <MdOutlineChatBubbleOutline /> <h3>Create Post</h3>
        </div>

        {/* Post Type */}
        <label htmlFor="postType">Post Type</label>

        <Select
          id="postType"
          options={postTypes}
          value={postType}
          onChange={(val) => setPostType(val)}
          components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
          isSearchable={false}
        />

        {/* Department Access (Multi Select) */}
        <label htmlFor="departAccess">Department Access</label>
        <Select
          id="departAccess"
          options={departments}
          value={departmentAccess}
          onChange={handleDepartmentChange}
          components={{
            Option: CustomOption,
            MultiValueLabel: CustomMultiValueLabel,
          }}
          styles={customStyles}
          isSearchable={false}
          isMulti
        />

        {/* Content */}
        <label>Content</label>
        <textarea
          placeholder="What would you like to share?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* File Upload */}
        {/* File Upload */}
        <div className="file-upload">
          <div
            className="upload-placeholder"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <FiUpload className="upload-icon" />
            <p>Add {fileType === "image" ? "images" : "videos"}</p>
          </div>

          {/* Hidden input */}
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

          {/* Preview selected file */}
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


        {/* Post Button */}
        <button
          className={`post-button ${isFormValid ? "enabled" : "disabled"}`}
          disabled={!isFormValid}
        >
          < MdOutlineChatBubbleOutline />  Post {postType?.label}
        </button>


      </div>
    </>
  );
};

export default CreatePost;