import { useState } from 'react'
import { axiosClient } from "@/axios/axios" // Ensure this path is correct
import { toast } from "sonner" // Ensure this path is correct
import { useRecoilState } from 'recoil'
import { userInfo } from '@/atoms/user'

const useUpdateProfile = (fullname: string, avatar: File | string | null) => {
  const [isLoading, setIsLoading] = useState(false)
  const [user , setUser] = useRecoilState(userInfo)

  const updateProfile = async (newFullname: string | "", newAvatar: File | string) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('id' , user.id)

      formData.append('FullName', newFullname)
      if (newAvatar instanceof File) {
        formData.append('avatar', newAvatar)
      } else {
        formData.append('avatarUrl', newAvatar)
      }

      const response = await axiosClient.post('/user/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' 
        }
      })

      if (response.status === 200) {
        setUser(response.data.user)
        toast.success("Profile Updated Successfully")
        return response.data.user
      } else {
        toast.error("Failed to update profile")
      }
    } catch (error) {
      toast.error("An error occurred while updating profile")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, updateProfile }
}

export default useUpdateProfile
