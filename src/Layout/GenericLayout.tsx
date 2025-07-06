import { Outlet } from "react-router-dom"
import Header from "../Navbar/Header"


const GenericLayout = () => {
  return (
    <main className="flex flex-col min-h-screen">

      <Header />

      <section className="flex-grow overflow-x-auto">
        <Outlet />
      </section>



    </main>
  )
}

export default GenericLayout
