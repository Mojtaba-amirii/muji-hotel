"use client";

import DatePicker from "react-datepicker";
import { Dispatch, FC, SetStateAction, memo } from "react";

import "react-datepicker/dist/react-datepicker.css";

type Props = {
  checkinDate: Date | null;
  setCheckinDate: Dispatch<SetStateAction<Date | null>>;
  checkoutDate: Date | null;
  setCheckoutDate: Dispatch<SetStateAction<Date | null>>;
  calcMinCheckoutDate: () => Date | undefined;
  price: number;
  discount: number;
  specialNote: string;
  adults: number;
  numOfChildren: number;
  setAdults: Dispatch<SetStateAction<number>>;
  setNumOfChildren: Dispatch<SetStateAction<number>>;
  isBooked: boolean;
  handleBookClick: () => void;
};

const BookRoomCta: FC<Props> = (props) => {
  const {
    price,
    discount,
    specialNote,
    checkinDate,
    setCheckinDate,
    checkoutDate,
    setCheckoutDate,
    calcMinCheckoutDate,
    adults,
    numOfChildren,
    setAdults,
    setNumOfChildren,
    isBooked,
    handleBookClick,
  } = props;

  const discountPrice = price - (price / 100) * discount;

  const calcNumOfDays = () => {
    if (!checkinDate || !checkoutDate) return 0;
    const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
    const numOfDays = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
    return numOfDays;
  };

  return (
    <div className=" px-7 py-6">
      <h3 className=" flex items-center">
        <span
          className={`${discount && " text-gray-400"} font-bold text-xl mr-1.5`}
        >
          $ {price}
        </span>
        {discount ? (
          <span className=" font-bold text-xl">
            | discount {discount}%, Now{" "}
            <span className=" text-tertiary-dark">$ {discountPrice}</span>
          </span>
        ) : (
          <span className=" text-xs text-gray-400 ml-2">Discount $ : 0</span>
        )}
      </h3>

      <div className="w-full border-b-2 border-b-secondary my-2" />

      <h4 className=" py-8">{specialNote}</h4>

      <div className=" flex">
        <div className=" w-1/2 pr-2">
          <label
            htmlFor="check-in-date"
            className=" block text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            Check In Date
          </label>
          <DatePicker
            selected={checkinDate}
            onChange={(date: Date | null) => setCheckinDate(date)}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            id="check-in-date"
            className=" w-full border text-black rounded-lg border-gray-300 p-2.5 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className=" w-1/2 pl-2">
          <label
            htmlFor="check-out-date"
            className=" block text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            Check Out Date
          </label>
          <DatePicker
            selected={checkoutDate}
            onChange={(date: Date | null) => setCheckoutDate(date)}
            disabled={!checkinDate}
            dateFormat="dd/MM/yyyy"
            minDate={calcMinCheckoutDate()}
            id="check-out-date"
            className=" w-full border text-black rounded-lg border-gray-300 p-2.5 focus:ring-primary focus:border-primary disabled:bg-inherit dark:disabled:bg-inherit"
          />
        </div>
      </div>

      <div className=" flex mt-4 ">
        <div className=" w-1/2 pr-2">
          <label
            htmlFor="adults"
            className=" block text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            Adults
          </label>
          <input
            type="number"
            id="adults"
            value={adults}
            onChange={(e) => setAdults(+e.target.value)}
            min={1}
            max={6}
            className=" w-full border border-gray-300 rounded-lg p-2.5"
          />
        </div>
        <div className=" w-1/2 pl-2">
          <label
            htmlFor="children"
            className=" block text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            Children
          </label>
          <input
            type="number"
            id="children"
            value={numOfChildren}
            onChange={(e) => setNumOfChildren(+e.target.value)}
            min={0}
            max={4}
            className=" w-full border border-gray-300 rounded-lg p-2.5"
          />
        </div>
      </div>
      {calcNumOfDays() > 0 && (
        <p className="mt-3">Total Price $ {calcNumOfDays() * discountPrice}</p>
      )}

      <button
        type="button"
        title="booking-btn"
        className=" btn-primary w-full mt-6 disabled:bg-gray-500 disabled:cursor-not-allowed"
        disabled={isBooked}
        onClick={handleBookClick}
      >
        {isBooked ? "Booked" : "Book Now"}
      </button>
    </div>
  );
};

export default memo(BookRoomCta);
