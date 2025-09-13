import React from 'react'
import ProfileForm from './ProfileForm'

const Profile = () => {
  return (
    <div className='p-4 border'>
        <div>
            <h3>Profile Settings</h3>
            <p>Update your personal information and profile photo</p>
        </div>
        <ProfileForm />

    </div>
  )
}

export default Profile