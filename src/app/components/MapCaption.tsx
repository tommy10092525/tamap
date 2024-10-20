import React from 'react'
import Image from 'next/image';
import mapImage from "../../../public/images/Map.png"
import Card from './Card';
import { Caption } from './Types';
import TimeBox from './TimeBox';

// eslint-disable-next-line react/display-name
const MapCaption = (props: {isLoading:boolean,caption:Caption}) => {
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
          <TimeBox text="学部到達目安"/>
        </div>
        <div className='w-1/3 top-1/3 left-1/2 absolute text-5xl font-medium text-center mt-4 ml-8'>
          <TimeBox text={isLoading ? "loading" : `社会学部 ${caption.health}`}/>
        </div>
        <div className='w-1/3 top-1/3 left-0 absolute text-5xl font-medium text-center mt-4 ml-4'>
          <TimeBox text={isLoading ? "loading" : `経済学部 ${caption.economics}`}></TimeBox>
        </div>
        <div className='w-1/3 top-2/3 left-0 absolute text-5xl font-medium text-center ml-4'>
          <TimeBox text={isLoading ? "loading" : `体育館 ${caption.gym}`}></TimeBox>
        </div>
        <div className='w-1/3 top-2/3 left-1/2 absolute text-5xl font-medium text-center ml-8'>
          <TimeBox text={isLoading ? "loading" : `スポ健 ${caption.sport}`}></TimeBox>
        </div>
      </Card>
    </div>
  )
}

export default MapCaption
