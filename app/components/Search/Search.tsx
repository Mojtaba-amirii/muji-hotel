"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FC, memo } from "react";

type Props = {
  roomTypeFilter: string;
  searchQuery: string;
  setRoomTypeFilter: (value: string) => void;
  setSearchQuery: (value: string) => void;
};

const Search: FC<Props> = ({
  roomTypeFilter,
  searchQuery,
  setRoomTypeFilter,
  setSearchQuery,
}) => {
  const router = useRouter();

  const handleRoomTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRoomTypeFilter(event.target.value);
  };

  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterClick = () => {
    router.push(`/rooms?roomType=${roomTypeFilter}&searchQuery=${searchQuery}`);
  };

  return (
    <section className=" bg-tertiary-light px-6 py-6 rounded-lg">
      <div className=" container mx-auto flex gap-4 flex-wrap justify-between items-center">
        <div className=" w-full md:1/3 lg:w-auto mb-4 md:mb-0">
          <label
            htmlFor="roomType"
            className=" block text-sm font-medium mb-2 text-black"
          >
            Room Type
          </label>
          <div className=" relative">
            <select
              name="room-type"
              id="roomType"
              className="w-full px-4 capitalize rounded leading-tight dark:bg-black focus:outline-none"
              value={roomTypeFilter}
              onChange={handleRoomTypeChange}
            >
              <option value="All">All</option>
              <option value="Basic">Basic</option>
              <option value="Luxury">Luxury</option>
              <option value="Suite">Suite</option>
            </select>
          </div>
        </div>

        <div className=" w-full md:h-1/3 lg:w-auto mb-4 md:mb-0">
          <label
            htmlFor="search"
            className=" block text-sm font-medium mb-2 text-black"
          ></label>
          <input
            type="search"
            id="search"
            title="search-input"
            className=" w-full px-4 py-3 rounded leading-tight dark:bg-black focus:outline-none placeholder:text-black dark:placeholder:text-white"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
        </div>

        <button
          type="button"
          title="search-btn"
          className=" btn-primary"
          onClick={handleFilterClick}
        >
          Search
        </button>
      </div>
    </section>
  );
};

export default memo(Search);
