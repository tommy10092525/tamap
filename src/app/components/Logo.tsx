import React from 'react'
import Image from 'next/image'
import logo from "../../../public/images/Tamap_logo.png"

// eslint-disable-next-line react/display-name
const Logo = React.memo(() => {
  return (
    <Image
    className="pb-3"
    style={{ width: "60%" }}
    src={logo}
    height={274}
    alt="たまっぷのロゴ"
    />
  )
})

export default Logo
