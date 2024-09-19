import React from 'react'

// eslint-disable-next-line react/display-name
const DiscountInformation = React.memo((props:{text:string}) => {
  return (
    <div className="bg-gradient-to-r bg-opacity-80 from-orange-400 to-purple-500 border-gray-300 border rounded-full shadow my-2 text-center">
      <p className="w-full text-2xl my-2 font-semibold from-red-600 to-purple-700 bg-clip-text text-transparent tracking-widest bg-gradient-to-r">{props.text}</p>
    </div>
  )
})

export default DiscountInformation
