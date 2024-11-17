import React from "react";
import "../App.css";

const HomePage: React.FC = () => {
  return (
    <>
      <div className="container">
        <aside></aside>
        <main>
          <h1>CBF Attendance</h1>
          <div className="subjects">
            <div className="eg">
              <span className="material-icons-sharp">architecture</span>
              <h3>Core Team</h3>
              <h2>12/13</h2>
              <div className="progress">
                <svg>
                  <circle cx="38" cy="38" r="36"></circle>
                </svg>
                <div className="number">
                  <p>86%</p>
                </div>
              </div>
              <small className="text-muted">Last 24 Hours</small>
            </div>
            <div className="mth">
              <span className="material-symbols-outlined">festival</span>
              <h3>Event Facilitator</h3>
              <h2>38/40</h2>
              <div className="progress">
                <svg>
                  <circle cx="38" cy="38" r="36"></circle>
                </svg>
                <div className="number">
                  <p>93%</p>
                </div>
              </div>
              <small className="text-muted">Last 24 Hours</small>
            </div>
            <div className="cs">
              <span className="material-icons-sharp">computer</span>
              <h3>Operation</h3>
              <h2>15/13</h2>
              <div className="progress">
                <svg>
                  <circle cx="38" cy="38" r="36"></circle>
                </svg>
                <div className="number">
                  <p>81%</p>
                </div>
              </div>
              <small className="text-muted">Last 24 Hours</small>
            </div>
            <div className="cg">
              <span className="material-icons-sharp">dns</span>
              <h3>Procurement</h3>
              <h2>8/9</h2>
              <div className="progress">
                <svg>
                  <circle cx="38" cy="38" r="36"></circle>
                </svg>
                <div className="number">
                  <p>96%</p>
                </div>
              </div>
              <small className="text-muted">Last 24 Hours</small>
            </div>
            <div className="net">
              <span className="material-symbols-outlined">point_of_sale</span>
              <h3>Sales</h3>
              <h2>7/9</h2>
              <div className="progress">
                <svg>
                  <circle cx="38" cy="38" r="36"></circle>
                </svg>
                <div className="number">
                  <p>92%</p>
                </div>
              </div>
              <small className="text-muted">Last 24 Hours</small>
            </div>
            <div className="pr">
              <span className="material-icons-sharp">public</span>
              <h3>Public Relations</h3>
              <h2>2/4</h2>
              <div className="progress">
                <svg>
                  <circle cx="38" cy="38" r="36"></circle>
                </svg>
                <div className="number">
                  <p>91%</p>
                </div>
              </div>
              <small className="text-muted">Last 24 Hours</small>
            </div>
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

export default HomePage;
