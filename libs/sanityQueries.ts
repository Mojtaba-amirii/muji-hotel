import { groq } from "next-sanity";

export const getFeaturedRoomQuery = groq`*[_type == "hotelRoom" && isFeatured == true] [0] {
_id,
name,
slug,
price,
description,
discount,
images,
isFeatured,
coverImage
}`;

export const getRoomsQuery = groq`*[_type == "hotelRoom" ] {
_id,
coverImage,
description,
dimension,
isBooked,
isFeatured,
name,
price,
slug,
type,
}`;
