import React from 'react';
import HolidayList from '@components/HolidayList';
import UpcomingEvents from '@components/UpcomingEvents';
import PostSection from '@components/PostSection';
import TeamAttendance from '@components/TeamAttendance';
import './admin.css';
import { AiOutlineClockCircle} from "react-icons/ai";



export default function AdminDashboard() {
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
      eventDate: "2025-08-31",
      avatar: "",
    },
    {
      id: 1,
      name: "Sarah Johnson",
      team: "Engineering",
      eventType: "Birthday",
      eventDate: "2025-08-31", 
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },

    {
      id: 2,
      name: "Michael Chen",
      team: "Marketing",
      eventType: "Work Anniversary",
      eventDate: "2025-08-31",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 3,
      name: "Emily Davis",
      team: "Sales",
      eventType: "Promotion",
      eventDate: "2025-08-31", 
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      id: 4,
      name: "David Wilson",
      team: "HR",
      eventType: "Birthday",
      eventDate: "2025-09-01", 
      avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      id: 5,
      name: "Olivia Brown",
      team: "Finance",
      eventType: "Birthday",
      eventDate: "2025-09-03", 
      avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    },
    {
      id: 6,
      name: "Past User",
      team: "Design",
      eventType: "Work Anniversary",
      eventDate: "2025-08-31", 
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      id: 7,
      name: "Past User",
      team: "Design",
      eventType: "Work Anniversary",
      eventDate: "2025-09-20",
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
      eventDate: "2025-08-30", 
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
          <PostSection recentPosts={recentPosts} />
        </div>
      </div>
    </div>
  )
}