import React, { useState } from 'react'
import Loading from '../Loading'
import { Modal } from '@mui/material'
import { IoMdClose } from 'react-icons/io'
import toast from 'react-hot-toast'
import { changePassword } from '../../utils/service/DashboardService'
import { clearLocalStorage, } from '../../utils/LocalStorageUtills'
import { useNavigate } from "react-router-dom";

const ChangePasswordModal = ({open,close}) => {
  const [loading, setLoading] = useState(false);
    const [formData,setFormData]=useState({
        current_password:'',
        new_password:'',
        confirm_new_password:''
    })
    const navigate = useNavigate();

    const handleChange=(e)=>{
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
    }
    const handleSubmit=async(e)=>{

        e.preventDefault()
      
        const {current_password, new_password, confirm_new_password } = formData;
        if (new_password !== confirm_new_password) {
          return toast.error('New Password and Confirm New Password do not match');
        }else{
        try {
            setLoading(true)
            const formApiData=new FormData()
            formApiData.append("current_password",current_password)
            formApiData.append("new_password",new_password)
            
            const response=await changePassword(formApiData)
        
            if(response?.isSuccess){
                toast.success(response?.message);
                setFormData({
                  current_password: "",
                  new_password: "",
                  confirm_new_password: "",
                });
                clearLocalStorage("token")
                clearLocalStorage("adminRole")
                clearLocalStorage("email")
                clearLocalStorage("username")
                // Redirect to login page

                setTimeout(()=>{
                  toast.success("Please login again")
                },1000)
                
                setTimeout(()=>{
                  navigate("/auth/login");
                },4000)

                
               
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            
        }finally{
          setLoading(false)
        }
    }
    }
    
  return (
    <>
    {loading && <Loading />}

    <Modal open={open} onClose={()=>close()}  className="fixed inset-0 z-20 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-opacity-50">
      {/* <div style={show ? scaleTranslateInStyle : scaleTranslateOutStyle} className="rounded-lg relative h-[600px] overflow-y-auto mt-6 sm:h-[70vh] mainFormSection md:h-[80vh] lg:h-[60vh] xl:h-[70vh]  2xl:h-[75vh] 4xl:h-[60vh]"> */}
      <div className="rounded-lg relative  max-w-[55vw] h-[300px] overflow-y-auto mt-6 sm:h-[70vh] mainFormSection md:h-[80vh] lg:h-[60vh] xl:h-[70vh]  2xl:h-[75vh] 4xl:h-[60vh]">
        <div className="relative w-[100%] max-w-[55vw] sm:max-w-[100vw] md:max-w-[100vw] lg:max-w-[70vw] xl:max-w-[65vw] 2xl:max-w-[60vw] 3xl:max-w-[65vw] 4xl:max-w-[65vw] mx-auto rounded-lg overflow-hidden sm:w-[90vw] md:w-[90vw] lg:w-[96vw]">
          <div className="relative w-full bg-white rounded-lg shadow-md pb-2 ">
            <div className="flex w-full justify-between items-center bg-blue-900 py-2 4xl:border-r-primary">
              <h2 className="text-xl font-semibold text-gray-800 pl-4 text-white">Change Password</h2>
              <button onClick={close} className="text-red text-white hover:text-gray-900 hover:outline-none border-none outline-none bg-blue-900 text-lg">
                <IoMdClose />
              </button>
            </div>

            <div>
              {/* <form onSubmit={handleSubmit(onSubmit)} noValidate> */}
              <form onSubmit={handleSubmit}>
                <div className="p-4 items-center">
                  <div className="flex flex-col w-[100%] my-5 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                    <label className="text-blue-300 text-sm" htmlFor="event_title">
                      Current Password<span className="text-red-500 pl-1">*</span>
                    </label>
                    <input type="text" name="current_password"  placeholder="current password" className="input w-[700px]" onChange={handleChange} />
                    {/* <p>{errors?.event_title?.message}</p> */}
                  </div>
                  <div className="flex flex-col w-full my-5 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                    <label className="text-blue-300 text-sm" htmlFor="event_desc">
                      New Password
                    </label>
                    <input type="text" name="new_password"  placeholder="new password" className="input w-[700px]"  onChange={handleChange}/>
                    {/* <p>{errors?.event_desc?.message}</p> */}
                  </div>
                  <div className="flex flex-col w-full my-5 sm:w-[100%] md:w-[47%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                    <label className="text-blue-300 text-sm" htmlFor="event_desc">
                      Confirm New Password
                    </label>
                    <input type="text" name="confirm_new_password"  placeholder="confirm new password" className="input w-[700px]" onChange={handleChange} disabled={loading}/>
                    {/* <p>{errors?.event_desc?.message}</p> */}
                  </div>


                </div>
                <div className="flex justify-end mr-9 gap-2 sm:mr-0 sm:justify-center">
                    <button className="bg-blue-900 text-white font-semibold rounded-lg focus:outline-none w-[120px]" >{"Save"}</button>
                  <button className="border border-black bg-white text-black font-semibold rounded-lg focus:outline-none" onClick={()=>close()}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </>
  )
}

export default ChangePasswordModal
