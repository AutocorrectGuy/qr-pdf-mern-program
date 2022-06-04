import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import LoadingScreen from "../utils/LoadingScreen";
import UserContext from "../../context/UserContext";

function Register() {
  const [cookies] = useCookies(["cookie-name"]);
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState([]);
  const { userContextData, setUserContextData } = useContext(UserContext);
  const [checked, setChecked] = useState(false)


  useEffect(() => {
    process.env.REACT_APP_NODE_ENV === 'development'
      ? axios.defaults.baseURL = process.env.REACT_APP_AXIOS_BASE_URL
      : axios.get("/auth/verify")
        .then(res => {
          res.data.status && navigate("/");
          setLoginStatus({ "status": "updated" });
        });
  }, [])

  const [values, setValues] = useState({ username: "", password: "", secretKey: "" });
  const generateError = (error) => {
    console.log(error);
    // toast.error(error, {  position: "bottom-right" } )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/auth/register",
        { ...values },
        { withCredentials: true }
      );
      if (data) {
        if (data.errors) {
          const { username, password } = data.errors;
          if (username) generateError(username);
          else if (password) generateError(password);
        } else {
          setUserContextData({
            user: data?.user,
            username: data?.username,
            status: data?.status
          });
          navigate("/");
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  return (
    <>
      {Object.keys(loginStatus).length === 0 && process.env.REACT_APP_NODE_ENV !== 'development'
        ? <LoadingScreen />
        : <>
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
                <h3 className="my-4 text-2xl font-semibold text-white">Reģistrēšanās</h3>
                <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col space-y-5">
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="username" className="text-sm font-semibold text-neutral-100">Lietotājvārds</label>
                    <input
                      type="username"
                      name="username"
                      placeholder="Ievadiet lietotājvārdu"
                      onChange={(e) =>
                        setValues({ ...values, [e.target.name]: e.target.value })
                      }
                      autoFocus
                      className="px-4 py-2 text-white placeholder:text-neutral-300 bg-neutral-600 transition duration-300 rounded focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-neutral-100">Parole</label>
                    </div>
                    <input
                      type="password"
                      placeholder="Parole"
                      name="password"
                      onChange={(e) =>
                        setValues({ ...values, [e.target.name]: e.target.value })
                      }
                      className="px-4 py-2 text-white placeholder:text-neutral-300 bg-neutral-600 transition duration-300 rounded focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <div
                      onClick={(e) => {
                        const newValue = !checked;
                        setChecked(newValue);
                        setValues({ ...values, secretChecked: newValue })
                      }}>
                      <input
                        type="checkbox"
                        name="secretChecked"
                        checked={checked}
                        value={checked}
                        onChange={() => {console.log(checked, "now")}}
                      />
                      <span
                        className="text-white pl-2">Darbinieka reģistrācija
                      </span>
                    </div>
                    {
                      checked &&
                      <div className="flex flex-col space-y-1">
                        <label className="text-sm font-semibold text-neutral-100">Reģistrācijas kods</label>
                        <input
                          type="text"
                          name="secret"
                          placeholder="Ievadiet slepeno kodu"
                          onChange={(e) =>
                            setValues({ ...values, [e.target.name]: e.target.value })
                          }
                          className="px-4 py-2 text-white placeholder:text-neutral-300 bg-neutral-600 transition duration-300 rounded focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    }
                  </div>


                  <div>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-700 rounded-md shadow hover:bg-blue-600 focus:outline-none"
                    >
                      Reģistrēties
                    </button>
                  </div>
                  <p className="flex flex-col items-center justify-center mt-10 text-center text-white">
                    <span>Ja jau esi reģistrējies, tad</span>
                    <Link to={"/login"} className="underline text-blue-500 hover:text-blue-400 font-semibold">Ienāc!</Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </>
      }
    </>
  )
}

export default Register;