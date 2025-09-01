// import {useEffect, useState} from "react";
// import {useNavigate, useParams, useSearchParams} from "react-router-dom";
// import {useAppContext} from "@/context/AppContext.jsx";
// import {handleOauthCallback} from "@/utils/oauthUtils.js";
//
// const OauthCallback = () => {
//     const navigate = useNavigate();
//     const {provider} = useParams()
//     const [searchParams] = useSearchParams();
//     const {oauthLogin} = useAppContext();
//     const [, setIsProcessing] = useState(true);
//     const [error, setError] = useState(null);
//
//     // Function to get the dashboard route based on the user role
//     const getDashboardRoute = (role) => {
//         switch (role) {
//             case 'innovator':
//                 return '/dashboard/innovator';
//             case 'problem-solver':
//             case 'problemsolver':
//             case 'ps':
//                 return '/dashboard/ps';
//             case 'advisor':
//                 return '/dashboard/advisor'
//             case 'client':
//                 return '/dashboard/client';
//             default:
//                 console.warn("Unknown user role:", role);
//                 return '/'
//         }
//     }
//
//     useEffect(() => {
//         const processOauthCallback = async () => {
//             try {
//                 setIsProcessing(true);
//                 setError(null);
//
//                 // Handle Auth callback and get the authorization code
//                 const {code} = handleOauthCallback(searchParams);
//
//                 // Send the code to the backend for token exchange
//                 const result = await oauthLogin(provider, code);
//
//                 if (result.success && result.user) {
//                     const userRole = result.user.role;
//
//                     if (userRole) {
//                         const dashboardRoute = getDashboardRoute(userRole);
//                         console.log("Oauth login successful, redirecting to:", dashboardRoute);
//                         navigate(dashboardRoute, {replace: true});
//                     }else {
//                         console.log("No role found, redirecting to role selection")
//                         navigate('/role-selection', {
//                             state: {userData: result.user},
//                             replace: true,
//                         })
//                     }
//                 } else {
//                     setError(result.message || "Authentication failed. Please try again.")
//                 }
//             } catch (err) {
//                 console.error('Oauth callback error:', err);
//                 setError(err.message || "Authentication failed. Please try again.")
//             } finally {
//                 setIsProcessing(false);
//             }
//         }
//
//         processOauthCallback();
//     }, [provider, searchParams, oauthLogin, navigate])
//
//     // if error state
//     if (error) {
//         return (
//             <div className={'min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4'}>
//                 <div className={'bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center'}>
//                     <div className={'text-red-500 text-6xl mb-4'}>
//                         ❌
//                     </div>
//                     <h2 className={'text-2xl font-bold text-gray-800 mb-4'}>Authentication Failed</h2>
//                     <p className={'text-gray-600 mb-6'}>{error}</p>
//                     <button
//                         onClick={() => navigate('/login')}
//                         className={'w-full bg-[#00674f] text-white py-3 px-6 rounded-lg hover:bg-[#005a43] transition-colors'}
//                     >
//                         Back to Login
//                     </button>
//                 </div>
//             </div>
//         )
//     }
//
//     // Show loading state
//     return (
//         <div className={'min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4'}>
//             <div className={'bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center'}>
//                 <div className={'animate-spin rounded-full h-16 w-16 border-b-2 border-[#00674f] mx-auto mb-6'}></div>
//                 <h2 className={'text-2xl font-bold text-gray-800 mb-4'}>
//                     Authentication {provider === 'google' ? 'Google' : "Github"}...
//                 </h2>
//                 <p className={'text-gray-600'}>
//                     Please wait while we complete your authentication.
//                 </p>
//             </div>
//         </div>
//     )
// }
//
// export default OauthCallback;