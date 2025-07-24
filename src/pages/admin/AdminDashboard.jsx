import React, { useEffect, useState } from "react";
import {
  FiInbox,
  FiGift,
  FiUsers,
  FiVolume2,
  FiPlus,
  FiEdit3,
  FiBarChart2,
  FiCalendar,
} from "react-icons/fi";

// Reusable Glassy Card component (White Theme + Hover Effects)
const Card = ({ title, icon, children, actions }) => (
  <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-md rounded-2xl p-4 w-full h-auto transition duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:border-purple-300 hover:bg-white/90 hover:ring-2 hover:ring-purple-300 hover:ring-offset-1">
    <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-3">
      <div className="flex items-center space-x-2 text-gray-700">
        {icon}
        <h2 className="text-md font-semibold">{title}</h2>
      </div>
      {actions && <div>{actions}</div>}
    </div>
    <div>{children}</div>
  </div>
);

// Main Admin Dashboard
const AdminDashboard = () => {
  const [holidays, setHolidays] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [leaveData, setLeaveData] = useState({ casual: 0, sick: 0 });
  const [onLeaveToday, setOnLeaveToday] = useState([]);
  const [activeTab, setActiveTab] = useState("Post");

  // Fetch dynamic data from APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [holidayRes, birthdayRes, announceRes, leaveRes, leaveTodayRes] = await Promise.all([
          fetch("/api/holidays"),
          fetch("/api/birthdays"),
          fetch("/api/announcements"),
          fetch("/api/leaveBalances"),
          fetch("/api/onLeaveToday"),
        ]);

        const holidaysData = await holidayRes.json();
        const birthdaysData = await birthdayRes.json();
        const announcementsData = await announceRes.json();
        const leaveDataRes = await leaveRes.json();
        const onLeaveData = await leaveTodayRes.json();

        setHolidays(holidaysData);
        setBirthdays(birthdaysData);
        setAnnouncements(announcementsData);
        setLeaveData(leaveDataRes);
        setOnLeaveToday(onLeaveData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 text-gray-800 min-h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Inbox Card */}
      <Card title="Inbox" icon={<FiInbox className="text-purple-500" size={20} />}> 
        <p className="font-semibold text-sm">Good Job!</p>
        <p className="text-sm text-gray-600">You have no pending actions!</p>
      </Card>

      {/* Holidays Card */}
      <Card
        title="Holidays"
        icon={<FiCalendar className="text-purple-500" size={20} />}
        actions={<button className="text-xs text-purple-600">View all &rarr;</button>}
      >
        {holidays.length > 0 ? (
          holidays.map((holiday, i) => (
            <div key={i} className="text-sm">
              <p className="font-medium">{holiday.name}</p>
              <p className="text-gray-600">{holiday.date}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No upcoming holidays.</p>
        )}
      </Card>

      {/* On Leave Today Card */}
      <Card title="On Leave Today" icon={<FiUsers className="text-purple-500" size={20} />}>
        {onLeaveToday.length > 0 ? (
          onLeaveToday.map((person, i) => (
            <div key={i} className="flex items-center space-x-3 mb-2">
              <img src={person.avatar} alt={person.name} className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-sm font-medium">{person.name}</p>
                <p className="text-xs text-gray-500">{person.designation}</p>
              </div>
            </div>
          ))
        ) : (
          <>
            <p className="font-semibold text-sm">Everyone is working today!</p>
            <p className="text-sm text-gray-600">No one is on leave today.</p>
          </>
        )}
      </Card>

      {/* Birthday & Events */}
      <Card title="Birthday's & Events" icon={<FiGift className="text-purple-500" size={20} />}>
        {birthdays.length > 0 ? (
          birthdays.map((person, i) => (
            <div key={i} className="flex items-center space-x-3 mb-2">
              <img src={person.image} alt={person.name} className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-sm font-medium">{person.name} <span className="text-gray-500 text-xs">{person.date}</span></p>
                <p className="text-xs text-gray-600">Our whole team is wishing you the happiest birthday and great year ahead</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No birthdays today.</p>
        )}
      </Card>

      {/* Announcements */}
      <Card
        title="Announcements"
        icon={<FiVolume2 className="text-purple-500" size={20} />}
        actions={<FiPlus className="text-purple-500 cursor-pointer" />}
      >
        {announcements.length > 0 ? (
          announcements.map((announcement, i) => (
            <p key={i} className="text-sm text-gray-800">{announcement.message}</p>
          ))
        ) : (
          <p className="text-sm text-gray-600">No announcements here</p>
        )}
      </Card>

      {/* Leave Balances */}
      <Card title="Leave Balances" icon={<FiBarChart2 className="text-purple-500" size={20} />}>
        <div className="flex justify-around">
          {Object.entries(leaveData).map(([type, value], i) => (
            <div key={i} className="flex flex-col items-center">
              <svg width="80" height="80">
                <circle cx="40" cy="40" r="30" stroke="#ddd" strokeWidth="8" fill="none" />
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="#a855f7"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(value / 10) * 188} 188`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <p className="mt-2 font-semibold text-sm">{value} Days</p>
              <p className="text-xs text-gray-600">{type.toUpperCase()} LEAVE</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Post & Poll Tabs */}
      <Card title={null} icon={<FiEdit3 className="text-purple-500" size={20} />}>
        <div className="flex space-x-6 border-b border-gray-200 text-sm">
          {['Post', 'Poll'].map(tab => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer py-1 px-2 ${activeTab === tab ? 'border-b-2 border-purple-500 text-purple-600 font-semibold' : 'text-gray-400'}`}
            >
              {tab === 'Post' ? <><FiEdit3 className="inline mr-1" />Post</> : <><FiBarChart2 className="inline mr-1" />Poll</>}
            </div>
          ))}
        </div>
        <textarea
          placeholder={activeTab === 'Post' ? 'Write your post here and mention your peers!' : 'Create your poll here!'}
          className="w-full mt-3 p-2 border border-gray-300 bg-white text-sm text-gray-800 rounded-md"
          rows={3}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;

 