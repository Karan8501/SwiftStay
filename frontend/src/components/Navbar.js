import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Popover from "@mui/material/Popover";
import { Fragment, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../redux/actions/userAction";
import { setHasSearched } from "../redux/slices/hotelSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.userState);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFixed, setIsFixed] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoClick = () => {
    navigate("/");
    dispatch(setHasSearched(false));
  };

  const loginHandler = () => {
    navigate("/login");
    setAnchorEl(null);
  };

  const signupHandler = () => {
    navigate("/signup");
    setAnchorEl(null);
  };

  const accountHandler = () => {
    setAnchorEl(null);
    navigate("/account");
  };

  const logoutHandler = () => {
    dispatch(logoutAction());
    setAnchorEl(null);
  };

  const handleScroll = () => {
    if (window.scrollY >= 96) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`${
        isFixed ? "fixed" : ""
      } w-full bg-slate-50 mx-auto px-4 md:px-10 lg:px-20 xl:px-48 z-[1300]`}
    >
      <nav className="relative flex items-center justify-between h-24 ">
        <h3
          onClick={handleLogoClick}
          className="text-3xl font-bold text-red-400 cursor-pointer"
        >
          SwiftStay
        </h3>

        <div className="">
          <div onClick={handleClick}>
            <span className="md:hidden">
              <AccountCircleIcon className="text-red-400 cursor-pointer" />
            </span>
            <span className="hidden font-medium text-red-400 capitalize cursor-pointer md:block">
              {isAuthenticated ? user.name : "Sign in"}
            </span>
          </div>

          <Popover
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <div className="flex flex-col items-center justify-center w-screen gap-6 py-12 transition duration-300 ease-in bg-red-100 sm:w-96">
              {!isAuthenticated && (
                <Fragment>
                  <button
                    onClick={loginHandler}
                    className="w-48 py-2 font-thin text-center transition duration-200 bg-red-400 rounded-lg hover:bg-red-500 text-neutral-50 "
                  >
                    Sign In
                  </button>
                  <button
                    onClick={signupHandler}
                    className="box-border w-48 py-2 text-center text-red-400 transition duration-200 border border-red-400 border-solid rounded-lg hover:text-red-500 hover:border-red-500 hover:bg-red-200"
                  >
                    Sign Up
                  </button>
                </Fragment>
              )}
              {isAuthenticated && (
                <Fragment>
                  <div className="text-center">
                    <h2 className="text-xl font-semibold capitalize">
                      Hi, {user.name}
                    </h2>
                    <span>Email: {user.email}</span>
                  </div>
                  <button
                    onClick={accountHandler}
                    className="w-48 py-2 font-semibold text-center transition duration-200 bg-red-400 rounded-lg hover:bg-red-500 text-neutral-50"
                  >
                    Account
                  </button>
                  <button
                    onClick={logoutHandler}
                    className="box-border w-48 py-2 text-center text-red-400 transition duration-200 border border-red-400 border-solid rounded-lg hover:text-red-500 hover:border-red-500 hover:bg-red-200"
                  >
                    Log out
                  </button>
                </Fragment>
              )}
            </div>
          </Popover>
        </div>
      </nav>
    </header>
  );
};
export default Navbar;
