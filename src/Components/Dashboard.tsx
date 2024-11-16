import React from 'react';
import '../App.css';
const Dashboard: React.FC = () => {
  return (
    <>
      <div className="container">
        <aside>
        </aside>
        <main>
          <h1>CBF Attendance</h1>
          <div className="subjects">
            {/* Repeat this block for each subject */}
            <div className="eg">
              <span className="material-icons-sharp">architecture</span>
              <h3>Core Team</h3>
              <h2>12/13</h2>
              <div className="progress">
                <svg><circle cx="38" cy="38" r="36"></circle></svg>
                <div className="number"><p>86%</p></div>
              </div>
              <small className="text-muted">Last 24 Hours</small>
            </div>
            {/* Add other subjects here */}
          </div>
          <div className="timetable" id="timetable">
            <div>
              <span id="prevDay">&lt;</span>
              <h2>Today's Timetable</h2>
              <span id="nextDay">&gt;</span>
            </div>
            <span></span>
            <table>
              <thead>
                <tr>
                  <th>Volunteer ID</th>
                  <th>Name</th>
                  <th>Team</th>
                  <th>Check in</th>
                  <th>Check Out</th>
                  <th></th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;