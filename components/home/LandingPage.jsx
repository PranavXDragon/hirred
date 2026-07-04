import React, { useState, useEffect } from 'react'
import Hero from './Hero/Hero'
import About from '@/components/about/About'
import Services from '@/components/services/Services'
import Industries from '@/components/industries/Industries'
import Insights from '@/components/insights/Insights'
import Careers from '@/components/careers/Careers'
import Contact from '@/components/contact/Contact'

function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  // Extract initial search parameters from URL if present (e.g. from redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const titleParam = params.get('title') || '';
    const locParam = params.get('location') || '';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (titleParam) setSearchQuery(titleParam);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (locParam) setSearchLocation(locParam);
  }, []);

  return (
    <>
      <Hero />
      <Careers 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        searchLocation={searchLocation} 
        setSearchLocation={setSearchLocation} 
      />
      <About/>
      <Services/>
      <Industries/>
      <Insights/>
      <Contact/>
    </>
  )
}

export default LandingPage
