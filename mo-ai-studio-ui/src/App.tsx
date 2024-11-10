import React, { createContext, useState, useEffect } from "react"
import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { NextUIProvider } from "@nextui-org/react"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import IndexPage from "./pages/IndexPage"
import MoNavBar from "./components/MoNavBar"
import Footer from "./components/Footer"
import PricePage from "./pages/PricePage"
import DevelopPage from "@/pages/DevelopPage"
import ProjectsPage from "@/pages/ProjectsPage"
import { getCurrentAccountInfo } from "@/service/api"
import { UserContext } from "./context/UserContext"
import ExpensesPage from "./pages/ExpensesPage"
import SettingPage from "./pages/SettingPage"
import TenantsPage from "./pages/TenantsPage"
import AccountsPage from "./pages/AccountsPage"
import AppDevPage from "./pages/AppDevPage"
import RolesPage from "./pages/RolePage"
import MoPage from "./pages/mo/MoPage"
import MoaisPage from "./pages/MoaisPage"
import LoadingPage from "./pages/LoadingPage"
import { useTranslation } from "react-i18next"

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [userInfo, setUserInfo] = useState(null)
  const { i18n } = useTranslation()

  useEffect(() => {
    const shouldFetchUserInfo = location.pathname.startsWith("/develop") || location.pathname.startsWith("/app-dev")

    if (shouldFetchUserInfo) {
      const fetchUserInfo = async () => {
        const info = await getCurrentAccountInfo(navigate)
        setUserInfo(info)
      }
      fetchUserInfo()
    }
  }, [location])

  return (
    <NextUIProvider navigate={navigate}>
      <UserContext.Provider value={userInfo}>
        <div className='min-h-screen bg-gradient-to-br from-black via-slate-700 to-slate-900'>
          <Routes>
            <Route
              path='/'
              element={
                <>
                  <MoNavBar />
                  <IndexPage />
                  <Footer />
                </>
              }
            />
            <Route path='/loading' element={<LoadingPage />} />
            <Route path='/mo' element={<MoPage />} />
            <Route
              path='/login'
              element={
                <>
                  <MoNavBar />
                  <LoginPage />
                  <Footer />
                </>
              }
            />
            <Route
              path='/register'
              element={
                <>
                  <MoNavBar />
                  <RegisterPage />
                  <Footer />
                </>
              }
            />
            <Route
              path='/price'
              element={
                <>
                  <MoNavBar />
                  <PricePage />
                  <Footer />
                </>
              }
            />
            <Route path='/develop' element={<DevelopPage />}>
              <Route index element={<Navigate to='/develop/projects' replace />} />
              <Route path='projects' element={<ProjectsPage />} />
              <Route path='expenses' element={<ExpensesPage />} />
              <Route path='settings' element={<SettingPage />} />
              <Route path='tenants' element={<TenantsPage />} />
              <Route path='accounts' element={<AccountsPage />} />
              <Route path='roles' element={<RolesPage />} />
            </Route>
            <Route
              path='/app-dev/:appId'
              element={
                <>
                  <AppDevPage></AppDevPage>
                </>
              }
            />
            <Route path='/moais' element={<MoaisPage />} />
          </Routes>
        </div>
      </UserContext.Provider>
    </NextUIProvider>
  )
}

export default App
