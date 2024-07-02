import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Footer, Navbar } from "./components";
import {
  About,
  AuthPage,
  Companies,
  CompanyProfile,
  FindJobs,
  JobDetail,
  UploadJob,
  UserProfile,
} from "./pages";

// 
function Layout() {
  const user=false;
  const location = useLocation();

  return user?    <Outlet/>:<Navigate to='user-auth' state={{from: location}} replace />;
  
}
// 
function App() { 
  // update here
  const user={};
  return (
    <main>
      <Navbar/>
      <Routes>
        {/* If user is authneticated */}
        <Route element={<Layout/>}>

          <Route 
            path="/" 
            element={
              <Navigate to='/find-jobs' replace={true}/>
              }
          />
          <Route path='/find-jobs' element={<FindJobs/>} />
          <Route path='/companies' element={<Companies/>} />
          <Route
            path={
              user?.user?.accountType === "seeker"
                ? "/user-profile"
                : "user-profile/:id"
            }
            element={<UserProfile/>}
          />

          <Route  path={"/company-profile"} element={<CompanyProfile/>} />
          <Route path={"/company-profile/:id"} element={<CompanyProfile/>} />
          <Route path={"/upload-job"} element={<UploadJob/>} />
          <Route path={"/job-detail/:id"} element={<JobDetail/>} />

        </Route>
        {/* if user is not auth */}
        <Route path={"/about-us"} element={<About/>} />
        <Route path={"/user-auth"} element={<AuthPage/>} />
      </Routes>
      {/* dispaly footer only if user is auth */}
      {user && <Footer/>}
    </main>
  );
}

export default App
