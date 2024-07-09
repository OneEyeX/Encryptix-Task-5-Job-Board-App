import { useSelector } from "react-redux";
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

// // 

// function Layout() {
//   const { user } = useSelector((state) => state.user);
//   const location = useLocation();

//   return user?.token ? (
//     <Outlet />
//   ) : (
//     <Navigate to='/user-auth' state={{ from: location }} replace />
//   );
// }
// // 
// function App() { 
//   // update here
//   const user={};
//   return (
//     <main>
//       <Navbar/>
//       <Routes>
//         {/* If user is authneticated */}
//         <Route element={<Layout/>}>

//           <Route 
//             path="/" 
//             element={
//               <Navigate to='/find-jobs' replace={true}/>
//               }
//           />
//           <Route path='/find-jobs' element={<FindJobs/>} />
//           <Route path='/companies' element={<Companies/>} />
//           <Route
//             path={
//               user?.accountType === "seeker"
//                 ? "/user-profile"
//                 : "/user-profile/:id"
//             }
//             element={<UserProfile/>}
//           />

//           <Route  path={"/company-profile"} element={<CompanyProfile/>} />
//           <Route path={"/company-profile/:id"} element={<CompanyProfile/>} />
//           <Route path={"/upload-job"} element={<UploadJob/>} />
//           <Route path={"/job-detail/:id"} element={<JobDetail/>} />

//         </Route>
//         {/* if user is not auth */}
//         <Route path={"/about-us"} element={<About/>} />
//         <Route path={"/user-auth"} element={<AuthPage/>} />
//       </Routes>
//       {/* dispaly footer only if user is auth */}
//       {user && <Footer/>}
//     </main>
//   );
// }

// export default App

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to='/user-auth' state={{ from: location }} replace />
  );
}

function App() {
  const { user } = useSelector((state) => state.user);

  return (
    <main>
      <Navbar />
      <Routes>
        {/* If user is authenticated */}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<Navigate to='/find-jobs' replace={true} />}
          />
          <Route path='/find-jobs' element={<FindJobs />} />
          <Route path='/companies' element={<Companies />} />
          <Route
            path={
              user?.accountType === "seeker"
                ? "/user-profile"
                : "/user-profile/:id"
            }
            element={<UserProfile />}
          />
          <Route path='/company-profile' element={<CompanyProfile />} />
          <Route path='/company-profile/:id' element={<CompanyProfile />} />
          <Route path='/upload-job' element={<UploadJob />} />
          <Route path='/job-detail/:id' element={<JobDetail />} />
        </Route>
        {/* If user is not authenticated */}
        <Route path='/about-us' element={<About />} />
        <Route path='/user-auth' element={<AuthPage />} />
      </Routes>
      {/* Display footer only if user is authenticated */}
      {user?.token && <Footer />}
    </main>
  );
}

export default App;
