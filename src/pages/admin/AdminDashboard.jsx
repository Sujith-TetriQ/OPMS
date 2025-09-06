import React,{ useState } from 'react';
import HolidayList from '@components/HolidayList';
import UpcomingEvents from '@components/UpcomingEvents';
import PostSection from '@components/PostSection';
import TeamAttendance from '@components/TeamAttendance';
import './admin.css';
import { AiOutlineClockCircle} from "react-icons/ai";

const postDetails = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      role: "HR Manager",
      department: "Human Resources",
      profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    createdAt: "2025-09-01T10:00:00Z",
    content: "It is a long established fact that a reader will be distracted...",
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress",
    reactions: { likes: 34 },
    comments: [],
    postType: { value: "announcement", label: "Announcement" },
  },
  {
    id: 2,
    user: {
      name: "John Smith",
      role: "Software Engineer",
      department: "Development",
      profilePic: "https://randomuser.me/api/portraits/men/33.jpg",
    },
    createdAt: "2025-09-02T08:30:00Z",
    content: "We just launched a new feature in our app! 🚀 Excited to hear your feedback.",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    reactions: { likes: 12 },
    comments: [
      {
        id: 201,
        body: "Congratulations!! Sarah Johnson",
        user: {
          name: "Bhanu Prakash Bellamkonda",
          role: "Junior Application Developer",
          profilePic: "https://randomuser.me/api/portraits/men/46.jpg",
        },
        createdAt: "2025-08-20T10:00:00Z",   //  change `date` → `createdAt`
      },
      {
        id: 202,
        body: "Congratulations!! Sarah Johnson",
        user: {
          name: "Pavan Kurme",
          role: "PHP Developer",
          profilePic: "https://randomuser.me/api/portraits/men/52.jpg",
        },
            createdAt: "2025-08-15T14:00:00Z",   // ✅ change `date` → `createdAt`
      },
    ],
    postType: { value: "notification", label: "Notification" },
  },
  {
    id: 3,
    user: {
      name: "Priya Reddy",
      role: "Team Lead",
      department: "QA",
      profilePic: "https://randomuser.me/api/portraits/women/47.jpg",
    },
    createdAt: "2025-09-03T09:15:00Z",
    content: "Reminder: The QA team meeting is scheduled for tomorrow at 10AM.",
    reactions: { likes: 5 },
    comments: [],
    postType: { value: "alert", label: "Alert" },
  },
  {
    id: 4,
    user: {
      name: "Alex Carter",
      role: "Designer",
      department: "UI/UX",
      profilePic: "https://randomuser.me/api/portraits/men/49.jpg",
    },
    createdAt: "2025-09-04T12:00:00Z",
    content: "Here’s a sneak peek at our upcoming redesign! 🎨",
    image:
      "https://images.pexels.com/photos/3184450/pexels-photo-3184450.jpeg?auto=compress",
    reactions: { likes: 18 },
    comments: [],
    postType: { value: "normal", label: "Normal Post" },
  },
];


