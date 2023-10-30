import { Footer, Header } from "antd/es/layout/layout"
import { Fragment } from "react"
import { Outlet } from "react-router-dom"

const FrontLayout = () => {
  return (
    <Fragment>
      <Header />
      <Outlet />
      <Footer />
    </Fragment>
  )
}

export default FrontLayout
