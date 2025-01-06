"use client";

import useSWR from "swr";
import LoadingSpinner from ".././loading";
import HotelPhotoGallery from "@/app/components/HotelPhotoGallery/HotelPhotoGallery";
import { MdOutlineCleaningServices } from "react-icons/md";
import { LiaFireExtinguisherSolid } from "react-icons/lia";
import { AiOutlineMedicineBox } from "react-icons/ai";
import { GiSmokeBomb } from "react-icons/gi";
import { getRoom } from "@/libs/apis";
import BookRoomCta from "@/app/components/BookRoomCta/BookRoomCta";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { getStripe } from "@/libs/stripe";
import RoomReview from "@/app/components/RoomReview/RoomReview";

interface RoomDetailsProps {
  params: { slug: string };
}

const RoomDetails: FC<RoomDetailsProps> = ({ params }) => {
  const { slug } = params;
  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(1);
  const [numOfChildren, setNumOfChildren] = useState(0);

  const fetchRoom = async () => {
    try {
      return await getRoom(slug);
    } catch (error) {
      console.error("Error fetching room:", error);
      throw new Error("Error fetching room");
    }
  };

  const {
    data: room,
    error,
    isLoading,
  } = useSWR(`/api/rooms/${slug}`, fetchRoom);

  if (error) throw new Error("Error fetching room");
  if (typeof room === "undefined" && !isLoading)
    throw new Error(" Error fetching room");
  if (!room) return <LoadingSpinner />;

  const calcMinCheckoutDate = () => {
    if (checkinDate) {
      const nextDay = new Date(checkinDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;
    }
    return undefined;
  };

  const handleBookClick = async () => {
    if (!checkinDate || !checkoutDate)
      return toast.error("Please select a checkin date and checkout date");

    if (checkinDate > checkoutDate)
      return toast.error("Please select a valid checkin/checkout period");

    const numberOfDays = calcNumDays();
    const hotelRoomSlug = room.slug.current;
    const stripe = await getStripe();

    try {
      const { data: stripeSession } = await axios.post("/api/stripe", {
        checkinDate,
        checkoutDate,
        adults,
        children: numOfChildren,
        numberOfDays,
        hotelRoomSlug,
      });

      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId: stripeSession.id,
        });
        if (result.error) {
          toast.error("Payment failed: ");
        }
      }
    } catch (err) {
      console.error("Payment failed", err);
      toast.error("An error occurred while processing the payment request");
    }
  };

  const calcNumDays = () => {
    if (!checkinDate || !checkoutDate) return;
    const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
    const numOfDays = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
    return numOfDays;
  };

  return (
    <div>
      <HotelPhotoGallery photos={room.images} />

      <div className=" container mx-auto mt-20">
        <div className=" md:grid md:grid-cols-12 gap-12 px-3">
          <div className=" md:col-span-8 md:w-full">
            <div>
              <h2 className=" font-bold text-left text-lg md:text-2xl">
                {room.name} ({room.dimension})
              </h2>
              <div className=" flex my-11">
                {room.offeredAmenities.map(
                  (amenity: {
                    _key: string;
                    icon: string;
                    amenity: string;
                  }) => (
                    <div
                      key={amenity._key}
                      className=" md:w-44 w-fit text-center mr-2 px-2 md:px-0 h-20 md:h-40 bg-[#eff0f2] dark:bg-gray-800 rounded-lg grid place-content-center"
                    >
                      <span className={`fa-solid ${amenity.icon} md:text-2xl`}>
                        <p className=" text-xs md:text-base pt-3 tracking-widest px-2">
                          {amenity.amenity}
                        </p>
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className=" mb-11">
                <h2 className=" font-bold text-3xl mb-2">Description</h2>
                <p>{room.description}</p>
              </div>

              <div className=" mb-11">
                <h2 className=" font-bold text-3xl mb-3">Offered Amenities</h2>
                <div className=" grid grid-cols-2 gap-2">
                  {room.offeredAmenities.map(
                    (amenity: {
                      _key: string;
                      icon: string;
                      amenity: string;
                    }) => (
                      <div
                        key={amenity._key}
                        className=" flex flex-row items-center md:my-0 my-1 gap-x-1"
                      >
                        <span className={`fa-solid ${amenity.icon}`}></span>
                        <p className="  text-xs md:text-base tracking-widest px-2">
                          {amenity.amenity}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className=" mb-11">
                <h2 className=" font-bold text-3xl mb-2">Safety And Hygiene</h2>
                <div className=" grid grid-cols-2">
                  <div className=" flex items-center my-1 md:my-0">
                    <MdOutlineCleaningServices />
                    <p className=" ml-2 md:text-base text-xs">Daily Cleaning</p>
                  </div>
                  <div className=" flex items-center my-1 md:my-0">
                    <LiaFireExtinguisherSolid />
                    <p className=" ml-2 md:text-base text-xs">
                      Fire Extinguishers
                    </p>
                  </div>
                  <div className=" flex items-center my-1 md:my-0">
                    <AiOutlineMedicineBox />
                    <p className=" ml-2 md:text-base text-xs">
                      Disinfections and Sterilization
                    </p>
                  </div>
                  <div className=" flex items-center my-1 md:my-0">
                    <GiSmokeBomb />
                    <p className=" ml-2 md:text-base text-xs">
                      Smoke Detectors
                    </p>
                  </div>
                </div>
              </div>

              <div className=" shadow dark:shadow-white rounded-lg p-6">
                <div className=" items-center mb-4">
                  <p className=" md:text-lg font-semibold">Customer Reviews</p>
                </div>
                <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RoomReview roomId={room._id} />
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 rounded-xl shadow-lg dark:shadow dark:shadow-white sticky top-10 h-fit overflow-auto">
            <BookRoomCta
              discount={room.discount}
              price={room.price}
              specialNote={room.specialNote}
              checkinDate={checkinDate}
              setCheckinDate={setCheckinDate}
              checkoutDate={checkoutDate}
              setCheckoutDate={setCheckoutDate}
              calcMinCheckoutDate={calcMinCheckoutDate}
              adults={adults}
              numOfChildren={numOfChildren}
              setAdults={setAdults}
              setNumOfChildren={setNumOfChildren}
              isBooked={room.isBooked}
              handleBookClick={handleBookClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
