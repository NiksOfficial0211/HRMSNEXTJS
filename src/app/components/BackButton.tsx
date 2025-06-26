'use client'
import React from 'react'

import { useRouter } from "next/navigation";


const BackButton = ({isCancelText}:{isCancelText:boolean}) => {
    const router = useRouter();

  return (
    <a  className="red_button" style={{marginRight:"10px"}} onClick={()=>router.back()}>{isCancelText?"Cancel":"Back"}</a>
  )
}

export default BackButton