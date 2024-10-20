import React from 'react'
import Image from 'next/image'
import logo from "../../../public/images/Tamap_logo.png"

// eslint-disable-next-line react/display-name
const Logo = () => {
  return (
    <div className='w-full'>
      <Image
      className="pb-3 mx-auto"
      style={{ width: "60%" }}
      src={logo}
      height={274}
      alt="たまっぷのロゴ"
      />
    </div>
  )
}

export default Logo
