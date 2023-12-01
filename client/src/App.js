import Login from "./page/login/Login";
import Signup from "./page/signup/Signup";
import Home from "./page/home/Home";
import { Routes, Route } from "react-router-dom";
import RequireUser from "./components/RequireUser";
import Profile from "./components/profile/Profile";
import Feed from "./components/feed/Feed";
import UpdateProfile from "./components/updateProfile/UpdateProfile";
import LoadingBar from "react-top-loading-bar";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import OnlyIfNotLoggedIn from "./components/OnlyIfNotLoggedIn";
import toast, { Toaster } from "react-hot-toast";

export const TOAST_SUCESS = "toast_sucess";
export const TOAST_FAILURE = "toast_failure";
function App() {
  const isLoading = useSelector((state) => state.appConfigReducer.isLoading);
  const toastData = useSelector((state) => state.appConfigReducer.toastData);
  const loadingRef = useRef(null);

  useEffect(() => {
    if (isLoading) {
      loadingRef.current?.continuousStart();
    } else {
      loadingRef.current?.complete();
    }
  }, [isLoading]);

  useEffect(() => {
    switch (toastData.type) {
      case TOAST_SUCESS:
        console.log("toast done", toastData);
        toast.success(toastData.message);
        break;
      case TOAST_FAILURE:
        console.log("toast error", toastData);
        toast.error(toastData.message);
        break;
    }
  }, [toastData]);

  return (
    <div className="App">
      <LoadingBar color="#5f9fff" ref={loadingRef} />
      <div>
        <Toaster />
      </div>
      <Routes>
        <Route element={<RequireUser />}>
          <Route element={<Home />}>
            <Route path="/" element={<Feed />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/updateProfile" element={<UpdateProfile />} />
          </Route>
        </Route>

        <Route element={<OnlyIfNotLoggedIn />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
