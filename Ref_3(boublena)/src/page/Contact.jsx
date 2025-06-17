import React, { useState } from 'react'
import { useContactDetailsMutation } from '../store/service/ContactService'
import { useNavigate } from 'react-router-dom'
import ClipLoader from "react-spinners/ClipLoader";
import ThankYouPage from './Thanku';

const Contact = () => {
    const navigate = useNavigate()
    const [contactData] = useContactDetailsMutation()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const localData = localStorage.getItem('siteinfo') ? localStorage.getItem('siteinfo') : null
    const siteData = JSON.parse(localData)
    console.log(siteData)
    const [inputDetail, setInputDetails] = useState({
        name: '',
        email: '',
        message: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setInputDetails((prevState) => ({
            ...prevState, [name]: value
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await contactData(inputDetail)
            if (result?.data?.data) {
                navigate('/thanku')
                setLoading(false)
            } else {
                alert("something went wrong")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className='about_us about_section'>
                <div className="container page_width about_container ">
                    <h1 className='about_heading'>Contact</h1>
                </div>
            </div>
            <div className='bg-black-900 flex items-center py-20'>
                <div className='container page_width text-white max-w-[700px] w-full mx-auto'>
                    <h3 className='text-center pb-10'>{siteData.contactinfo[0].contactPageWordings}</h3>
                    <form onSubmit={onSubmit}>
                        <div className=''>
                            <label htmlFor="name"></label>
                            <input onChange={handleChange} className='w-full my-2 py-4 px-4 rounded-md placeholder:text-black-900 text-black outline-none text-black-900' id="name" name='name' placeholder="Name" type="text" required />
                        </div>
                        <div className=''>
                            <label htmlFor="email"></label>
                            <input onChange={handleChange} className='w-full my-2 py-4 px-4 rounded-md placeholder:text-black-900 text-black outline-none text-black-900' id="email" name='email' placeholder="Email" type="email" required />
                        </div>
                        <div className=''>
                            <label htmlFor="message"></label>
                            <textarea onChange={handleChange} className='w-full my-2 py-4 px-4 rounded-md placeholder:text-black-900 text-black outline-none text-black-900' id="message" name='message' placeholder="Message" rows="4" required></textarea>
                        </div>
                        <div className='text-center cursor-pointer border mt-10'>
                            {loading ?
                                <ClipLoader size={35} color='#fff' />
                                : <input className='px-4 cursor-pointer w-full py-2 rounded-md placeholder:text-black-900 text-black outline-none' type="submit" />}
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Contact