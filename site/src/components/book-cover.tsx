'use client';
import Image from 'next/image';
import {useState} from 'react';
import styles from './home-bookcase.module.css';
export function BookCover({src,name}:{src:string;name:string}){
  const [failed,setFailed]=useState(false);
  return failed?<span className={styles.fallback} aria-hidden="true">{name}</span>:<Image unoptimized src={src} width={110} height={165} alt="" onError={()=>setFailed(true)}/>;
}
