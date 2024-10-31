import {
  MdHome,
  MdDashboard,
  MdSchedule,
  MdFolder,
  MdSportsEsports,
  MdAccountCircle,
} from "react-icons/md";

const Sidebar = ({ selectedTab, setSelectedTab }) => {


  const menuItems = [
    { name: "Home", icon: <MdHome className="w-5 h-5 mr-2" /> },
    { name: "Dashboard", icon: <MdDashboard className="w-5 h-5 mr-2" /> },
    { name: "Attendance", icon: <MdSchedule className="w-5 h-5 mr-2" /> },
    { name: "Documents", icon: <MdFolder className="w-5 h-5 mr-2" /> },
    { name: "Games", icon: <MdSportsEsports className="w-5 h-5 mr-2" /> },
    { name: "Profile", icon: <MdAccountCircle className="w-5 h-5 mr-2" /> },
  ];


  return (
    <div
      className="flex flex-col py-4 px-3 bg-sidenav text-sidenavtext"
      style={{
        width: "100%",
        height: "100vh",
        maxWidth: "270px",
        minHeight: "738px",
      }}
    >
      {/* Logo Section */}
      <div className="flex mb-3 text-white space-x-5 justify-center">
        <img src="src/assets/berg.png" alt="logo" className="w-40 h-30" />
      </div>

      <hr className="border-gray-700 my-4" />

      {/* Navigation Menu */}
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.name} onClick={() => setSelectedTab(item.name)}>
            <a
              className={`flex items-center p-2 rounded-md no-underline cursor-pointer ${
                selectedTab === item.name
                  ? "bg-gray-700 text-white"
                  : "text-gray-400"
              } hover:bg-primarybutton hover:text-white`}
            >
              {item.icon}
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
