'use client';

import RoleBasedRoute from '@/components/RoleBasedRoute';
import { useUserRole } from '@/hooks/useUserRole';

export default function DashboardPage() {
    const { isAdmin } = useUserRole();

    return (
        <RoleBasedRoute allowedRoles={["USER", "ADMIN"]}>
            {isAdmin ? (
                <div className="">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-gray-500">Welcome to the admin dashboard</p>
                </div>
            ) : (
                <div className="">
                    <h1 className="text-2xl font-bold">User Dashboard</h1>
                    <p className="text-gray-500">Welcome to the user dashboard</p>
                </div>
            )}
        </RoleBasedRoute>
    );
}