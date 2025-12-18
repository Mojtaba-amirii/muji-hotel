"use client";

import useSWR from "swr";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { Room } from "@/types/room";
import { getRooms } from "@/libs/apis";
import Search from "@/app/components/Search/Search";
import RoomCard from "@/app/components/RoomCard/RoomCard";

const Rooms = () => {
  const searchParams = useSearchParams();

  // Initialize state from URL params - this runs only once on mount
  const [roomTypeFilter, setRoomTypeFilter] = useState(
    () => searchParams.get("roomType") || ""
  );
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("searchQuery") || ""
  );

  const fetchRooms = async () => {
    try {
      return await getRooms();
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw new Error("Error fetching rooms");
    }
  };

  const { data, error, isLoading } = useSWR("get/hotelRooms", fetchRooms);

  if (error) return <p>Error loading rooms.</p>;
  if (isLoading) return <p>Loading rooms...</p>;

  const filterRooms = (rooms: Room[]) =>
    rooms.filter((room) => {
      if (
        roomTypeFilter &&
        roomTypeFilter.toLowerCase() !== "all" &&
        room.type.toLowerCase() !== roomTypeFilter.toLowerCase()
      ) {
        return false;
      }
      if (
        searchQuery &&
        !room.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

  const filteredRooms = filterRooms(data || []);

  return (
    <div className="container mx-auto pt-10">
      <Search
        roomTypeFilter={roomTypeFilter}
        searchQuery={searchQuery}
        setRoomTypeFilter={setRoomTypeFilter}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex mt-20 justify-between xl:gap-2 flex-wrap">
        {filteredRooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default Rooms;
