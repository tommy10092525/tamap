import React from 'react'
import { MapProps } from './Types';
import Image from 'next/image';
import mapImage from "../../../public/images/Map.png"
import Card from './Card';

const Map = (props: MapProps) => {
  const { isLoading, caption } = props;
  return (
    <div className="w-full mx-0 border-opacity-40 backdrop-blur-xl">
      <Card>
        <Image
          className="w-full"
          src={mapImage}
          width={500}
          height={500}
          alt="地図" />
        <div className="w-1/2 top-0 left-0 absolute text-5xl font-medium text-center ml-2 mt-2">
          <Card>
            <p className="text-sm font-semibold">学部到達時刻目安</p>
          </Card>
        </div>
        <div className='w-1/3 top-1/3 left-1/2 absolute text-5xl font-medium text-center mt-4 ml-8'>
          <Card>
            <p className="text-sm font-semibold">{isLoading ? "loading" : `社会学部 ${caption.health}`}</p>
          </Card>
        </div>
        <div className='w-1/3 top-1/3 left-0 absolute text-5xl font-medium text-center mt-4 ml-4'>
          <Card>
            <p className="text-sm font-semibold">{isLoading ? "loading" : `経済学部 ${caption.economics}`}</p>
          </Card>
        </div>
        <div className='w-1/3 top-2/3 left-0 absolute text-5xl font-medium text-center ml-4'>
          <Card>
            <p className="text-sm font-semibold">{isLoading ? "loading" : `体育館 ${caption.gym}`}</p>
          </Card>
        </div>
        <div className='w-1/3 top-2/3 left-1/2 absolute text-5xl font-medium text-center ml-8'>
          <Card>
            <p className="text-sm font-semibold">{isLoading ? "loading" : `スポ健 ${caption.sport}`}</p>
          </Card>
        </div>
      </Card>
    </div>
  )
}

export default Map
