import React, { useState, useRef, useEffect } from 'react';
import Login from "@components/login";
import { supabase } from "@supabase/client";
import Image from 'next/image';
import { User } from "../customTypes/user";
import UserMenuModal from './userMenuModal';
import { useRouter } from 'next/router';


interface Props {
  user: User | undefined,
}

export default function Header({ user }: Props) {
  const [isOpenLoginCP, setIsOpenLoginCp] = useState(false);
  const [isClickUserName, setIsClickUserName] = useState(false);
  const userBoxRef = useRef<HTMLElement>(null) as React.MutableRefObject<HTMLDivElement>;
  const userMenuModalRef = useRef<HTMLElement>(null) as React.MutableRefObject<HTMLDivElement>

  const router = useRouter();

  const closeLoginBox = (): void => {
    setIsOpenLoginCp(false)
  }

  useEffect(() => {

    function handleClickOutside(event: React.BaseSyntheticEvent | MouseEvent) {
      if (userBoxRef.current && !userBoxRef.current.contains(event.target) && userMenuModalRef.current && !userMenuModalRef.current.contains(event.target)) {
        setIsClickUserName(false)
      }
    }

    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])


  const logOut = async () => {
    setIsClickUserName(false)
    router.push('/')
    await supabase.auth.signOut()
  }

  const clickUserNameBox = () => {
    setIsClickUserName(!isClickUserName)
  }

  const uploadRounter = () => {
    router.push('/upload')
  }

  return (
    <div className={`relativev w-full ${router.pathname === '/upload' ? 'fixed top-0 left-0 right-0 z-20' : 'block'}`}>
      <div className={'flex justify-between bg-header-gray w-full h-12  pl-10 pr-8 md:pr-6 items-center text-amber-50'}>
        <div className={'text-3xl'}>POLY</div>
        <div className={'flex justify-between items-center space-x-5'}>
          <button onClick={uploadRounter} className={'border bg-white text-black py-1.5 pr-3 pl-2 text-[10px] font-extrabold rounded flex justify-between items-center'}>
            <Image src='/upload1.png' width={'10px'} height={'10px'} alt='uploadPng' />
            <p className={'ml-1'}>UPLOAD</p></button>
          {user !== undefined ?
            <div onClick={clickUserNameBox} ref={userBoxRef} className={'flex justify-between items-center space-x-2 cursor-pointer'}>
              <div><p>{user.name}</p></div>
              <svg className={`rotate-${isClickUserName ? '0' : '180'}`} width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.50387 7L8.52387 0.0299997H0.473867L4.50387 7Z" fill="white" />
              </svg>
            </div>
            :
            <div className={'cursor-pointer'} onClick={() => setIsOpenLoginCp(!isOpenLoginCP)}>LOGIN</div>}
        </div>
      </div>
      {isOpenLoginCP && <Login closeLoginBox={closeLoginBox} />}
      {isClickUserName && <UserMenuModal ref={userMenuModalRef} logOut={logOut} />}
    </div>
  )
}