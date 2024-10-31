import { useState, useEffect } from "react";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig"; // Import your Firebase config
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth"; // Import Firebase signIn method
import { BallTriangle } from "react-loader-spinner";
import { toast } from "react-toastify";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "./firebaseConfig"; // Ensure you import your Firestore instance

const LoginForm = () => {
  // React router hook for navigation
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/signup");
  };

  // Saving states of input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    // Check if user is already authenticated
    const userUID = localStorage.getItem("userUID");
    if (userUID) {
      navigate("/home"); // Redirect to homepage if UID exists
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userUID = userCredential.user.uid; // Get the user's ID
      const formattedDate = new Date().toISOString().split("T")[0]; // Format the date (YYYY-MM-DD)
      const loginTime = new Date().toLocaleTimeString(); // Get the current time
      localStorage.setItem("userUID", userUID);

      // Reference to the document
      const docRef = doc(
        db,
        "EmployeeActivity",
        userUID, // Use userUID instead of userId
        "dailyData",
        formattedDate
      );

      // Check if the document already exists
      const docSnapshot = await getDoc(docRef);
      if (!docSnapshot.exists()) {
        // Document doesn't exist, set the login time
        await setDoc(docRef, {
          loginTime: loginTime, // Store the login time
          timestamp: new Date(), // Optional: store the timestamp for reference
        });
        toast.success("Login successful!");
      } else {
        toast.info("Already logged in today!"); // Inform the user if already logged in
      }

      navigate("/home"); // Navigate to home or dashboard after successful login
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleForgetPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address to reset your password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      toast.error("Failed to send password reset email: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 shadow-md rounded-xl">
        <h2 className="font-bold text-2xl text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4 mt-6">
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
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-2 py-3 rounded-r-xl focus:outline-none border-gray-300"
              />
            </div>
          </div>
          <div className="mb-4 mt-6">
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
                placeholder="Enter your password"
                required
                className="w-full px-2 py-3 rounded-r-xl focus:outline-none border-gray-300"
              />
            </div>
          </div>
          <div className="text-end font-medium text-sm text-blue-800 mb-7">
            <button type="button" onClick={handleForgetPassword}>
              Forgot password?
            </button>
          </div>

          <div className="text-center font-semibold bg-black text-white px-2 py-3 rounded-xl mt-7">
            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <BallTriangle height={20} width={20} color="#fff" />
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
        <div className="text-center mt-6 font-medium text-sm">
          Don't have an account?{" "}
          <button className="text-blue-800" onClick={handleSignup}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
