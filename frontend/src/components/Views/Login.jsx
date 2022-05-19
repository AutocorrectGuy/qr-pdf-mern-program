import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";

function Login() {
  const [cookies] = useCookies([]);
  const navigate = useNavigate();
  useEffect(() => { if (cookies.jwt) { navigate("/") } }, [cookies, navigate]);

  const [values, setValues] = useState({ username: "", password: "" });
  const generateError = (error) =>
    toast.error(error, {
      position: "bottom-right",
    });
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        "/auth/login", 
        { ...values }, 
        { withCredentials: true }
      );
      if (data) {
        if (data.errors) {
          const { username, password } = data.errors;
          if (username) generateError(username);
          else if (password) generateError(password);
        } else {
          navigate("/");
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  return (
    <div className="flex items-center min-h-screen p-4 bg-neutral-900 justify-center w-full">
      <div
        className="flex flex-col w-full sm:w-fit sm:flex-row overflow-hidden bg-neutral-900 rounded-md shadow-lg"
      >
        <div
          className="flex p-4 py-6 text-white bg-blue-700 items-center justify-center md:min-w-[300px]"
        >
          <div className="my-3 text-4xl font-bold tracking-wider text-center">
            <a href="#">QR noliktava</a>
          </div>
        </div>
        <div className="p-5 bg-neutral-800 w-full md:min-w-[400px]">
          <h3 className="my-4 text-2xl font-semibold text-white">Autorizācija</h3>
          <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col space-y-5">
            <div className="flex flex-col space-y-1">
              <label htmlFor="username" className="text-sm font-semibold text-neutral-100">Lietotājvārds</label>
              <input
               type="username"
               name="username"
               placeholder="username"
               className="px-4 py-2 text-white placeholder:text-neutral-300 bg-neutral-600 transition duration-300 rounded focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600"
               onChange={(e) =>
                 setValues({ ...values, [e.target.name]: e.target.value })
               }
              />
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <label for="password" className="text-sm font-semibold text-neutral-100">Parole</label>
              </div>
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="px-4 py-2 text-white placeholder:text-neutral-300 bg-neutral-600 transition duration-300 rounded focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600"
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            </div>
            {/* <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                class="w-4 h-4 transition duration-300 rounded focus:ring-2 focus:ring-offset-0 focus:outline-none focus:ring-blue-200"
              />
              <label for="remember" class="text-sm font-semibold text-gray-500">Remember me</label>
            </div> */}
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-700 rounded-md shadow hover:bg-blue-600 focus:outline-none"
              >
                Ienākt
              </button>
            </div>
            <p className="flex flex-col items-center justify-center mt-10 text-center text-white">
              <span>Ja neesi reģistrējies, tad</span>
              <Link to={"/register"} className="underline text-blue-500 hover:text-blue-400 font-semibold">
                Reģistrējies
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;