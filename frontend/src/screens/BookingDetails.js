import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { getUserBooking } from "../redux/actions/hotelAction";
import Loader from "../components/Loader";
import NotFound from "./NotFound";
import { format } from "date-fns";
import Meta from "../utils/Meta";

const BookingDetails = () => {
  const dispatch = useDispatch();
  const id = useParams().id;
  const [dates, setDates] = useState([]);
  const { isLoading, booking } = useSelector((state) => state.hotelState);
  const user = useSelector((state) => state.userState.user);
  const prices = booking?.room.pricePerDay * dates?.length;
  const vat = booking?.room.pricePerDay * dates?.length * (18 / 100);

  useEffect(() => {
    dispatch(getUserBooking(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (booking) {
      const tempDates = booking.dates.map((date) =>
        format(new Date(date), "yyyy-MM-dd")
      );
      setDates(tempDates);
    }
  }, [booking]);

  return (
    <Fragment>
      <Meta title="Booking Details" />
      <Fragment>
        {isLoading ? (
          <Loader />
        ) : (
          <Fragment>
            {!booking ? (
              <NotFound />
            ) : (
              <div className="flex flex-col px-4 mx-auto mt-4 md:px-10 lg:px-20 xl:px-48 md:flex-row md:justify-between">
                <div className="flex flex-col items-center">
                  <div className="px-1 sm:px-3">
                    <h2 className="mb-4 text-xl font-medium md:mt-5">
                      Your details:
                    </h2>
                    <div className="flex items-center mb-4 ml-8">
                      <label htmlFor="name" className="w-16 font-medium">
                        Name:
                      </label>
                      <input
                        value={user?.name}
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
                        value={user?.email}
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
                        value={booking?.phone}
                        disabled={true}
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
                      <Link
                        to={`/hotel/${booking?.hotel._id}`}
                        className="font-mono text-blue-700"
                      >
                        {booking?.hotel.name}
                      </Link>
                    </div>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Room Name:
                      </span>
                      <span className="font-mono">{booking?.room.name}</span>
                    </div>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Room No:
                      </span>
                      <span className="font-mono">{booking?.room.number}</span>
                    </div>
                    <div className="flex items-center mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Room Type:
                      </span>
                      <span className="font-mono">{booking?.room.type}</span>
                    </div>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Price(per day):
                      </span>
                      <span className="font-mono">
                        {booking?.room.pricePerDay} taka
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="px-1 sm:px-3">
                    <h2 className="mt-16 mb-4 text-xl font-medium md:mt-5">
                      Booking details:
                    </h2>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Room ID:
                      </span>
                      <span className="font-mono break-all">
                        {booking?.room._id}
                      </span>
                    </div>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        {" "}
                        Status:
                      </span>
                      <span className="font-mono">{booking?.status}</span>
                    </div>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Dates:
                      </span>
                      <textarea
                        value={dates?.toString()}
                        disabled={false}
                        id="phone"
                        rows={dates.length + 1}
                        cols={10}
                        className="px-1 py-2 font-mono text-gray-700 break-all border border-gray-400 border-solid rounded-md resize-none sm:px-2"
                      />
                    </div>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Price({dates?.length}):
                      </span>
                      <span className="font-mono">{prices} RS</span>
                    </div>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Vat:
                      </span>
                      <span className="font-mono">{vat} RS</span>
                    </div>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        Total Price:
                      </span>
                      <span className="font-mono">
                        {booking?.totalPrice} RS
                      </span>
                    </div>
                    <div className="flex mb-4 ml-8">
                      <span className="inline-block font-medium w-28">
                        {" "}
                        Paid:
                      </span>
                      <span className="font-mono">
                        {booking?.paymentInfo.status}
                      </span>
                    </div>
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
export default BookingDetails;
