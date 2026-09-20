
import { useEffect, useState } from 'react'
import axios from 'axios';

function App() {
  const [userData, setUserData] = useState({})
  const [allUsers, setAllUsers] = useState([])
  const [updateExist, setUpdateExist] = useState(false)
  const [userId, setUserId] = useState('')
  const handleData = (e)=>{
    let {name,value} = e.target
    setUserData({...userData, [name]:value})
  }
  const handleForm = async ()=>{
    try{
      const response = await axios.post('http://localhost:8000/registration', userData)
    }
    catch(error){
      console.log(error)
    }
    getAllUsers()
    setUserData({
      username:'', 
      email:'',
      password:''
    })
  }
  const getAllUsers = async ()=>{
    const userInfo = await axios.get('http://localhost:8000/allUsers')
      setAllUsers(userInfo.data)
  }
  useEffect(()=>{
    getAllUsers()
  }, [])
  
  const handleUpdate = (item)=>{
    setUserId(item._id)
    setUpdateExist(true)
    setUserData({
      username:item.username,
      email:item.email,
      password:item.password
    })
  }
  const handleFormUpdate = async ()=>{
    await axios.post(`http://localhost:8000/update/${userId}`, userData)
    getAllUsers()
    setUpdateExist(false)
    setUserData({
      username:'', 
      email:'',
      password:''
    })
  }
  const handleDelete = async (item)=>{
    console.log(item._id)
    await axios.delete(`http://localhost:8000/delate/${item._id}`)
    getAllUsers()
  }


  return (
    <>
      <input  onChange={(e)=>{handleData(e)}} value={userData.username} type='text' name='username' placeholder='Enter your username.....'/> <br /> <br />
      <input  onChange={(e)=>{handleData(e)}} value={userData.email} type='email' name='email' placeholder='Enter your email.....'/> <br /> <br />
      <input  onChange={(e)=>{handleData(e)}} value={userData.password} type='password' name='password' placeholder='Enter your password.....'/> <br /> <br />
      {updateExist? <button onClick={()=>{handleFormUpdate()}}>Update</button> :  <input onClick={()=>{handleForm()}} type='submit'/>}
      
      <div className="card_wrapper">
        {
          allUsers?.map((item, index)=>(
          <div className="card_item" key={index}>
              <p >{item.username}</p>
              <p >{item.email}</p>
              <p >{item.password}</p>
              <button  onClick={()=>{handleUpdate(item)}}>Update</button> <br />
              <button  onClick={()=>{handleDelete(item)}}>Delete</button>
          </div>
          ) ) }
          
      </div>
    </>
  )
}

export default App
