"use client";

import RoomCard from "@/app/components/RoomCard/RoomCard";
import Search from "@/app/components/Search/Search";
import { getRooms } from "@/libs/apis";
import { Room } from "@/models/room";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

const Rooms = () => {
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get("searchQuery");
    const roomType = searchParams.get("roomType");
    if (roomType) setRoomTypeFilter(roomType);
    if (searchQuery) setSearchQuery(searchQuery);
  }, [searchParams]);

  async function fetchRooms() {
    return getRooms();
  }

  const { data, error, isLoading } = useSWR("get/hotelRooms", fetchRooms);
  if (error) throw new Error("Error fetching rooms");
  if (typeof data === "undefined" && !isLoading)
    throw new Error(" Error fetching rooms");

  const filterRooms = (rooms: Room[]) => {
    return rooms.filter((room) => {
      // Room type filter
      if (
        roomTypeFilter &&
        roomTypeFilter.toLocaleLowerCase() !== "all" &&
        room.type.toLocaleLowerCase() !== roomTypeFilter.toLocaleLowerCase()
      ) {
        return false;
      }
      // Search query filter
      if (
        searchQuery &&
        !room.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
      ) {
        return false;
      }
      {
        return true;
      }
    });
  };

  const filteredRooms = filterRooms(data || []);

  return (
    <div className=" container mx-auto pt-10">
      <Search
        roomTypeFilter={roomTypeFilter}
        searchQuery={searchQuery}
        setRoomTypeFilter={setRoomTypeFilter}
        setSearchQuery={setSearchQuery}
      />

      <div className=" flex mt-20 justify-between flex-wrap">
        {filteredRooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default Rooms;
