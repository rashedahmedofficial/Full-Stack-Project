import { useEffect, useState } from 'react'
import axios from 'axios';

function App() {
  const [userData, setUserData] = useState({ username: '', email: '', password: '' })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [allUsers, setAllUsers] = useState([])
  const [updateExist, setUpdateExist] = useState(false)
  const [userId, setUserId] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleData = (e) => {
    let { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleForm = async () => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('username', userData.username)
      formData.append('email', userData.email)
      formData.append('password', userData.password)
      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }
      await axios.post('http://localhost:8000/registration', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    } catch (error) {
      console.log(error)
    } finally {
      setUploading(false)
    }
    getAllUsers()
    resetForm()
  }

  const getAllUsers = async () => {
    const userInfo = await axios.get('http://localhost:8000/allUsers')
    setAllUsers(userInfo.data)
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  const resetForm = () => {
    setUserData({ username: '', email: '', password: '' })
    setAvatarFile(null)
    setAvatarPreview('')
  }

  const handleUpdate = (item) => {
    setUserId(item._id)
    setUpdateExist(true)
    setUserData({
      username: item.username,
      email: item.email,
      password: item.password,
    })
    setAvatarPreview(item.avatar || '')
    setAvatarFile(null)
  }

  const handleFormUpdate = async () => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('username', userData.username)
      formData.append('email', userData.email)
      formData.append('password', userData.password)
      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }
      await axios.post(`http://localhost:8000/update/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    } catch (error) {
      console.log(error)
    } finally {
      setUploading(false)
    }
    getAllUsers()
    setUpdateExist(false)
    resetForm()
  }

  const handleDelete = async (item) => {
    console.log(item._id)
    await axios.delete(`http://localhost:8000/delate/${item._id}`)
    getAllUsers()
  }

  return (
    <div >
      <h2>Student data center</h2>

      <div >
        {avatarPreview && (
          <div >
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #ddd' }}
            />
          </div>
        )}

        <input
          onChange={(e) => { handleData(e) }}
          value={userData.username}
          type='text'
          name='username'
          placeholder='Enter your username.....'
         
        />
        <br />
        <input
          onChange={(e) => { handleData(e) }}
          value={userData.email}
          type='email'
          name='email'
          placeholder='Enter your email.....'
         
        />
        <br/>
        <input
          onChange={(e) => { handleData(e) }}
          value={userData.password}
          type='password'
          name='password'
          placeholder='Enter your password.....'
        />
        <br />
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Upload  Image:</label>
        <input
          onChange={handleAvatarChange}
          type='file'
          name='avatar'
          accept='image/jpeg,image/png,image/gif,image/webp'
          style={{ marginBottom: '10px' }}
        />
        <br />
        {updateExist ? (
          <button
            onClick={() => { handleFormUpdate() }}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Update'}
          </button>
        ) : (
          <input
            onClick={() => { handleForm() }}
            type='submit'
            disabled={uploading}
            value={uploading ? 'Uploading...' : 'Register'}
           
          />
        )}
      </div>

      <h3>All Users</h3>
      <div className="card_wrapper" >
        {
          allUsers?.map((item, index) => (
            <div className="card_item" key={index} >
              {item.avatar ? (
                <img
                  src={item.avatar}
                  alt={item.username}
                  
                />
              ) : (
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#eee', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                  No Image
                </div>
              )}
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{item.username}</p>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>{item.email}</p>
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#999' }}>{item.password}</p>
              <button onClick={() => { handleUpdate(item) }} style={{ padding: '5px 10px', margin: '5px 2px', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Update</button>
              <br />
              <button onClick={() => { handleDelete(item) }} style={{ padding: '5px 10px', margin: '5px 2px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default App
