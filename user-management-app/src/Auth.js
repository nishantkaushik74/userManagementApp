import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth ({ sessionData }) {
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const validateUser= async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
     ;

      // let { data, error, status } = await supabase
      //   .from('profiles')
      //   .select(`id,username, website, avatar_url,full_name,email`)
      //   .eq('email', email).eq('password',password)
      //   .single()
      const { data, error, status } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
     
      if (error && status == 406) {
       alert('Email or Password is incorrect')
      }

      if (data.user) {
        setSession(data.session)
        sessionData(data.session)
      }else{
        alert('Email or Password is incorrect')
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }
  
  
  return (
    <div className="row flex-center flex">
      <div className="col-6 form-widget" aria-live="polite">
        <h1 className="header">User management test app</h1>
        
        {loading ? (
          'Please wait while we validate you ...'
        ) : (
          <form onSubmit={validateUser}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="inputField"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="button block" aria-live="polite">
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  )
}