"use client";

import { Suspense, useEffect, useState } from "react";

import RoomDetails from "../RoomDetails";
import LoadingSpinner from "../../loading";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function Page({ params }: PageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(
    null
  );

  useEffect(() => {
    params.then((resolved) => setResolvedParams(resolved));
  }, [params]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {resolvedParams ? (
        <RoomDetails params={resolvedParams} />
      ) : (
        <LoadingSpinner />
      )}
    </Suspense>
  );
}
