import { MdPeople } from "react-icons/md";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { BallTriangle } from "react-loader-spinner";
import { toast } from "react-toastify";

const SignupPage = () => {
  //React router hook for navigation
  const navigate = useNavigate();
  const handleSignin = () => {
    navigate("/");
  };

  useEffect(() => {
    // Check if user is already authenticated
    const userUID = localStorage.getItem("userUID");
    if (userUID) {
      navigate("/home"); // Redirect to homepage if UID exists
    }
  }, [navigate]);

  //Saving state's of the input fields.
  const [employee, setEmployee] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [process, setProcess] = useState("");
  const [shift, setShift] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const empIdRegex = /^[DJ]\d+/;
    if (!empIdRegex.test(employee)) {
      toast.error("Employee ID must start with 'D' or 'J'.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@berg\.co\.in$/;
    if (!emailRegex.test(email)) {
      toast.error("Email must end with '@berg.co.in'.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        fullName: name,
        email: email,
        employeeId: employee,
        process: process,
        shiftTimings: shift,
        uid: uid,
      });

      toast.success("Signup successful!");
      navigate("/"); // Navigate to home or login page after signup
    } catch (error) {
      console.error("Error during signup: ", error); // Log the error
      switch (error.code) {
        case "auth/invalid-email":
          toast.error("Error: " + "Invalid email address.");
          break;
        case "auth/email-already-in-use":
          toast.error("Error: " + "This email is already in use.");
          break;
        case "auth/weak-password":
          toast.error("Error: " + "Password should be at least 6 characters.");
          break;
        default:
          toast.error("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center  min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 shadow-md rounded-xl ">
        <h2 className="font-bold text-2xl text-center mb-3">Signup</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label htmlFor="text" className="font-semibold">
              Employee Id
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg mt-2">
              <span className="px-3 text-black">
                <MdPeople size={20} />
              </span>
              <input
                type="text"
                id="employeeid"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                required
                placeholder="Enter your employee id"
                className="w-full px-2 py-3 rounded-r-xl focus:outline-none border-gray-300"
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="font-semibold">
              Full Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg mt-2">
              <span className="px-3 text-black">
                <MdDriveFileRenameOutline size={20} />
              </span>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
                className="w-full px-2 py-3 rounded-r-xl focus:outline-none border-gray-300"
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg mt-2">
              <span className="px-3 text-black">
                <MdOutlineAlternateEmail size={20} />
              </span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-2 py-3 rounded-r-xl focus:outline-none border-gray-300"
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg mt-2">
              <span className="px-3 text-black">
                <RiLockPasswordFill size={20} />
              </span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-2 py-3 rounded-r-xl focus:outline-none border-gray-300"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="process" className="block font-semibold mb-1">
                Process
              </label>
              <select
                name="process"
                id="process"
                value={process}
                required
                onChange={(e) => setProcess(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded"
              >
                <option value="" disabled>
                  Select Process
                </option>
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
            </div>
            <div className="w-1/2">
              <label htmlFor="shift" className="block font-semibold mb-1">
                Shift
              </label>
              <select
                name="shift"
                id="shift"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                required
                className="block w-full px-4 py-2 border border-gray-300 rounded"
              >
                <option value="" disabled>
                  Select Shift
                </option>

                <option value="6AM - 3PM">6AM - 3PM</option>
                <option value="7:30AM - 4:30PM">7:30AM - 4:30PM</option>
                <option value="9AM - 6PM">9AM - 6PM</option>
                <option value="10AM - 7PM">10AM - 7PM</option>
                <option value="12PM - 9PM">12PM - 9PM</option>
                <option value="1PM - 10PM">1PM - 10PM</option>
                <option value="2PM - 11PM">2PM - 11PM</option>
                <option value="3PM - 12AM">3PM - 12AM</option>
                <option value="8AM - 5PM">8AM - 5PM</option>
                <option value="9PM - 6AM">9PM - 6AM</option>
              </select>
            </div>
          </div>
          <div className="text-center font-semibold bg-black text-white px-2 py-3 rounded-xl mt-7">
            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <BallTriangle height={20} width={20} color="#fff" />{" "}
                  {/* Loader */}
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
        <div className="text-center mt-6 font-medium text-sm">
          Already have an account?{" "}
          <button className="text-blue-800" onClick={handleSignin}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
