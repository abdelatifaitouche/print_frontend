import AXIOS_CONFIG from '@/config/axiosConfig';
import React from 'react';
import { useContext } from 'react';
import AuthContext from '@/contexts/AuthContext';


function ProfileHeader() {
  const {role} = useContext(AuthContext);

  return (
    <div className='flex items-center gap-2 p-3'>
        <div className='bg-black w-[30px] h-[30px] rounded-md'>

        </div>
        <div className='flex flex-col justify-center'>
            <h2 className='text-sm font-bold'>Abdelatif</h2>
            <h4 className='text-xs'>{role}</h4>
        </div>
    </div>
  )
}

export default ProfileHeader
