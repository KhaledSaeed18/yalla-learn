'use client';

import RoleBasedRoute from '@/components/RoleBasedRoute';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { useUserRole } from '@/hooks/useUserRole';

export default function DashboardPage() {
    const { isAdmin } = useUserRole();

    return (
        <RoleBasedRoute allowedRoles={["USER", "ADMIN"]}>
            {isAdmin ? <AdminDashboard /> : <UserDashboard />}
        </RoleBasedRoute>
    );
}