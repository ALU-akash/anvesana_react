import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BarChart } from "./BarChart";

const Timer = () => {
  const navigate = useNavigate();
  const db = getFirestore();
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [activity, setActivity] = useState("Production");
  const [prodTime, setProdTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [feedbackTime, setFeedbackTime] = useState(0);

  useEffect(() => {
    // Check if user is authenticated
    const userUID = localStorage.getItem("userUID");
    if (!userUID) {
      navigate("/");
    }
  }, [navigate]);

  // Load timer data from localStorage on page load
  useEffect(() => {
    const savedStartTime = localStorage.getItem("startTime");
    const savedElapsedTime = localStorage.getItem("elapsedTime");
    const savedIsRunning = localStorage.getItem("isRunning");
    const savedActivity = localStorage.getItem("activity");

    // Set saved activity if it exists
    if (savedActivity) {
      setActivity(savedActivity);
    }

    if (savedStartTime && savedIsRunning === "true") {
      const currentTime = Date.now();
      const timeDiff = Math.floor(
        (currentTime - parseInt(savedStartTime)) / 1000
      );
      setElapsedTime(parseInt(savedElapsedTime) + timeDiff);
      setIsRunning(true);
      setStartTime(parseInt(savedStartTime));
    } else if (savedElapsedTime) {
      setElapsedTime(parseInt(savedElapsedTime));
    }
  }, []);

  // Start the timer
  const handleStart = () => {
    const now = Date.now();
    setIsRunning(true);
    setStartTime(now);
    localStorage.setItem("startTime", now);
    localStorage.setItem("isRunning", "true");
    localStorage.setItem("activity", activity);
    toast.success("Activity Started!", { autoClose: 3000 });
  };

  // End the timer
  const handleEnd = async () => {
    setIsRunning(false);
    const loggedInUserId = localStorage.getItem("userUID");
    if (!loggedInUserId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    const formattedDate = new Date().toISOString().split("T")[0];
    const docRef = doc(
      db,
      "EmployeeActivity",
      loggedInUserId,
      "dailyData",
      formattedDate
    );

    try {
      const docSnap = await getDoc(docRef);
      const timeSpent = elapsedTime; // Total elapsed time in seconds

      if (docSnap.exists()) {
        const existingData = docSnap.data();

        let newProductivity = existingData.productivity || 0;
        let newBreak = existingData.break || 0;
        let newFeedback = existingData.feedback || 0;

        // Update values based on selected activity
        if (activity === "Production") {
          newProductivity += timeSpent;
        } else if (activity === "Break") {
          newBreak += timeSpent;
        } else if (activity === "Feedback") {
          newFeedback += timeSpent;
        }

        await setDoc(
          docRef,
          {
            productivity: newProductivity,
            break: newBreak,
            feedback: newFeedback,
          },
          { merge: true }
        );
      } else {
        const newData = {
          productivity: activity === "Production" ? timeSpent : 0,
          break: activity === "Break" ? timeSpent : 0,
          feedback: activity === "Feedback" ? timeSpent : 0,
        };
        await setDoc(docRef, newData);
      }

      // Clear timer data from localStorage
      localStorage.removeItem("startTime");
      localStorage.removeItem("elapsedTime");
      localStorage.removeItem("activity");
      localStorage.setItem("isRunning", "false");

      // Reset states
      setElapsedTime(0);
      setStartTime(null);
      toast.warning("Activity Ended!", { autoClose: 3000 });
    } catch (error) {
      console.error("Error ending timer:", error);
      toast.error("Error ending activity. Please try again.");
    }
  };

  // Update elapsed time every second if the timer is running
  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isRunning) {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [isRunning]);

  // Save the current elapsed time to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("elapsedTime", elapsedTime);
  }, [elapsedTime]);

  // Function to format the elapsed time into hh:mm:ss format
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    const loggedInUserId = localStorage.getItem("userUID");
    const formattedDate = new Date().toISOString().split("T")[0];

    const docRef = doc(
      db,
      "EmployeeActivity",
      loggedInUserId,
      "dailyData",
      formattedDate
    );

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProdTime(data.productivity || 0);
        setBreakTime(data.break || 0);
        setFeedbackTime(data.feedback || 0);
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  const handleSignout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        toast.success("Signed out successfully", { autoClose: 3000 });
        localStorage.removeItem("startTime");
        localStorage.removeItem("elapsedTime");
        localStorage.removeItem("activity");
        localStorage.setItem("isRunning", "false");
        localStorage.removeItem("userUID");
        navigate("/");
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  return (
    <div className="flex flex-col items-center">
      {/* Navigation Bar */}
      <header className="w-full mb-4">
        <nav className="bg-navbar shadow-md rounded-lg text-black">
          <ul className="flex items-center justify-between p-4">
            <li className="text-lg font-semibold">{formatTime(elapsedTime)}</li>
            <li className="text-lg font-semibold">
              Production: {formatTime(prodTime)}
            </li>
            <li className="text-lg font-semibold">
              Break: {formatTime(breakTime)}
            </li>
            <li className="text-lg font-semibold">
              Feedback: {formatTime(feedbackTime)}
            </li>
            <button
              className="bg-primarybutton text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
              onClick={handleSignout}
            >
              Sign Out
            </button>
          </ul>
        </nav>
      </header>

      <div className="flex justify-start items-start space-x-20 p-6 my-3">
        {/* Activity Container */}
        <div className="bg-formbackground shadow-xl rounded-lg p-6 w-[25rem] h-[25rem]">
          <h2 className="text-xl text-black font-semibold mb-8">
            Select your process:
          </h2>
          <form>
            <label
              htmlFor="process"
              className="block mb-1 font-semibold text-black"
            >
              Process:
            </label>
            <select
              id="process"
              name="process"
              disabled={isRunning}
              className="block w-full p-2 border rounded-lg mb-4"
            >
              <option value="MPQC:FK">MPQC:FK</option>
              <option value="MPQC:Shopsy">MPQC:Shopsy</option>
              <option value="Upgrad">UPGRAD</option>
              <option value="HITL">HITL</option>
              <option value="RQA">RQA</option>
              <option value="UGC">UGC</option>
              <option value="VSQA">V.SQA</option>
              <option value="Vernac">Vernac</option>
              <option value="Allen">Allen</option>
              <option value="Counterfeit">Counter feit</option>
              <option value="Labelling">Labelling</option>
              <option value="RSQA">RSQA</option>
              <option value="ClearTrip">Clear Trip</option>
              <option value="MIS">MIS</option>
              <option value="Others">Others</option>
            </select>

            <label
              htmlFor="activity"
              className="block mb-1 font-semibold text-black"
            >
              Activity:
            </label>
            <select
              id="activity"
              name="activity"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              disabled={isRunning}
              className="block w-full p-2 border rounded-lg mb-4"
            >
              <option value="Production">Production</option>
              <option value="Feedback">Feedback</option>
              <option value="Break">Tea Break</option>
              <option value="Break">Lunch Break</option>
              <option value="Break">Bio Break</option>
              <option value="Production">Training</option>
              <option value="Production">Meeting</option>
            </select>

            <div className="button-group flex justify-between">
              <button
                type="button"
                className="start-btn bg-primarybutton text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
                onClick={handleStart}
                disabled={isRunning}
              >
                START
              </button>
              <button
                type="button"
                className="end-btn bg-primarybutton text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
                onClick={handleEnd}
                disabled={!isRunning}
              >
                END
              </button>
            </div>
          </form>
        </div>

        {/* Bar Chart */}

        <div>
          <BarChart
            prodTime={prodTime}
            breakTime={breakTime}
            feedbackTime={feedbackTime}
          />
        </div>
      </div>
    </div>
  );
};

export default Timer;
