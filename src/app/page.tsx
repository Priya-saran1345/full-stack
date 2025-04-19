// 'use client'
// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import { PackageTable } from './components/package-table'
// import { motion, AnimatePresence } from 'framer-motion'
// interface PackageItem {
//   id: number
//   title: string
//   country: string
//   traffic_type: string
//   ip_type: string
//   package_items: { price: number }[]
// }
// export default function PricingPage() {
//   const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null)
//   const [data, setData] = useState<PackageItem[]>([])
//   const [email, setEmail] = useState('')
//   const [emailError, setEmailError] = useState('')
//   const [showThankYou, setShowThankYou] = useState(false)
//   // Fetch data from the API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('https://vefogix.com/api/traffic-packages/')
//         setData(response.data)
//       } catch (err) {
//         console.error('Error fetching data:', err)
//       }
//     }
//     fetchData()
//   }, [])
//   // Handle order button click
//   const handleOrderClick = (tier: PackageItem) => {
//     setSelectedPackage(tier)
//     setEmail('')
//     setEmailError('')
//     setShowThankYou(false)
//   }
//   // Close the modal
//   const handleCloseModal = () => {
//     setSelectedPackage(null)
//     setShowThankYou(false)
//   }
//   // Handle form submission
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!email || !/\S+@\S+\.\S+/.test(email)) {
//       setEmailError('Please enter a valid email address')
//       return
//     }
//     console.log({
//       email,
//       package_id: selectedPackage?.id,
//       country: selectedPackage?.country,
//       traffic_type: selectedPackage?.traffic_type,
//       ip_type: selectedPackage?.ip_type,
//       title: selectedPackage?.title,
//     })
//     setShowThankYou(true)
//     // Close the modal after 2 seconds
//     setTimeout(() => {
//       setSelectedPackage(null)
//       setShowThankYou(false)
//     }, 2000)
//   }
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="xl:w-[75%] w-full relative mx-auto px-4 py-16">
//         <div className="text-center mb-16">
//           <h1 className="text-[40px] font-bold mb-4">Choose Your Traffic Package</h1>
//           <p className="text-xl text-gray-600">Select the perfect traffic solution for your needs</p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
//           {data?.map((tier, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{
//                 duration: 0.9,
//                 delay: index * 0.2,
//                 ease: [0.25, 1, 0.5, 1], // Smooth easing curve
//               }}
//               className="border rounded-lg p-6 bg-white shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-2 duration-300"
//             >
//               <div className="text-center mb-4">
//                 <h2 className="text-[24px] font-bold">{tier?.title}</h2>
//                 <div className="mt-2 text-primary text-3xl font-bold">
//                   ₹{tier?.package_items[0]?.price}
//                 </div>
//               </div>
//               <div className="space-y-2 mb-6">
//                 <div className="flex items-center">
//                   <span className="mr-2">✔</span>
//                   <span className="text-black font-medium mr-2">Traffic Type:</span>
//                   <span className='capitalize'>{tier?.traffic_type}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="mr-2">✔</span>
//                   <span className="text-black font-medium mr-2">IP Type:</span>
//                   <span className='capitalize'>{tier?.ip_type}</span>
//                 </div>
//                 <div>
//                   <div className="text-primary font-bold cursor-pointer">Details:</div>
//                   <PackageTable data={tier.package_items} country={tier.country} />
//                 </div>
//               </div>
//               <div className="w-full flex justify-center">
//                 <button
//                   className="py-3 px-6 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
//                   onClick={() => handleOrderClick(tier)}
//                 >
//                   Order now
//                 </button>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//       {/* Full-Screen Modal for Email Form */}
//       <AnimatePresence>
//         {selectedPackage && (
//           <motion.div
//             className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             {!showThankYou && (
//               <motion.div
//                 className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
//                 initial={{ scale: 0.8 }}
//                 animate={{ scale: 1 }}
//                 exit={{ scale: 0.8 }}
//                 transition={{ duration: 0.3, ease: 'easeOut' }}
//               >
//                 <h2 className="text-2xl font-bold mb-4">Enter Your Email</h2>
//                 <form onSubmit={handleSubmit}>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="w-full p-3 border rounded-lg"
//                       placeholder="Enter your email"
//                     />
//                     {emailError && <p className="text-red-500 mt-2">{emailError}</p>}
//                   </div>
//                   <div className="flex justify-end gap-4">
//                     <button
//                       type="button"
//                       onClick={handleCloseModal}
//                       className="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </form>
//               </motion.div>
//             )}
//             {showThankYou && (
//               <motion.div
//                 className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center"
//                 initial={{ scale: 0.8 }}
//                 animate={{ scale: 1 }}
//                 exit={{ scale: 0.8 }}
//                 transition={{ duration: 0.3, ease: 'easeOut' }}
//               >
//                 <h2 className="text-2xl font-bold mb-4">Thank You for Connecting with Us!</h2>
//                 <p className="text-gray-700">We will get back to you soon.</p>
//               </motion.div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
interface Post {
  _id: string
  name: string
  weight: number
  weather?: string
  price?: number
  color?: string
  createdAt: string
}
const AllPosts = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post', { cache: 'no-store' }) // no-store to ensure fresh data
        if (!res.ok) throw new Error('Failed to fetch posts')
        const data = await res.json()
        // Sort by createdAt (latest first)
        const sorted = data.sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setPosts(sorted)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])
  if (loading) return <p className="text-center mt-8">Loading posts...</p>
  if (error) return <p className="text-red-500 text-center">{error}</p>
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">All Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post._id} className="border rounded-lg p-4 shadow-sm bg-white">
            <h3 className="text-lg font-semibold">{post.name}</h3>
            <p><strong>Weight:</strong> {post.weight}</p>
            {post.weather && <p><strong>Weather:</strong> {post.weather}</p>}
            {post.price && <p><strong>Price:</strong> ₹{post.price}</p>}
            {post.color && <p><strong>Color:</strong> {post.color}</p>}
            <p className="text-xs text-gray-400 mt-2">
              Posted on: {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
export default AllPosts
