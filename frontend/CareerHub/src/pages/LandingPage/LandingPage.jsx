import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from "../LandingPage/components/Features";
import Analytics from "../LandingPage/components/Analytics";
import Footer from "../LandingPage/components/Footer";

const LandingPage = () => {
  return (
    <div className='min-h-screen'>
      <Header/>
      <Hero />
      <Features />
      <Analytics />
      <Footer />
    </div>
  )
}

export default LandingPage
