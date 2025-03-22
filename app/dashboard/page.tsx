'use client'

import RoleBasedRoute from '@/components/RoleBasedRoute'
import { useUserRole } from '@/hooks/useUserRole'
import { blogCategoryServices } from '@/services/blog/blogCategories.services'
import { useState } from 'react'

export default function DashboardPage() {
    const { isAdmin } = useUserRole()
    const [loading, setLoading] = useState(false)

    const handleGetCategories = async () => {
        try {
            setLoading(true)
            const response = await blogCategoryServices.getCategories()
            console.log('Blog categories:', response)
        } catch (error) {
            console.error('Error fetching blog categories:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <RoleBasedRoute allowedRoles={["USER", "ADMIN"]}>
            {isAdmin ?
                <>
                    <div className="">
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="text-gray-500">Welcome to the admin dashboard</p>
                        {/* test api call*/}
                        <button 
                            onClick={handleGetCategories}
                            disabled={loading}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {loading ? 'Loading...' : 'Get Blog Categories'}
                        </button>
                    </div>
                </> : <>
                    <div className="">
                        <h1 className="text-2xl font-bold">User Dashboard</h1>
                        <p className="text-gray-500">Welcome to the user dashboard</p>
                    </div>
                </>}
        </RoleBasedRoute>
    )
}