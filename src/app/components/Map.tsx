import React from 'react'
import { MapProps } from './Types';
import Image from 'next/image';
import mapImage from "../../../public/images/Map.png"

const Map = (props:MapProps) => {
    const {isLoading,caption}=props;
    return (
      <div className="w-full p-5 mx-0 rounded-md
        bg-white bg-opacity-30 border-opacity-40 shadow backdrop-blur-xl">
        <Image
          className="w-full"
          src={mapImage}
          width={500}
          height={500}
          alt="地図" />
        <div className="rounded-md">
          <div className="w-1/2 top-0 left-0 rounded-md absolute text-5xl font-medium text-center ml-2 mt-2
            bg-white bg-opacity-70 shadow">
            <p className="text-sm font-semibold">学部到達時刻目安</p>
          </div>
          <div className="w-1/3 top-1/3 left-1/2 rounded-md absolute text-5xl font-medium text-center mt-4 ml-8
            bg-white bg-opacity-70 shadow">
            <p className="text-sm font-semibold">{isLoading ? "loading" : `社会学部 ${caption.health}`}</p>
          </div>
          <div className="w-1/3 top-1/3 left-0 rounded-md absolute text-5xl font-medium text-center mt-4 ml-4
            bg-white bg-opacity-70 shadow">
            <p className="text-sm font-semibold">{isLoading ? "loading" : `経済学部 ${caption.economics}`}</p>
          </div>
          <div className="w-1/3 top-2/3 left-0 rounded-md absolute text-5xl font-medium text-center ml-4
            bg-white bg-opacity-70 shadow">
            <p className="text-sm font-semibold">{isLoading ? "loading" : `体育館 ${caption.gym}`}</p>
          </div>
          <p className="text-sm font-semibold"></p>
          <div className="w-1/3 top-2/3 left-1/2 rounded-md absolute text-5xl font-medium text-center ml-8
            bg-white bg-opacity-70 shadow">
            <p className="text-sm font-semibold">{isLoading ? "loading" : `スポ健 ${caption.sport}`}</p>
          </div>
        </div>
      </div>
    )
  }

export default Map
