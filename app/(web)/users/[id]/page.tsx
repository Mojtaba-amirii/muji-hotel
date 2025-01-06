"use client";

import { getUserBookings } from "@/libs/apis";
import { User } from "@/types/user";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import LoadingSpinner from "../../loading";
import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { BsJournalBookmarkFill } from "react-icons/bs";
import { GiMoneyStack } from "react-icons/gi";
import Table from "@/app/components/Table/Table";
import Chart from "@/app/components/Chart/Chart";
import RatingModal from "@/app/components/RatingModal/RatingModal";
import BackDrop from "@/app/components/BackDrop/BackDrop";
import toast from "react-hot-toast";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const UserDetails = ({ params }: PageProps) => {
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(
    null
  );

  useEffect(() => {
    params.then((resolved) => setResolvedParams(resolved));
  }, [params]);
  const userId = resolvedParams?.slug;

  const [currentNav, setCurrentNav] = useState<
    "bookings" | "amount" | "ratings"
  >("bookings");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isRatingVisible, setIsRatingVisible] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [ratingValue, setRatingValue] = useState<number | null>(0);
  const [ratingText, setRatingText] = useState("");

  const toggleRatingModal = () => setIsRatingVisible((prevState) => !prevState);

  const reviewSubmitHandler = async () => {
    if (!ratingText.trim().length || !ratingValue) {
      return toast.error("Please select a rating and provide a rating text");
    }
    if (!roomId) toast.error("Room ID must be provided");
    setSubmittingReview(true);
    try {
      await axios.post("/api/users", {
        roomId,
        reviewText: ratingText,
        ratingValue,
      });
      toast.success("Review submitted");
    } catch (error) {
      console.error("An error occurred while submitting review", error);
      toast.error("An error occurred while submitting review");
    } finally {
      setRatingText("");
      setRatingValue(null);
      setRoomId(null);
      setSubmittingReview(false);
      setIsRatingVisible(false);
    }
  };

  const fetchUserBooking = async () => {
    if (!userId) throw new Error("User ID is undefined");
    return getUserBookings(userId);
  };
  const fetchUserData = async () => {
    const { data } = await axios.get<User>("/api/users");
    return data;
  };

  const {
    data: userBookings,
    error,
    isLoading,
  } = useSWR("/api/userbooking", fetchUserBooking);

  const {
    data: userData,
    isLoading: loadingUserData,
    error: errorGettingUserData,
  } = useSWR("/api/users", fetchUserData);

  if (error || errorGettingUserData)
    throw new Error("Error fetching user bookings: " + error);
  if (typeof userBookings === "undefined" && !isLoading)
    throw new Error(" Error fetching user bookings");
  if (typeof userData === "undefined" && !loadingUserData)
    throw new Error(" Error fetching user data");

  if (isLoading || loadingUserData) return <LoadingSpinner />;
  if (!userData) throw new Error("No user data");

  return (
    <div className=" container mx-auto px-2 py-10 md:px-4">
      <div className=" grid md:grid-cols-12 gap-10 ">
        <div className="hidden md:flex flex-col items-center justify-center md:col-span-4 lg:col-span-3 shadow-lg h-fit sticky top-10 bg-[#eff0f2] text-black rounded-lg px-6 py-4">
          <div className=" md:w-[143px] w-fit h-fit md:h-[143px] mx-auto mb-5 rounded-full overflow-hidden">
            <Image
              src={userData.image}
              alt={`${userData.name}-image`}
              width={143}
              height={143}
              className="img scale-animation rounded-full"
            />
          </div>
          <div className=" font-normal py-4 text-left">
            <h6 className=" text-xl font-bold pb-3">About:</h6>
            <p className=" text-sm">{userData.about ?? ""}</p>
          </div>
          <div className=" font-normal text-left ">
            <h6 className=" text-xl font-bold pb-3">{userData.name}</h6>
          </div>
          <div className=" flex items-center ">
            <p className=" mr-2">
              <FaSignOutAlt
                className=" text-3xl cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/" })}
              />
            </p>
          </div>
        </div>

        <div className=" md:col-span-8 lg:col-span-9">
          <div className=" flex md:flex-row items-center justify-center md:justify-start flex-col bg-[#eff0f2] md:bg-inherit rounded-lg py-3 md:py-0">
            <h5 className=" text-2xl font-bold mr-3  ">
              Hello, {userData.name}
            </h5>
            <div className=" md:hidden w-14 h-14 rounded-full overflow-hidden">
              <Image
                src={userData.image}
                alt="User Name"
                width={56}
                height={56}
                className=" img scale-animation"
              />
            </div>
            <p className=" block w-fit md:hidden text-sm py-2">
              {userData.about ?? ""}
            </p>
            <p className=" text-xs py-2 font-medium">
              Joined In {userData._createdAt.split("T")[0]}
            </p>
            <div className=" md:hidden flex items-center my-2">
              <p className=" mr-2">Sign Out</p>
              <FaSignOutAlt
                className=" text-xl cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/" })}
              />
            </div>
          </div>

          <nav className=" sticky top-0 px-2 w-fit mx-auto md:w-full md:px-5 py-3 m-8 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 mt-7">
            <ol
              className={`${currentNav == "bookings" ? " text-blue-700" : " text-gray-700"}  inline-flex mr-1 md:mr-5 items-center space-x-1 md:space-x-3`}
            >
              <li
                className=" inline-flex items-center cursor-pointer"
                onClick={() => setCurrentNav("bookings")}
              >
                <BsJournalBookmarkFill />
                <a className=" inline-flex items-center mx-1 md:mx-3 text-xs md:text-sm font-medium">
                  Current Bookings
                </a>
              </li>
            </ol>
            <ol
              className={`${currentNav == "amount" ? " text-blue-700" : " text-gray-700"}  inline-flex mr-1 md:mr-5 items-center space-x-1 md:space-x-3`}
            >
              <li
                className=" inline-flex items-center cursor-pointer"
                onClick={() => setCurrentNav("amount")}
              >
                <GiMoneyStack className=" text-xl" />
                <a className=" inline-flex items-center mx-1 md:mx-3 text-xs md:text-sm font-medium">
                  Spent Amount
                </a>
              </li>
            </ol>
          </nav>

          {currentNav === "bookings" ? (
            userBookings && (
              <Table
                bookingDetails={userBookings}
                setRoomId={setRoomId}
                toggleRatingModal={toggleRatingModal}
              />
            )
          ) : (
            <></>
          )}

          {currentNav === "amount" ? (
            userBookings && <Chart userBookings={userBookings} />
          ) : (
            <></>
          )}
        </div>
      </div>

      <RatingModal
        isOpen={isRatingVisible}
        ratingValue={ratingValue}
        setRatingValue={setRatingValue}
        ratingText={ratingText}
        setRatingText={setRatingText}
        reviewSubmitHandler={reviewSubmitHandler}
        submittingReview={submittingReview}
        toggleRatingModal={toggleRatingModal}
      />
      <BackDrop isOpen={isRatingVisible} />
    </div>
  );
};

export default UserDetails;
