import React, { useState } from 'react';
import {
  FiInbox,
  FiGift,
  FiUsers,
  FiVolume2,
  FiPlus,
  FiEdit3,
  FiBarChart2,
  FiCalendar
} from 'react-icons/fi';

import './admin.css';

const Card = ({ title, icon, children, actions }) => (
  <div className="custom-card bg-white h-100 d-flex flex-column">
    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
      <div className="d-flex align-items-center text-secondary">
        <div className="me-2">{icon}</div>
        <h5 className="mb-0 fs-6 fw-semibold">{title}</h5>
      </div>
      {actions && <div>{actions}</div>}
    </div>
    <div className="flex-grow-1">{children}</div>
  </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Post');

  const holidays = [];
  const birthdays = [];
  const announcements = [];
  const leaveData = { casual: 0, sick: 0 };
  const onLeaveToday = [];

  return (
    <div className="container-fluid py-4 min-vh-100">
      <div className="row g-4">
        <div className="col-md-6 col-lg-4 d-flex">
          <Card title="Inbox" icon={<FiInbox className="text-primary" size={20} />}>
            <p className="fw-semibold small mb-1">Good Job!</p>
            <p className="text-muted small">You have no pending actions!</p>
          </Card>
        </div>

        <div className="col-md-6 col-lg-4 d-flex">
          <Card
            title="Holidays"
            icon={<FiCalendar className="text-primary" size={20} />}
            actions={<button className="btn btn-link btn-sm text-primary">View all &rarr;</button>}
          >
            {holidays.length ? holidays.map((h, i) => (
              <div key={i} className="small mb-2">
                <div className="fw-medium">{h.name}</div>
                <div className="text-muted">{h.date}</div>
              </div>
            )) : <p className="text-muted small">No upcoming holidays.</p>}
          </Card>
        </div>

        <div className="col-md-6 col-lg-4 d-flex">
          <Card title="On Leave Today" icon={<FiUsers className="text-primary" size={20} />}>
            {onLeaveToday.length ? onLeaveToday.map((p, i) => (
              <div key={i} className="d-flex align-items-center mb-2">
                <img src={p.avatar} alt={p.name} className="rounded-circle me-2" width="32" height="32" />
                <div>
                  <div className="small fw-medium">{p.name}</div>
                  <div className="text-muted small">{p.designation}</div>
                </div>
              </div>
            )) : (
              <>
                <p className="fw-semibold small">Everyone is working today!</p>
                <p className="text-muted small">No one is on leave today.</p>
              </>
            )}
          </Card>
        </div>

        <div className="col-md-6 col-lg-4 d-flex">
          <Card title="Birthday's & Events" icon={<FiGift className="text-primary" size={20} />}>
            {birthdays.length ? birthdays.map((b, i) => (
              <div key={i} className="d-flex align-items-center mb-2">
                <img src={b.image} alt={b.name} className="rounded-circle me-2" width="32" height="32" />
                <div>
                  <p className="mb-0 small fw-medium">{b.name} <span className="text-muted">{b.date}</span></p>
                  <p className="text-muted small">Our whole team is wishing you the happiest birthday and great year ahead</p>
                </div>
              </div>
            )) : <p className="text-muted small">No birthdays today.</p>}
          </Card>
        </div>

        <div className="col-md-6 col-lg-4 d-flex">
          <Card
            title="Announcements"
            icon={<FiVolume2 className="text-primary" size={20} />}
            actions={<FiPlus className="text-primary cursor-pointer" />}
          >
            {announcements.length ? announcements.map((a, i) => (
              <p key={i} className="text-muted small mb-1">{a.message}</p>
            )) : <p className="text-muted small">No announcements here</p>}
          </Card>
        </div>

        <div className="col-md-6 col-lg-4 d-flex">
          <Card title="Leave Balances" icon={<FiBarChart2 className="text-primary" size={20} />}>
            <div className="d-flex justify-content-around">
              {Object.entries(leaveData).map(([type, value], i) => (
                <div key={i} className="text-center">
                  <svg width="80" height="80">
                    <circle cx="40" cy="40" r="30" stroke="#ddd" strokeWidth="8" fill="none" />
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      stroke="#0d6efd"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(value / 10) * 188} 188`}
                      strokeLinecap="round"
                      transform="rotate(-90 40 40)"
                    />
                  </svg>
                  <p className="mt-2 fw-semibold small">{value} Days</p>
                  <p className="text-muted small">{type.toUpperCase()} LEAVE</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-12 d-flex">
          <Card icon={<FiEdit3 className="text-primary" size={20} />}>
            <div className="d-flex border-bottom mb-3">
              {['Post', 'Poll'].map(tab => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`me-4 pb-1 cursor-pointer ${activeTab === tab ? 'border-bottom border-primary fw-semibold text-primary' : 'text-muted'}`}
                >
                  {tab === 'Post' ? <><FiEdit3 className="me-1" />Post</> : <><FiBarChart2 className="me-1" />Poll</>}
                </div>
              ))}
            </div>
            <textarea
              className="form-control"
              rows="3"
              placeholder={activeTab === 'Post' ? 'Write your post here and mention your peers!' : 'Create your poll here!'}
            ></textarea>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
