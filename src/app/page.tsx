import AboutMeSection from '@/components/AboutMe'
import Contact from '@/components/Contact'
import EducationSection from '@/components/Education'
import ExperienceSection from '@/components/Exprience'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import ProjectsSection from '@/components/Project'
import ServicesSection from '@/components/Sevices'
import SkillsSection from '@/components/Skills'
import LazyComponent from '@/components/LazyComponent'
import React from 'react'

const Home = () => {
  return (
    <div className='overflow-x-hidden'>
      <Hero/>
      <AboutMeSection/>
      <LazyComponent component={ServicesSection} />
      <LazyComponent component={SkillsSection} />
      <LazyComponent component={ProjectsSection} />
      <LazyComponent component={ExperienceSection} />
      <LazyComponent component={EducationSection} />
      <LazyComponent component={Contact} />
      <Footer/>
    </div>
  )
}

export default Home
