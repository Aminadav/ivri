import { useEffect } from "react";

export default function useStyleSheet(css){
  useEffect(()=>{
    var style=document.createElement('style')
    style.innerText=css
    document.body.appendChild(style)
    return ()=>{
      document.body.removeChild(style)
    }
  },[])
}