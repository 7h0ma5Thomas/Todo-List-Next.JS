import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { notify } from '@/Lib/notify'

export default function Auth() {
    const router = useRouter()
    const [error, setError] = React.useState<string | null>(null)
    const supabaseClient = createPagesBrowserClient()
    const [connected, setConnected] = useState(true)

    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const dataForm = new FormData(event.currentTarget)
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: dataForm.get('email') as string,
            password: dataForm.get('password') as string
        })
        if (error) {
            setError("Email ou mot de passe incorrect")
        }
        if (data) {
            router.push('/')
        }
    }
    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const dataForm = new FormData(event.currentTarget)
        const password = dataForm.get('password') as string
        const confirmPassword = dataForm.get('confirmPassword') as string
        if (password !== confirmPassword ) {
            setError("Les mots de passe doivent être identiques")
            return
        }
        if (password.length < 6) {
            setError("Votre mot de passe doit contenir au moins 6 caractères")
            return
        }
        const { data, error } = await supabaseClient.auth.signUp({
            email: dataForm.get('email') as string,
            password: password
        })
        if (error) {
            console.log(error);
            
            setError("Oups !")
        }
        if (data) {
            setConnected(true)
            notify("Un email de confirmation a été envoyé sur votre boîte mail, merci de cliquer sur le lien pour finaliser la création de votre compte", 'success')
        }
    }
  return (
    <div>
        {connected ? (
            <>
                <h1>Connexion</h1>
                <form onSubmit={handleSignIn} className='grid grid-cols-1 gap-2 text-zinc-600'>
                    <input required type="email" name="email" placeholder="Votre email"/>
                    <input required type="password" name="password" placeholder="Votre mot de passe" />
                    {error && <span>{error}</span>}
                    <input type="submit" value="Connexion" />
                </form>
            </>
        ) : (
            <>
                <h1>Créez votre compte</h1>
                <form onSubmit={handleSignUp} className='grid grid-cols-1 gap-2 text-zinc-600'>
                    <input required type="email" name="email" placeholder="Votre email"/>
                    <input required type="password" name="password" placeholder="Votre mot de passe" />
                    <input required type="password" name="confirmPassword" placeholder="Confirmez votre mot de passe" />
                    {error && <span>{error}</span>}
                    <input type="submit" value="inscription" />
                </form>
            </>
        )}
        <button onClick={() => setConnected(!connected)}>{connected ? "Vous n'avez pas encore de compte" : "Déja inscrit"}</button>
        <ToastContainer />
    </div>
  )
}
