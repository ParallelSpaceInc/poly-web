import "@styles/globals.css";
import type { AppProps } from "next/app";
import Header from "@components/header";
import { supabase } from "@supabase/client";
import { useEffect, useState } from "react";
import { User } from '../customTypes/user'



function MyApp({ Component, pageProps }: AppProps) {

  const [user, setUser] = useState<User | undefined>(undefined)

  const session = supabase.auth.session();

  useEffect(() => {
    if (session && session.user) {
      let userData: User = {
        user_id: session.user.id,
        name: session.user.user_metadata.user_name || session.user.user_metadata.full_name,
        email: session.user.email,
        phone: session.user.phone !== "" ? session.user.phone : null
      }
      if (session?.user?.phone) {
        userData = { ...userData, phone: session?.user?.phone }
      }
      setUser(userData)
    }
  }, [session])

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {

      if (event === 'SIGNED_IN') {

        const loggedInUser = supabase.auth.user()

        if (loggedInUser) {
          fetch('/api/auth', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'same-origin',
            body: JSON.stringify({ event, session }),
          }).then((res) => res.json())



          let userInfo: User = {
            user_id: loggedInUser.id,
            name: loggedInUser.user_metadata.user_name || loggedInUser.user_metadata.full_name,
            email: loggedInUser.email,
            phone: loggedInUser.phone ? loggedInUser.phone : null
          }

          if (loggedInUser?.phone !== "") {
            userInfo = { ...userInfo, phone: loggedInUser.phone }
          }

          const { success, user, error } = await fetch('/api/signUp', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ userInfo }),
          }).then((res) => res.json())

          if (!success) return alert(error)

          setUser(user)
        }


      } else if (event === 'SIGNED_OUT') {
        setUser(undefined)
      }
    })

    return () => {
      authListener?.unsubscribe();
    }
  }, [])

  return (
    <>
      <Header user={user} />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp;
