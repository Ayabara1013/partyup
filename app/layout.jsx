import '../styles/globals.scss';
import { Inter } from 'next/font/google';


import Navbar from "@/components/Navbar";

import { Application } from "@/app/ApplicationContext";

import { ui } from "@/util/ui";
import { Toaster } from "react-hot-toast";
import { DaisyFooter } from '@/components/footer/Footer';

const inter = Inter({ subsets: [ 'latin' ], });

export const metadata = {
  title: 'Create Next App', description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="night" >
      <body className={`${inter.className} flex grow flex-col min-h-screen h-screen overflow-hidden`}>
        <Navbar />
        {/* {children} */}
        <div className="app-wrapper overflow-y-scroll">
          {children}
          <DaisyFooter />
        </div>


      </body>
    </html>
  )
}

// function Footer() {
//   return (<div className='toast'>
//     <div className="alert alert-success alert-info alert-error alert-warning hidden" id={ui.mainLayout.alert.id}>
//       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
//           className="stroke-current shrink-0 w-6 h-6">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
//               d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//       </svg>
//       <span id={ui.mainLayout.alertMessage.id}/>
//     </div>
//   </div>)
// }