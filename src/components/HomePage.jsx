import Sidebar from "./Sidebar";
import React, { useState } from "react";
import Timer from "./Timer";
import Documents from "./Documents";
import Dashboard from "./Dashboard";
import Attendence from "./Attendence";
import Game from "./Games";
import Profile from "./Profile";

const Homepage = () => {
  const [selectedTab, setSelectedTab] = useState("Home");

  return (
    <div style={{ display: "flex" }}>
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {selectedTab === "Home" ? (
        <div className="flex-grow px-4 py-3 bg-background">
          <Timer />
        </div>
      ) : selectedTab === "Dashboard" ? (
        <div className="flex-grow px-4 py-3 bg-background">
        <Dashboard />
        </div>
      ) : selectedTab === "Attendance" ? (
        <div className="flex-grow px-4 py-3 bg-background">
        <Attendence />
        </div>
      ) : selectedTab === "Documents" ? (
        <div className="flex-grow px-4 py-3 bg-background">
        <Documents />
        </div>
      ) : selectedTab === "Games" ? (
        <div className="flex-grow px-4 py-3 bg-background">
        <Game />
        </div>
      ) : selectedTab === "Profile" ? (
        <div className="flex-grow px-4 py-3 bg-background">
        <Profile />
        </div>
      ) : null}
    </div>
  );
};

export default Homepage;
