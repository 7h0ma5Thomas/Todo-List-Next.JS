import React from 'react'
import { useRouter } from 'next/router'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function Login() {
    const router = useRouter()
    const [error, setError] = React.useState<string | null>(null)
    const supabaseClient = createPagesBrowserClient()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
  return (
      <div>
          <h1>Connexion</h1>
          <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-2 text-zinc-600'>
              <input required type="email" name="email" placeholder="Votre email"/>
              <input required type="password" name="password" placeholder="Votre mot de passe" />
              {error && <span>{error}</span>}
              <input type="submit" value="Connexion" />
          </form>
    </div>
  )
}
