"use client";

import React, { FC } from "react";
import CountUpNumber from "../CountUpNumber/CountUpNumber";

type Props = {
  heading1: React.ReactNode;
  images: React.ReactNode;
};

const ClientComponent: FC<Props> = (props) => {
  const { heading1, images } = props;

  return (
    <section className=" container flex items-center gap-12 mx-auto px-4">
      <div className="py-10 h-full">
        {heading1}
        <div className=" flex justify-between mt-12">
          <div className=" flex gap-3 flex-col items-center justify-center">
            <p className="text-xs lg:text-xl text-center">Basic Room</p>
            <CountUpNumber duration={5000} endValue={100} />
          </div>
          <div className=" flex gap-3 flex-col items-center justify-center">
            <p className="text-xs lg:text-xl text-center">Luxury Room</p>
            <CountUpNumber duration={5000} endValue={100} />
          </div>
          <div className=" flex gap-3 flex-col items-center justify-center">
            <p className="text-xs lg:text-xl text-center">Suite</p>
            <CountUpNumber duration={5000} endValue={100} />
          </div>
        </div>
      </div>

      {images}
    </section>
  );
};

export default ClientComponent;
