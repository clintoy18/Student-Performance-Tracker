import React from 'react'
import ProfileForm from './ProfileForm'

const Profile = () => {
  return (
    <div className='bg-white rounded-lg border border-gray-200 p-4 sm:p-6'>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
        <p className="text-sm text-gray-500 mt-1">Update your personal information</p>
      </div>
      <ProfileForm />
    </div>
  )
}

export default Profile