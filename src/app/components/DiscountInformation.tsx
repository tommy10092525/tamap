import Link from 'next/link';
import React from 'react'

// eslint-disable-next-line react/display-name
const DiscountInformation = (props:{text:string}) => {
  const {text}=props;
  return (
    <div className="bg-gradient-to-r bg-opacity-80 from-red-400 to-sky-300 border-gray-300 border rounded-full shadow my-2 text-center">
      <Link
        className="w-full h-full text-lg font-semibold my-2 text-white bg-clip-text block"
        href='https://codemates.lolitapunk.jp/tamap/templates/tamap_discount'>{text}</Link>
    </div>
  )
}

export default DiscountInformation
