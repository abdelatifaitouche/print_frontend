import { useState} from 'react'
import { Route , Routes } from 'react-router-dom'
import Layout from './Layout'
import Home from './Pages/Home'
import Commandes from './Pages/Commandes'
import CreateOrderPage from './Pages/CreateOrderPage'
function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route path='/' element={<Home/>}/>
        <Route path='/Commandes' element={<Commandes/>}/>
        <Route path='/Commandes/creer' element={<CreateOrderPage/>}/>
      </Route>
    </Routes>
  )
}

export default App
