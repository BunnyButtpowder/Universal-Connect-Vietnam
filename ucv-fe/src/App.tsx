import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navbar } from './components/Navbar'
import { HeroBanner } from './components/HeroBanner'

function App() {

  return (
    <>
      <Navbar/>
      <HeroBanner/>
    </>
  )
}

export default App
