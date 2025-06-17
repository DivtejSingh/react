import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useNewsLetterMutation } from '../store/service/FooterService';
import toast from 'react-hot-toast';
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from 'react-router-dom';

const Footer = () => {
  const dataToDisplay = useSelector((state) => state?.category?.category);
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false)
  const [heading, setHeadingColor] = useState('')
  const [footerColor, setFootetColor] = useState('')
  const [newsLetter] = useNewsLetterMutation();
  const data = localStorage.getItem("siteinfo");
  const siteinfo = JSON.parse(data);
  const hideFooterRoutes = ['/reels'];
  const shouldHideFooter = hideFooterRoutes.some(route => location.pathname.includes(route));



  const filteredNavigation = dataToDisplay?.data
    ? Object.fromEntries(
      Object.entries(dataToDisplay.data).filter(([category, items]) =>
        items.some((item) => item.total > 0)
      )
    )
    : {};

  useEffect(() => {
    if (siteinfo) {
      siteinfo?.contactinfo.map((item) => {
        setHeadingColor(item.footerMenuColor)
        setFootetColor(item.footerBgColor)
      })
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await newsLetter({ email });
      if (response?.data?.isSuccess) {
        setEmail('');
        toast.success('Thank you for subscribing!');
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  };

  if (shouldHideFooter) {
    return null;
  }

  return (
    <footer className="bg-[#0f0f0f] text-white py-10" style={{ backgroundColor: footerColor }}>
      {/* <div className="flex justify-center mb-8">
        <h1 className="text-xl md:text-2xl text-center font-black">BOUBOULENA CREATIVE</h1>
      </div> */}
      <div className="container mx-auto px-4 grid grid-cols-3 sm:grid-cols-2 md:grid-cols-4 gap-8 my-8">
        <div className="flex flex-col items-start md:items-start mb-6 md:mb-0">
          <h3 className="text-lg text-left font-semibold mb-4" style={{ color: heading }}>Services</h3>
          <ul className="space-y-2">
            <li><HashLink to="/" className="hover:text-gray-400">Home</HashLink></li>
            <li><HashLink to="/about_us" className="hover:text-gray-400">About</HashLink></li>
          </ul>
        </div>

        <div className="flex flex-col items-start md:items-start mb-6 md:mb-0">
          {Object.entries(filteredNavigation).length > 0 && (
            <>
              <h3 className="text-lg text-left font-semibold mb-4" style={{ color: heading }}>Categories</h3>
              <ul className="space-y-2">
                {Object.entries(filteredNavigation).map(([category, items]) => {
                   return(
                  items.map((item) => (
                    <li key={`${category}-${item.id}`}>
                      <HashLink to={`/#${category}`} className="hover:text-gray-400">{category}</HashLink>
                    </li>
                  ))
                )})}
              </ul>
            </>
          )}
        </div>

        {siteinfo?.contactinfo?.map((item, index) => {
          return (
            <div key={index} className="flex flex-col items-start md:items-start mb-6 md:mb-0">
              <h3 className="text-lg text-left font-semibold mb-4" style={{ color: heading }}>Contact Us</h3>
              <p className="text-base mb-1">{item?.address}</p>
              <p className="text-base mb-1">{item?.contact_email}</p>
              <p className="text-base mb-1">{item?.contact_phone}</p>
              <div className="flex flex-col items-start md:items-start mb-6 mt-5 md:mb-0">
                {/* <h3 className="text-base text-left">{item.contactPageWordings}</h3> */}
                <h3 className="text-base text-left">{item.newsLetterHeadding}</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4 border-[#ccc] border-b">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full py-2 text-gray-700 bg-transparent border-none rounded-md focus:outline-none focus:ring-0"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@email.com"
                      required
                    />
                  </div>
                  <div className='text-center cursor-pointer border'>
                    {loading ?
                      <ClipLoader size={34} color='#fff' />
                      :
                      <button className='px-4 cursor-pointer w-full py-2 rounded-md placeholder:text-black-900 text-black outline-none' type="submit">Submit</button>
                    }
                  </div>
                </form>
              </div>
            </div>
          )
        })}

      </div>
      {/* <div className="mt-8 text-center">
        &copy; {new Date().getFullYear()} BOUBOULENA CREATIVE. All rights reserved.
      </div> */}
    </footer>
  );
};

export default Footer;
