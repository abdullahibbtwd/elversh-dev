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
      <LazyComponent>
        <ServicesSection />
      </LazyComponent>
      <LazyComponent>
        <SkillsSection />
      </LazyComponent>
      <LazyComponent>
        <ProjectsSection />
      </LazyComponent>
      <LazyComponent>
        <ExperienceSection />
      </LazyComponent>
      <LazyComponent>
        <EducationSection />
      </LazyComponent>
      <LazyComponent>
        <Contact />
      </LazyComponent>
      <Footer/>
    </div>
  )
}

export default Home
