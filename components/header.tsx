import React, {useState} from 'react';
import Link from "next/link";
import Image from "next/image";
import Login from "@components/login";
import {supabase} from "@supabase/client";
import {UserData} from "../pages/_app";

interface Props {
    user: UserData | undefined,
}

export default function Header({user}: Props) {
    const [isOpenLoginCP, setIsOpenLoginCp] = useState(false);

    const closeLoginBox = (): void => {
        setIsOpenLoginCp(false)
    }

    const logOut = async () => {
        await supabase.auth.signOut()
    }

    return (
        <div className={'relative'}>
            <div className={'flex justify-end bg-gray-400 w-full h-12  pl-10 pr-16 items-center text-amber-50'}>
                {user !== undefined ? <div className={'flex justify-between items-center space-x-5'}>
                    <div><p>{user.name}님</p></div>
                    <button className={'border-2 px-2 rounded'} onClick={logOut}>log out</button>
                </div> : <div className={'cursor-pointer'} onClick={() => setIsOpenLoginCp(!isOpenLoginCP)}>LOGIN</div>}
            </div>
            {isOpenLoginCP && <Login closeLoginBox={closeLoginBox}/>}
        </div>
    )
}