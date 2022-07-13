import React, {useState} from 'react';
import Link from "next/link";
import Image from "next/image";
import Login from "@components/login";

export default function Header(){

    const [isOpenLoginCP,setIsOpenLoginCp] = useState(false);

    const closeLoginBox = () : void  => {
        setIsOpenLoginCp(false)
    }

    return (
        <div className={'relative'}>
            <div className={'flex bg-indigo-800 w-full h-12 justify-between pl-10 pr-16 items-center text-amber-50'}>
                <Link href={'/'}>
                    <a className={'flex items-center'}>
                        <Image src={'/210105_pspace_logo_W.png'} width={70} height={20}/>
                    </a>
                </Link>
                <div className={'cursor-pointer'} onClick={()=>setIsOpenLoginCp(!isOpenLoginCP)}>LOGIN</div>
            </div>
            {isOpenLoginCP && <Login closeLoginBox={closeLoginBox}/>}
        </div>

    )
}