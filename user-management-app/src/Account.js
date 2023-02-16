import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const Account = ({ session }) => {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [allUsers, setAllUsers] = useState([])
  const [full_name, setFullName] = useState('')
  const [website, setWebsite] = useState('')
  
  const [sessionUserId, setSessionUserId] = useState('')
  const [id, setId] = useState('')
  const [editfull_name, setEditFullName] = useState('')
  const [editemail, setEditEmail] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [editUserName, setEditUserName] = useState('')
  const [editwebsite, setEditWebsite] = useState('')
  const [avatar_url, setAvatarUrl] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [createNewUser, setCreateNewUser] = useState(false)
  useEffect(() => {
    setEditMode(false);
    getProfile()
    getAllProfile()
  },[session])

  const getProfile = async () => {
    try {
      setLoading(true)
      
      const {user}= session
;
let { data, error, status } = await supabase
.from('profiles')
.select(`username, website, avatar_url,full_name`)
.eq('id', user.id)
.single()

if (error && status !== 406) {
throw error
}

if (data) {
        
        setSessionUserId(user.id)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
        setFullName(data.full_name)
        setId(data.id)
}
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }
  const getAllProfile = async () => {
    try {
      setLoading(true)
       ;
       
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`id,username, website, avatar_url,full_name`)
     
        
     
        if (error && status !== 406) {
        throw error
      }

      if (data) {
        setAllUsers(data);
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }
  const setUserToEdit =async (data)=>{
    setEditMode(true)
    setId(data.id)
    setUsername(data.username)
    setWebsite(data.website)
    setAvatarUrl(data.avatar_url)
    setFullName(data.full_name)
  }
  const cancelEdit=async ()=>{
    setEditMode(false)
    setId('')
    setEditFullName('')
    setEditUserName('')
    setEditWebsite('')
    setEditPassword('')
  }
  const cancelCreate=async ()=>{
    setCreateNewUser(false)
    setId('')
    setEditFullName('')
    setEditUserName('')
    setEditWebsite('')
    setEditPassword('')
  }
  const deleteUser= async(val)=>{
    ;
    const { data, error } = await supabase
  .from('profiles')
  .delete()
  .match({ id: val.id })
    // const { data, error, status } = await supabase.auth.admin.deleteUser(val.id)
    await getAllProfile()
  }
  const updateProfile = async (e) => {
    e.preventDefault()

    try {
        
      setLoading(true)
      const { user } = session
 
      const updates = {
        id: id,
        username,
        website,
        full_name,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)
      await getAllProfile()
      setEditMode(false)
      if (error) {
        throw error
      }
     
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }
  const createProfile = async (e) => {
    e.preventDefault()
;
    try {
        
      setLoading(true)
      
      const { data } = await supabase.auth.signUp({
        email: editemail,
        password: editPassword,
      })
 
      const updates = {
        id:data.user.id,
        username:editUserName,
        website:'',
        full_name:editfull_name,
        avatar_url:'',
        email:editemail,
        password:editPassword
      }

      let { error } = await supabase.from('profiles').upsert(updates)
      setAllUsers([])
      await getAllProfile()
      setCreateNewUser(false)
      cancelCreate()
      if (error) {
        throw error
      }
     
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }
const createUser =()=>{
    setId('')
    setEditFullName('')
    setUsername('')
    setEditWebsite('')
    setEditEmail('')
    setEditPassword('')
    setCreateNewUser(true)
}

  return (
    <div aria-live="polite">
         <div>Logged In User Email: {session.user.email}</div> <button onClick={()=>{createUser()}}>create User</button>
      {editMode &&
       
        <form onSubmit={updateProfile} className="form-widget">
         
          <div>
            <label htmlFor="username">Name</label>
            <input
              id="username"
              type="text"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
           
          <div>
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={full_name || ''}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <button className="button primary block" disabled={loading}>
             Edit Profile
            </button>  
            <input type="button" onClick={()=>cancelEdit()} className="button primary block" value="Cancel" />
          </div>
        </form>
      }
      {createNewUser &&
       
       <form onSubmit={createProfile} className="form-widget">
        
         <div>
           <label htmlFor="username">Name</label>
           <input
             id="username"
             type="text"
             value={editUserName || ''}
             onChange={(e) => setEditUserName(e.target.value)}
           />
         </div>
          
         <div>
           <label htmlFor="fullName">Full Name</label>
           <input
             id="fullName"
             type="text"
             value={editfull_name || ''}
             onChange={(e) => setEditFullName(e.target.value)}
           />
         </div>
         <div>
           <label htmlFor="email">Email</label>
           <input
             id="email"
             type="text"
             value={editemail || ''}
             onChange={(e) => setEditEmail(e.target.value)}
           />
         </div>
         <div>
           <label htmlFor="password">Password</label>
           <input
             id="password"
             type="password"
             value={editPassword || ''}
             onChange={(e) => setEditPassword(e.target.value)}
           />
         </div>
         <div>
           <button className="button primary block" disabled={loading}>
            create Profile
           </button>  
           <input type="button" onClick={()=>cancelCreate()} className="button primary block" value="Cancel" />
         </div>
       </form>
     }
      {allUsers.length>0 && <table>
        <tbody>
        <tr>
          <th>Action</th>
          <th>User Name</th>
          <th>Full Name</th>
        </tr>
        {allUsers.map((val, key) => {
          return (
            <tr key={key}>
             <td> { (sessionUserId == val.id) && <button onClick={() => setUserToEdit(val)}>edit</button>}
             { (sessionUserId != val.id) &&  <button onClick={() => deleteUser(val)}>Delete</button>}
             </td>
              <td>{val.username}</td>
              <td>{val.full_name}</td>
               
            </tr>
          )
        })}
        </tbody>
      </table>   
}
      <button type="button" className="button block" onClick={() => supabase.auth.signOut()}>
        Sign Out
      </button>
    </div>
  )
}

export default Account