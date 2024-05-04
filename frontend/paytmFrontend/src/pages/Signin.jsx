import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const response = await axios.post(
        "https://paytm-4.onrender.com/api/v1/user/signin",
        {
          username,
          password,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        setAlertMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setAlertMessage("User not found. Please sign up first.");
      } else {
        setAlertMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="bg-slate-300 min-h-screen flex justify-center items-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox
          placeholder="vashumaurya121@gmail.com"
          label={"Email"}
          onChange={(e) => setUsername(e.target.value)}
        />
        <InputBox
          placeholder="123456"
          label={"Password"}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="pt-4">
          <Button onClick={handleSignIn} label={"Sign in"} />
          {alertMessage && <div className="text-red-500 mt-2">{alertMessage}</div>}
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  );
};