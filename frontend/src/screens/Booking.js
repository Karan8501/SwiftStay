import CloseIcon from "@mui/icons-material/Close";
import { Button, Modal } from "@mui/material";
import { DateRange } from "react-date-range";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { getRoomAction } from "../redux/actions/hotelAction";
import { addDays, format } from "date-fns";
import { setError } from "../redux/slices/appSlice";
import NotFound from "./NotFound";
import Meta from "../utils/Meta";

const Booking = () => {
  const id = useParams().id;
  const user = useSelector((state) => state.userState.user);
  const { room, isLoading } = useSelector((state) => state.hotelState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dates, setDates] = useState([]);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [disableDates, setDisableDates] = useState([]);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const prices = room?.pricePerDay * dates?.length;
  const vat = room?.pricePerDay * dates?.length * (18 / 100);
  const totalPrice = prices + vat;
  const willCheckOut = phone.length > 10;
  const bookingDetails = {
    name,
    email,
    phone,
    totalPrice,
    dates,
    room: id,
    hotel: room?.hotel._id,
  };

  useEffect(() => {
    dispatch(getRoomAction(id));

    setName(user.name);
    setEmail(user.email);
  }, [user, id, dispatch]);

  useEffect(() => {
    if (room && room.notAvailable.length > 0) {
      const dates = room.notAvailable.map((date) => new Date(date));
      setDisableDates(dates);
    }
  }, [room]);

  useEffect(() => {
    let tempDates = [];
    let startDate = dateRange[0].startDate;
    while (startDate <= dateRange[0].endDate) {
      tempDates.push(format(new Date(startDate), "yyyy-MM-dd"));
      startDate = addDays(new Date(startDate), 1);
    }

    setDates(tempDates);
  }, [isDateOpen, dateRange]);

  const dateRangeHanler = (item) => {
    setDateRange([item.selection]);
  };

  const onCheckout = () => {
    const notAvailAble = room.notAvailable.map((date) => Date.parse(date));
    const isValidDate = dates.every(
      (date) => !notAvailAble.includes(Date.parse(date))
    );

    if (!isValidDate) {
      dispatch(setError("Date already booked"));
      return;
    }

    sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
    navigate("/booking/payment");
  };

  console.log(isDateOpen);

  return (
    <Fragment>
      <Meta title="Book Room" />
      <Fragment>
        {isLoading ? (
          <Loader />
        ) : (
          <Fragment>
            {!room ? (
              <NotFound />
            ) : (
              <div className="flex flex-col px-4 mx-auto mt-4 md:px-10 lg:px-20 xl:px-48 md:flex-row md:justify-between">
                <div className="flex flex-col items-center">
                  <div className="px-1 sm:px-3">
                    <h2 className="mb-4 text-xl font-medium">Your details:</h2>
                    <div className="flex items-center mb-4 ml-8">
                      <label htmlFor="name" className="w-16 font-medium">
                        Name:
                      </label>
                      <input
                        value={name}
                        disabled={true}
                        id="name"
                        type="text"
                        className="px-1 py-2 font-mono text-gray-700 border border-gray-400 border-solid rounded-md outline-none sm:px-2"
                      />
                    </div>
                    <div className="flex items-center mb-4 ml-8">
                      <label htmlFor="email" className="w-16 font-medium">
                        Email:
                      </label>
                      <input
                        value={email}
                        id="email"
                        type="email"
                        className="px-1 py-2 font-mono text-gray-700 border border-gray-400 border-solid rounded-md outline-none sm:px-2"
                        disabled={true}
                      />
                    </div>
                    <div className="flex items-center mb-4 ml-8">
                      <label htmlFor="phone" className="w-16 font-medium">
                        Mobile:
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Your phone number"
                        id="phone"
                        type="number"
                        className="px-1 py-2 font-mono border border-gray-400 border-solid rounded-md outline-none sm:px-2"
                      />
                    </div>
                  </div>
                  <div className="px-1 sm:px-3">
                    <h2 className="mt-16 mb-4 text-xl font-medium">
                      Room details:
                    </h2>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Hotel Name:
                      </span>
                      <span className="font-mono">{room?.hotel.name}</span>
                    </div>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Room Name:
                      </span>
                      <span className="font-mono">{room?.name}</span>
                    </div>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Room No:
                      </span>
                      <span className="font-mono">{room?.number}</span>
                    </div>
                    <div className="flex items-center mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Room Type:
                      </span>
                      <span className="font-mono">{room?.type}</span>
                    </div>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Price(per day):
                      </span>
                      <span className="font-mono">
                        {room?.pricePerDay} taka
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="px-1 sm:px-3">
                    <h2 className="mt-16 mb-4 text-xl font-medium">
                      Booking details:
                    </h2>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Room ID:
                      </span>
                      <span className="font-mono break-all">{room?._id}</span>
                    </div>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Dates:
                      </span>
                      <button onClick={() => setIsDateOpen(!isDateOpen)}>
                        <textarea
                          value={dates?.toString()}
                          disabled={false}
                          id="dates"
                          rows={dates.length + 1}
                          cols={10}
                          className="px-1 py-2 font-mono text-gray-700 break-all transition duration-200 border border-gray-400 border-solid rounded-md cursor-pointer resize-none sm:px-2 hover:bg-red-200"
                        />
                      </button>
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
                            disabledDates={disableDates}
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
                    </div>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Price({dates?.length}):
                      </span>
                      <span className="font-mono">{prices} taka</span>
                    </div>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Vat:
                      </span>
                      <span className="font-mono">{vat} taka</span>
                    </div>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Total Price:
                      </span>
                      <span className="font-mono">{totalPrice} taka</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center px-1 py-20 sm:px-3 sm:justify-end ">
                    <button
                      onClick={onCheckout}
                      className="block py-4 text-center transition duration-200 bg-red-400 rounded w-60 hover:bg-red-500 text-zinc-50 "
                      disabled={willCheckOut ? false : true}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Fragment>
        )}
      </Fragment>
    </Fragment>
  );
};
export default Booking;
