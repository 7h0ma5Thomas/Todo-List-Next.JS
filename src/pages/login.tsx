import React from 'react'
import { useRouter } from 'next/router'
import { useSession } from '@supabase/auth-helpers-react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function Login() {
    const router = useRouter()
    const session = useSession()
    const supabaseClient = createPagesBrowserClient()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const dataForm = new FormData(event.currentTarget)
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: dataForm.get('email') as string,
            password: dataForm.get('password') as string
        })
        if (error) {
            console.log(error)
        }
        if (data) {
            router.push('/')
        }
    }
  return (
      <div>
          <h1>Connexion</h1>
          <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-2 text-zinc-600'>
              <input type="email" name="email" placeholder="Votre email" onChange={(e) => console.log(e.target.value)}/>
              <input type="password" name="password" placeholder="Votre mot de passe"/>
              <input type="submit" value="Connexion" />
          </form>
    </div>
  )
}
