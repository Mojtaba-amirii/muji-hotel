import RoomDetails from "./RoomDetails";

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return <RoomDetails params={{ slug }} />;
}
