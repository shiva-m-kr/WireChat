import { useEffect } from "react";
import { useRef } from "react";

function SenderMessage({image,message}) {
  let scroll=useRef();
  useEffect(() => {
     scroll.current?.scrollIntoView({ behavior: "smooth" });
  },[message,image]);
  const handleImageScroll=()=>{
        scroll.current?.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <div className="w-fit max-w-[70%] px-3 py-2  bg-[rgb(37,238,234)] break-words text-white text-[19px] 
    rounded-2xl rounded-br-none relative right-0 ml-auto 
    shadow-grey-400 shadow-lg gap-[10px]  flex flex-col">
      <div ref={scroll}>
        {image &&     <img src={image} alt="" className="w-[100px] rounded-large" onLoad={handleImageScroll} />}
        {message && <span>{message}</span>}
      </div>
    
    </div>
  )
}

export default SenderMessage