export default function AdminDashboard() {
  const [posts, setPosts] = useState(postDetails);
  
   const holidays = [
    { date: "2025-09-01", name: "Labor Day", type: "public" },
    { date: "2025-07-04", name: "Independence Day", type: "public" },
    { date: "2025-11-28", name: "Thanksgiving", type: "public" },
    { date: "2025-12-25", name: "Christmas Day", type: "public" },
  ];
   
  const events = [
    {
      id: 1,
      name: "Madona",
      team: "Engineering",
      eventType: "Birthday",
      eventDate: "2025-09-17",
      avatar: "",
    },
    {
      id: 1,
      name: "Sarah Johnson",
      team: "Engineering",
      eventType: "Birthday",
      eventDate: "2025-09-21", 
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },

    {
      id: 2,
      name: "Michael Chen",
      team: "Marketing",
      eventType: "Work Anniversary",
      eventDate: "2025-09-21",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 3,
      name: "Emily Davis",
      team: "Sales",
      eventType: "Promotion",
      eventDate: "2025-09-22", 
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      id: 4,
      name: "David Wilson",
      team: "HR",
      eventType: "Birthday",
      eventDate: "2025-09-10", 
      avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      id: 5,
      name: "Olivia Brown",
      team: "Finance",
      eventType: "Birthday",
      eventDate: "2025-09-05", 
      avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    },
    {
      id: 6,
      name: "Past User",
      team: "Design",
      eventType: "Work Anniversary",
      eventDate: "2025-09-11", 
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      id: 7,
      name: "Past User",
      team: "Design",
      eventType: "Work Anniversary",
      eventDate: "2025-09-17",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      id: 8,
      name: "Sarah Johnson",
      team: "Engineering",
      eventType: "Birthday", 
      eventDate: "2025-09-10", 
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 9,
      name: "Sarah Johnson",
      team: "Engineering",
      eventType: "Birthday",
      eventDate: "2025-09-10", 
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ];
 
  const employees = [
    { id: 1, name: "Sarah Johnson", role: "Senior Developer", team: "Engineering", status: "Clocked In", time: "09:00 AM", type: "Office", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: 2, name: "Michael Chen", role: "Marketing Manager", team: "Marketing", status: "On Break", time: "08:45 AM", type: "Remote", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 3, name: "Emily Davis", role: "Sales Representative", team: "Sales", status: "Clocked In", time: "09:15 AM", type: "Office", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
    { id: 4, name: "David Wilson", role: "HR Specialist", team: "Human Resources", status: "Late", time: "09:30 AM", type: "Office", avatar: "https://randomuser.me/api/portraits/men/12.jpg" },
    { id: 5, name: "Lisa Rodriguez", role: "Financial Analyst", team: "Finance", status: "Clocked Out", time: "08:30 AM", type: "Remote", avatar: "https://randomuser.me/api/portraits/women/21.jpg" },
    { id: 6, name: "James Thompson", role: "UI/UX Designer", team: "Design", status: "Clocked In", time: "09:00 AM", type: "Office", avatar: "https://randomuser.me/api/portraits/men/51.jpg" },
    { id: 7, name: "Maria Garcia", role: "Product Manager", team: "Product", status: "On Break", time: "08:45 AM", type: "Office", avatar: "https://randomuser.me/api/portraits/women/75.jpg" },
    { id: 8, name: "Robert Kim", role: "DevOps Engineer", team: "Engineering", status: "Clocked In", time: "08:30 AM", type: "Remote", avatar: "https://randomuser.me/api/portraits/men/64.jpg" },
  ];
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
  


  return (
    <div className="container container-fluid p-3">
      <div className="dashboardHeader-container">
        <div className="header-left">
          <h2>HRMS Dashboard</h2>
          <p>Welcome back! Here's your team overview for today.</p>
        </div>

        <div className="header-right">
          <span className="status-label">Your Current<br/>Status</span>
          <span className="status-badge"><AiOutlineClockCircle /> Clocked In</span>
        </div>
      </div>
      <div className="row">
        {/* LEFT SIDE (2/3 width on desktop) */}
        <div className="col-lg-8 col-md-12">
          <div className="row align-items-stretch">
            {/* HolidayList */}
            <div className="col-lg-6 col-md-6 col-sm-12 mb-3 d-flex holidayContainer">
              <div className="card flex-fill h-100">
                <HolidayList  holidays={holidays} />
              </div>
            </div>

            {/* UpcomingEvents */}
            <div className="col-lg-6 col-md-6 col-sm-12 mb-3 d-flex upComingEvents">
              <div className="card flex-fill h-100">
                <UpcomingEvents events={events}/>
              </div>
            </div>
          </div>

          {/* TeamAttendance full width under them */}
          <div className="row">
            <div className="col-12 mb-3 Attendance-section">
              <div className="card Attendance-card">
                <TeamAttendance employees={employees} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 mb-3">
          <PostSection  posts={posts} setPosts={setPosts}  />
          {/* //postDeatils={postDeatils} */}
        </div>
      </div>
    </div>
  )
}