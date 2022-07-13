import "@styles/globals.css";
import type {AppProps} from "next/app";
import Header from "@components/header";
import {supabase} from "@supabase/client";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

export interface UserData {
    user_id: string | undefined,
    name: string,
    email: string | undefined,
    avatar: string,
    created_at: string | undefined
}

function MyApp({Component, pageProps}: AppProps) {
    const router = useRouter();

    const [user, setUser] = useState<UserData | undefined>(undefined)

    const session = supabase.auth.session();
    useEffect(() => {
        if (session) {
            const userData : UserData = {
                user_id: session?.user?.id,
                name: session?.user?.user_metadata.user_name || session?.user?.user_metadata.full_name ,
                email: session?.user?.email,
                avatar: session?.user?.user_metadata.avatar_url,
                created_at: session?.user?.created_at
            }
            setUser(userData)
        }
    }, [session])

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN') {
                const loggedInUser = supabase.auth.user()
                fetch('/api/auth', {
                    method: 'POST',
                    headers: new Headers({'Content-Type': 'application/json'}),
                    credentials: 'same-origin',
                    body: JSON.stringify({event, session}),
                }).then((res) => res.json())

                if (event === 'SIGNED_IN') {

                    const {data} = await supabase.from('profiles').select('*').eq('user_id', loggedInUser?.id);

                    const userInfo: UserData = {
                        user_id: loggedInUser?.id,
                        name: loggedInUser?.user_metadata.user_name || loggedInUser?.user_metadata.full_name,
                        email: loggedInUser?.email,
                        avatar: loggedInUser?.user_metadata.avatar_url,
                        created_at: loggedInUser?.created_at
                    }
                    if (!data?.length && loggedInUser) {

                        await supabase.from('profiles').insert([
                            userInfo
                        ])
                    }
                    setUser(userInfo)
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(undefined)

                await router.push('/')
            }
        })


    }, [])

    return (
        <>
            <Header user={user}/>
            <Component {...pageProps} />
        </>
    )
}

export default MyApp;
