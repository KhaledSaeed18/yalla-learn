import ResumeBuilder from "@/components/resume/resume-builder"
import RoleBasedRoute from "@/components/RoleBasedRoute"

export default function Home() {
    return (
        <RoleBasedRoute allowedRoles={["USER", "ADMIN"]}>
            <main>
                <h1 className="text-3xl font-bold text-center mb-4">ATS-Optimized Resume Builder</h1>
                <ResumeBuilder />
            </main>
        </RoleBasedRoute>
    )
}

