import React from 'react';
import HolidayList from '@components/HolidayList';
import UpcomingEvents from '@components/UpcomingEvents';
import CreatePost from '@components/CreatePost';
import RecentPost from '@components/RecentPost';
import TeamAttendance from '@components/TeamAttendance';
import './admin.css';
import { AiOutlineClockCircle} from "react-icons/ai";



export default function AdminDashboard() {
  return (
    <div className="container container-fluid p-3">
      <div className="dashboardHeader-container">
        <div className="header-left">
          <h2>HRMS Dashboard</h2>
          <p>Welcome back! Here's your team overview for today.</p>
        </div>

        <div className="header-right">
          <span className="status-label">Your Status<br/>Current</span>
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
                <HolidayList />
              </div>
            </div>

            {/* UpcomingEvents */}
            <div className="col-lg-6 col-md-6 col-sm-12 mb-3 d-flex upComingEvents">
              <div className="card flex-fill h-100">
                <UpcomingEvents />
              </div>
            </div>
          </div>

          {/* TeamAttendance full width under them */}
          <div className="row">
            <div className="col-12 mb-3 Attendance-section">
              <div className="card Attendance-card">
                <TeamAttendance />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (1/3 width on desktop) */}
        <div className="col-lg-4 col-md-12 mb-3">
          <div className="card createPostCard">
            <CreatePost />
          </div>
          <div className='recentPost-cardContainer'>
            <div className='card'>
              <RecentPost />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}