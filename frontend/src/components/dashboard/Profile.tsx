import React from 'react'
import ProfileForm from './ProfileForm'

const Profile = () => {
  return (
    <div className='bg-white rounded-lg border border-gray-200 p-4 sm:p-6'>
       {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-semibold text-slate-800 mb-2">Profile Settings</h2>
        <p className="text-sm text-slate-600">Manage your personal information and account security</p>
      </div>
      <ProfileForm />
    </div>
  )
}

export default Profile