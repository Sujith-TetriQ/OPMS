import React, { useState } from "react";
import Select from "react-select";
 
// Icons
import {
  MdAnnouncement,
  MdNotifications,
  MdWarning,
  MdPostAdd,
  MdCheck,
  MdOutlineChatBubbleOutline,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { FiUpload, FiImage, FiVideo } from "react-icons/fi";
import "./index.css";
 
// 🔹 Post Type Options (Single Select)
const postTypeOptions = [
  {
    value: "normal",
    label: "Normal Post",
    color: "blue",
    icon: MdPostAdd, // 📝 Normal Post → PostAdd icon
  },
  {
    value: "announcement",
    label: "Announcement",
    color: "green",
    icon: MdAnnouncement, // 📢 Announcement → Announcement icon
  },
  {
    value: "notification",
    label: "Notification",
    color: "orange",
    icon: MdNotifications, // 🔔 Notification → Notifications icon
  },
  {
    value: "alert",
    label: "Alert",
    color: "red",
    icon: MdWarning, // ⚠️ Alert → Warning icon
  },
];
 
// 🔹 Department Access Options (Multi Select)
const departmentOptions = [
  { value: "all", label: "All Organisation" },
  { value: "multiple", label: "Multiple Departments" },
  { value: "engineering", label: "Engineering" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "hr", label: "Human Resources" },
];
 
const CreatePost =({ setPosts }) => {   // ✅ accept setPosts from parent
   const [postType, setPostType] = useState(postTypeOptions[0]); 
  const [departments, setDepartments] = useState([]);
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("image");
  const [openAccordian, setOpenAccordian] = useState(false);

  const isFormValid = postType && departments.length > 0 && content;
   // ✅ New: Handle Post Submit
  const handlePost = () => {
    if (!isFormValid) return;

    const newPost = {
      id: Date.now(),
      user: {
        name: "You",
        role: "Frontend Developer",
        profilePic: "https://randomuser.me/api/portraits/lego/1.jpg",
      },
      createdAt: new Date().toISOString(),
      content,
      postType,            // ✅ Save selected post type (announcement, etc.)
      departments,         // ✅ Save selected departments
      [fileType]: selectedFile ? URL.createObjectURL(selectedFile) : null,
      reactions: { likes: 0 },
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);  // ✅ add new post on top

    // reset fields
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
 
  // 🔹 Handle Department Select with Smart "All" Logic
  const handleDepartmentChange = (selected) => {
    if (!selected) {
      setDepartments([]);
      return;
    }
 
    // 1️⃣ If "All Organisation" is selected → keep only that
    if (selected.some((d) => d.value === "all")) {
      setDepartments([{ value: "all", label: "All Organisation" }]);
      return;
    }
 
    // 2️⃣ If all other departments are selected → switch to "All Organisation"
    const allOtherDepartments = departmentOptions.filter(
      (d) => d.value !== "all"
    );
    if (selected.length === allOtherDepartments.length) {
      setDepartments([{ value: "all", label: "All Organisation" }]);
      return;
    }
 
    // 3️⃣ Otherwise → just set normally
    setDepartments(selected);
  };
 
  // 🔹 Filtered Options (Remove selected)
  const filteredDepartments = departments.some((d) => d.value === "all")
    ? [] // nothing visible if "All Organisation" selected
    : departmentOptions.filter(
        (opt) => !departments.some((d) => d.value === opt.value)
      );
  return (
    <>
      {/* Create Post Section */}
      <div
        style={{
          position: "absolute",
          top: "0px",
          width: "100%",
          height: "68px",
          zIndex: "1",
          left: "0px",
        }}
        onClick={() => {
          setOpenAccordian(!openAccordian);
        }}
      ></div>
      <div className="create-post">
        <div className="createPost-header">
          <div>
            <span>
              <MdOutlineChatBubbleOutline />
            </span>
            <span style={{ margin: "5px" }}>Create Post</span>
          </div>
          <div>
            {openAccordian ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </div>
        </div>
        {openAccordian && (
          <>
            {/* 🔹 Post Type Single Select */}
            <hr />
            <label className="block mb-1 font-medium">Post Type</label>
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
                    style={{
                      backgroundColor: isSelected
                        ? "#8193aeff"
                        : isFocused
                        ? "#f3f4f6"
                        : "",
                      padding: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className={`text-${data.color}-600`}>
                        <span
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            display: "inline-block",
                            backgroundColor: data.color,
                          }}
                        />
                        <span style={{ margin: "5px" }}>
                          {data.icon && (
                            <data.icon className={`text-${data.color}-600`} />
                          )}
                        </span>
                        <span>{data.label}</span>
                      </div>
                      {isSelected && (
                        <div>
                          <MdCheck className="grey-100" />
                        </div>
                      )}
                    </div>
                  </div>
                ),
              }}
            />
 
            {/* 🔹 Department Multi Select */}
            <label className="block mt-4 mb-1 font-medium">
              Department Access
            </label>
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
                    style={{
                      backgroundColor: isSelected
                        ? "#8193aeff"
                        : isFocused
                        ? "#f3f4f6"
                        : "",
                      padding: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className={`text-${data.color}-600`}>
                        <span
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            display: "inline-block",
                            backgroundColor: data.color,
                            marginRight: "8px",
                          }}
                        />
                        {data.label}
                      </div>
                      {isSelected && (
                        <div>
                          <MdCheck className="grey-100" />
                        </div>
                      )}
                    </div>
                  </div>
                ),
              }}
            />
 
            {/* Content */}
            <label>Content</label>
            <textarea
              placeholder="What would you like to share?"
              value={content}
              className="textarea-focus"
              onChange={(e) => {
                const val = e.target.value;
                // Prevent leading space
                if (val.length === 1 && val[0] === " ") return;
                //  Prevent double space at the end
                if (val.length > 1 && val.endsWith("  ")) return;
                // Prevent Enter (new lines)
                if (val.includes("\n")) return;
                setContent(val);
              }}
            />
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
      <div className="postButtonContainer">
        <button
          className={`postButtonCss ${
            isFormValid ? "postButtonCssActive" : "postButtonCssDisabled"
          } `}
          disabled={!isFormValid}
          onClick={handlePost}   // ✅ trigger post creation
        >
          {<postType.icon />} Post {postType?.label}
        </button>
      </div>
          </>
        )}
      </div>
    </>
  );
};
 
export default CreatePost;