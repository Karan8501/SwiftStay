import FmdGoodIcon from "@mui/icons-material/FmdGood";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Button, CircularProgress, Modal } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { DateRange } from "react-date-range";
import { Fragment, useEffect, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays, format } from "date-fns";
import {
  searchHotelsAction,
  getFeturedHotels,
} from "../redux/actions/hotelAction";
import { useDispatch, useSelector } from "react-redux";
import HotelCard from "../components/HotelCard";
import Meta from "../utils/Meta";

const Home = () => {
  const dispatch = useDispatch();
  const { hotels, isLoading, hasSearched } = useSelector(
    (state) => state.hotelState
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPersonOpen, setIsPersonOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [travellers, setTravellers] = useState({ room: 1, person: 1 });
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(Date.now()),
      endDate: addDays(Date.now(), 1),
      key: "selection",
    },
  ]);

  const dateRangeHanler = (item) => {
    setDateRange([item.selection]);
  };

  const searchHandler = () => {
    if (keyword.length < 1) return;
    setIsSearchOpen(false);

    dispatch(
      searchHotelsAction({
        location: keyword,
        room: travellers.room,
        person: travellers.person,
        d1: format(dateRange[0].startDate, "yyyy-MM-dd"),
        d2: format(dateRange[0].endDate, "yyyy-MM-dd"),
      })
    );
  };

  const travellersHandler = () => {
    setIsPersonOpen(!isPersonOpen);
  };

  useEffect(() => {
    if (!hasSearched) {
      dispatch(getFeturedHotels());
    }
  }, [dispatch, hasSearched]);

  return (
    <Fragment>
      <Meta title="SwiftStay Booking Application" />
      <div className="px-4 mx-auto mt-4 md:px-10 lg:px-20 xl:px-48">
        <h1 className="text-3xl text-grey-400">Where to?</h1>
        <div className="flex flex-col gap-4 mt-4 mb-6 md:flex-row">
          <div
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="flex items-center h-16 gap-4 px-6 transition duration-200 border border-gray-400 rounded cursor-pointer  md:w-4/12 hover:border-red-400"
          >
            <FmdGoodIcon className="text-xl text-red-400" />
            <div className="flex flex-col">
              <span>Going to</span>
              <span className="text-sm text-gray-600">{keyword}</span>
            </div>
          </div>
          <Modal
            disableAutoFocus={true}
            open={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            className="flex items-center justify-center"
          >
            <div className="w-full h-full bg-white md:w-2/3 md:h-2/3 md:rounded-lg">
              <CloseIcon
                fontSize="large"
                onClick={() => setIsSearchOpen(false)}
                className="p-1 m-2 text-red-500 transition duration-200 rounded-full cursor-pointer hover:bg-neutral-200"
              />
              <input
                onKeyUp={(e) => e.key === "Enter" && searchHandler()}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                type="text"
                placeholder="Going to"
                className="w-full px-4 py-2 mt-4 bg-transparent border-b border-gray-400 border-solid outline-none "
              />
              <div className="flex flex-col items-center mt-12">
                <button
                  disabled={keyword.length < 1}
                  className="text-5xl text-red-400 transition duration-200  hover:text-red-500"
                  onClick={searchHandler}
                >
                  <SearchIcon fontSize="inherit" />
                </button>
                <p className="mt-5 text-gray-600">Search by destination</p>
              </div>
            </div>
          </Modal>
          <div
            open={isDateOpen}
            onClick={() => setIsDateOpen(!isDateOpen)}
            className="flex items-center h-16 gap-4 px-6 transition duration-200 border border-gray-400 rounded cursor-pointer md:w-4/12 hover:border-red-400"
          >
            <DateRangeIcon className="text-xl text-red-400" />
            <div className="flex flex-col">
              <span>Dates</span>
              <span className="text-sm text-gray-600">
                {format(dateRange[0].startDate, "MMM dd")} -{" "}
                {format(dateRange[0].endDate, "MMM dd")}
              </span>
            </div>
          </div>
          <Modal
            disableAutoFocus={true}
            open={isDateOpen}
            onClose={() => setIsDateOpen(false)}
            className="flex items-center justify-center mb-20"
          >
            <div className="flex flex-col pb-8 bg-white rounded-md">
              <CloseIcon
                fontSize="large"
                onClick={() => setIsDateOpen(false)}
                className="p-1 m-2 text-red-500 transition duration-200 rounded-full cursor-pointer hover:bg-neutral-200"
              />
              <DateRange
                onChange={dateRangeHanler}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                className="rounded-md sm:px-12 sm:py-4"
                minDate={new Date(Date.now())}
              />
              <div className="flex justify-center">
                <Button
                  variant="contained"
                  className="h-12 w-72 "
                  onClick={() => setIsDateOpen(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          </Modal>
          <div
            onClick={() => setIsPersonOpen(!isPersonOpen)}
            className="flex items-center h-16 gap-4 px-6 transition duration-200 border border-gray-400 rounded cursor-pointer md:w-4/12 hover:border-red-400 "
          >
            <PersonIcon className="text-xl text-red-400" />
            <div className="flex flex-col">
              <span>Travellers</span>
              <span className="text-sm text-gray-600">
                {travellers.person} travellers, {travellers.room} room
              </span>
            </div>
          </div>
          <Modal
            disableAutoFocus={true}
            open={isPersonOpen}
            onClose={() => setIsPersonOpen(false)}
            className="flex items-center justify-center"
          >
            <div className="w-full h-full bg-white md:w-2/3 md:h-2/3 md:rounded-lg">
              <CloseIcon
                fontSize="large"
                onClick={() => setIsPersonOpen(false)}
                className="p-1 m-2 text-red-500 transition duration-200 rounded-full cursor-pointer hover:bg-neutral-200"
              />
              <h4 className="px-6 mt-6 text-2xl text-gray-800">Travellers</h4>
              <div className="flex items-center justify-between px-8 my-5">
                <h5 className="text-xl text-gray-700 ">Person: </h5>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() =>
                      setTravellers({
                        ...travellers,
                        person: travellers.person + 1,
                      })
                    }
                    type="button"
                    className="w-8 text-2xl border border-solid rounded-full  border-stone-800 hover:border-red-500"
                  >
                    +
                  </button>
                  <span>{travellers.person}</span>
                  <button
                    disabled={travellers.person === 1}
                    onClick={() =>
                      setTravellers({
                        ...travellers,
                        person: travellers.person - 1,
                      })
                    }
                    type="button"
                    className="w-8 text-2xl border border-solid rounded-full  border-stone-800 hover:border-red-500"
                  >
                    -
                  </button>
                </div>
              </div>
              <hr />
              <div className="flex items-center justify-between px-8 my-5">
                <h5 className="text-xl text-gray-700">Room: </h5>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() =>
                      setTravellers({
                        ...travellers,
                        room: travellers.room + 1,
                      })
                    }
                    type="button"
                    className="w-8 text-2xl border border-solid rounded-full  border-stone-800 hover:border-red-500"
                  >
                    +
                  </button>
                  <span>{travellers.room}</span>
                  <button
                    disabled={travellers.room === 1}
                    onClick={() =>
                      setTravellers({
                        ...travellers,
                        room: travellers.room - 1,
                      })
                    }
                    type="button"
                    className="w-8 text-2xl border border-solid rounded-full  border-stone-800 hover:border-red-500"
                  >
                    -
                  </button>
                </div>
              </div>
              <div className="flex justify-center mt-36">
                <Button
                  variant="contained"
                  className="h-12 w-72 "
                  onClick={travellersHandler}
                >
                  Done
                </Button>
              </div>
            </div>
          </Modal>
          <div className="flex items-center justify-center mt-3 md:mt-0">
            <button
              color="error"
              disabled={keyword.length < 1}
              variant="contained"
              className=" bg-red-500 rounded font-medium hover:bg-red-600 disabled:bg-red-400 w-72 !text-orange-50 md:w-24 lg:w-32 md:h-full h-12 text-inherit"
              onClick={searchHandler}
            >
              {" "}
              Search
            </button>
          </div>
        </div>
        <Fragment>
          {hasSearched && (
            <Fragment>
              {isLoading ? (
                <div className="flex items-center justify-center w-full h-96 ">
                  <CircularProgress color="warning" />
                </div>
              ) : (
                <div className="h-96">
                  <h2 className="mb-4 text-xl text-center">Search Results</h2>
                  {hotels.length < 1 && (
                    <p className="my-48 text-center text-gray-600">
                      No hotel available on based on your requirements
                    </p>
                  )}
                  {hotels.length > 0 && (
                    <p className="text-sm">
                      {hotels.length} {hotels.length === 1 ? "hotel" : "hotels"}{" "}
                      found.
                    </p>
                  )}
                  {hotels?.map((hotel) => (
                    <HotelCard key={hotel._id} hotel={hotel} />
                  ))}
                </div>
              )}
            </Fragment>
          )}
          {!hasSearched && (
            <Fragment>
              {isLoading ? (
                <div className="flex items-center justify-center w-full h-96 ">
                  <CircularProgress color="warning" />
                </div>
              ) : (
                <div>
                  <h2 className="mb-6 text-xl font-medium text-center">
                    Featured
                  </h2>
                  {hotels?.map((hotel) => (
                    <HotelCard key={hotel._id} hotel={hotel} />
                  ))}
                </div>
              )}
            </Fragment>
          )}
        </Fragment>
      </div>
    </Fragment>
  );
};
export default Home;
