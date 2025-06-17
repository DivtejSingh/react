import React from 'react'
import { BrowserRouter, Route, Routes, HashRouter } from 'react-router-dom'
import Home from '../page/Home'
import WithHomeLayout from '../hoc/WithHomeLayout'
import VideoPlayBack from '../page/VideoPlayBack'
import Header from '../components/Header'
import DroneVideos from '../page/DroneVideos'
import Founder from '../page/Founder'
import Footer from '../components/Footer'
import IphoneVideo from '../page/IphoneVideo'
import YoutubeSeries from '../page/YoutubeSeries'
import Contact from '../page/Contact'
import Editorial from '../page/Editorial'
import AboutUs from '../page/AboutUs'
import ThankYouPage from '../page/Thanku'
import Category from '../page/Category'
import ParentCat from '../page/ParentCat'
import VerticleReels from '../components/verticleVideo/VerticleReels'

const Routing = () => {
    return (
        <HashRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about_us" element={<AboutUs />} />
                <Route path="/video_player/:id" element={<VideoPlayBack />} />
                <Route path="/drone_video" element={<DroneVideos />} />
                <Route path="/iphone_video" element={<IphoneVideo />} />
                <Route path="/editorial" element={<Editorial />} />
                <Route path="/youtube_series" element={<YoutubeSeries />} />
                <Route path="/founder" element={<Founder />} />
                <Route path="/categorys/:cat_name" element={<ParentCat />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/category/:cat_name"  element={<Category />} />
                <Route path="/reels/:id" element={<VerticleReels />} />
                <Route path="/thanku" element={<ThankYouPage />} />
            </Routes>
            <Footer />
        </HashRouter>
    )
}

export default Routing