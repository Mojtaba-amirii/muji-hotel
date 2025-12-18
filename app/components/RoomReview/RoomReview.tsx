import useSWR from "swr";
import axios from "axios";
import { FC, memo } from "react";

import Rating from "../Rating/Rating";
import { Review } from "@/types/review";

const RoomReview: FC<{ roomId: string }> = ({ roomId }) => {
  const fetchRoomReviews = async () => {
    const { data } = await axios.get<Review[]>(`/api/room-reviews/${roomId}`);
    return data;
  };

  const {
    data: roomReviews,
    error,
    isLoading,
  } = useSWR("/api/room-review", fetchRoomReviews);
  if (error) throw new Error("Error fetching room reviews: ");
  if (typeof roomReviews === "undefined" && !isLoading)
    throw new Error("Couldn't fetch room reviews");

  return (
    <>
      {roomReviews &&
        roomReviews.map((roomReview) => (
          <div
            className=" flex flex-row items-center bg-gray-100 dark:bg-gray-900 p-4 rounded-lg gap-y-3"
            key={roomReview._id}
          >
            <div className=" font-semibold flex items-center">
              <p>{roomReview.user.name}</p>
              <div className=" ml-4 flex items-center justify-center text-tertiary-light text-lg">
                <Rating rating={roomReview.userRating} />
              </div>

              <p className=" ml-4">{roomReview.text}</p>
            </div>
          </div>
        ))}
    </>
  );
};

export default memo(RoomReview);
