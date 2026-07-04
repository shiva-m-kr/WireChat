import { useEffect, useRef } from 'react'
function ReceiverMessage({ image, message }) {
  let scroll = useRef();
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);


  const handleImageScroll=()=>{
        scroll.current?.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <div className="w-fit max-w-[70%] px-3 py-2  bg-[rgb(19,116,164)] break-words text-white text-[19px] 
      rounded-2xl rounded-tl-none rounded-2xl relative left-0 
      shadow-grey-400 shadow-lg gap-[10px]  flex flex-col">
      <div ref={scroll}>
        {image && <img src={image} alt="" className="w-[100px] rounded-large" onLoad={handleImageScroll}/>}
        {message && <span>{message}</span>}
      </div>
    </div>
  )
}

export default ReceiverMessage