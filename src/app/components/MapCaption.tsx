import React from 'react'
import Image from 'next/image';
import mapImage from "../../../public/images/Map.png"
import {Card} from '@/components/ui/card';
import { Caption } from './Types';
import TimeBox from './TimeBox';

// eslint-disable-next-line react/display-name
const MapCaption = (props: {isLoading:boolean,caption:Caption}) => {
  const { isLoading, caption } = props;
  return (
    <div className="backdrop-blur-xl mx-0 border-opacity-40 w-full">
      <Card className='border-0 bg-opacity-15'>
        <Image
          className="w-full"
          src={mapImage}
          width={500}
          height={500}
          alt="地図" />
        <div className="top-0 left-0 absolute mt-2 ml-2 w-1/2 font-medium text-5xl text-center">
          <TimeBox text="学部到達目安"/>
        </div>
        <div className='top-1/3 left-1/2 absolute backdrop-blur-sm mt-4 ml-8 rounded-md w-1/3 font-medium text-5xl text-center'>
          <TimeBox text={isLoading ? "loading" : `社会学部 ${caption.health}`}/>
        </div>
        <div className='top-1/3 left-0 absolute backdrop-blur-sm mt-4 ml-4 rounded-md w-1/3 font-medium text-5xl text-center'>
          <TimeBox text={isLoading ? "loading" : `経済学部 ${caption.economics}`}></TimeBox>
        </div>
        <div className='top-2/3 left-0 absolute backdrop-blur-sm ml-4 rounded-md w-1/3 font-medium text-5xl text-center'>
          <TimeBox text={isLoading ? "loading" : `体育館 ${caption.gym}`}></TimeBox>
        </div>
        <div className='top-2/3 left-1/2 absolute backdrop-blur-sm ml-8 rounded-md w-1/3 font-medium text-5xl text-center'>
          <TimeBox text={isLoading ? "loading" : `スポ健 ${caption.sport}`}></TimeBox>
        </div>
      </Card>
    </div>
  )
}

export default MapCaption
