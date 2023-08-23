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
    <div className='authContainer'>
        {connected ? (
            <div className='auth'>
                <h1 className='authTitle'>Connexion</h1>
                <form className='authForm' onSubmit={handleSignIn}>
                    <input className='authInput' required type="email" name="email" placeholder="Adresse email"/>
                    <input className='authInput' required type="password" name="password" placeholder="Mot de passe" />
                    {error && <span>{error}</span>}
                    <input className='inputButton' type="submit" value="Se connecter" />
                </form>
            </div>
        ) : (
            <div className='auth'>
                <h1 className='authTitle'>Créer un compte</h1>
                <form className='authForm' onSubmit={handleSignUp}>
                    <input className='authInput' required type="email" name="email" placeholder="Adresse email"/>
                    <input className='authInput' required type="password" name="password" placeholder="Mot de passe" />
                    <input className='authInput' required type="password" name="confirmPassword" placeholder="Confirmez mot de passe" />
                    {error && <span>{error}</span>}
                    <input className='inputButton' type="submit" value="inscription" />
                </form>
            </div>
        )}
        <button className='authButton' onClick={() => setConnected(!connected)}>{connected ? "Vous n'avez pas encore de compte ?" : "Déja inscrit ?"}</button>
        <ToastContainer />
    </div>
  )
}
