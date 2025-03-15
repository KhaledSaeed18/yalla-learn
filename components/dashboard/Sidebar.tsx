"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ChevronDown, LayoutDashboard, ChevronUp, User2, PenLine, FileText, LogOut } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarFooter, useSidebar } from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { logout } from "@/lib/auth/logout"
import { toast } from "sonner"

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isBlogOpen, setIsBlogOpen] = React.useState(false)
  const { open } = useSidebar()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleLogout = async (e: React.MouseEvent) => {
    try {
      e.preventDefault();
      await logout();
    } catch (error) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
  }

  if (!user) {
    return null
  }

  const displayName = `${user.firstName} ${user.lastName}`

  const isBlogActive = pathname.startsWith("/dashboard/blog")

  React.useEffect(() => {
    if (isBlogActive) {
      setIsBlogOpen(true)
    }
  }, [isBlogActive])

  const MenuItemWrapper: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => {
    if (!open) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }
    return children
  }

  return (
    <Sidebar collapsible="icon">

      {/* Sidebar Header */}
      <SidebarHeader className="border-b h-12 px-4 justify-center items-center">
        {open ? (
          <Link href="/" aria-label="Go to Home Page">
            <span className="text-xl text-center font-bold truncate">My Dashboard</span>
          </Link>
        ) : (
          <Link href="/" aria-label="Go to Home Page">
            <LayoutDashboard className="size-5" aria-hidden="true" />
          </Link>
        )}
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <MenuItemWrapper label="Home">
                  <SidebarMenuButton asChild>
                    <Link
                      aria-label="Go to Dashboard Home"
                      href="/dashboard"
                      className={`flex items-center ${pathname === "/dashboard" ? "text-primary bg-gray-200 dark:bg-black/50" : ""}`}
                    >
                      <Home className="size-5 mr-2" />
                      {open && <span>Home</span>}
                    </Link>
                  </SidebarMenuButton>
                </MenuItemWrapper>
              </SidebarMenuItem>

              {/* Blog Section */}
              <Collapsible open={isBlogOpen} onOpenChange={setIsBlogOpen}>
                <SidebarMenuItem>
                  <MenuItemWrapper
                    label="Blog"
                  >
                    <SidebarMenuButton
                      onClick={() => open && setIsBlogOpen(!isBlogOpen)}
                      className={`${isBlogActive ? "text-primary" : ""} w-full justify-between cursor-pointer`}
                      aria-label="Toggle Blog"
                    >
                      <div className="flex items-center">
                        <FileText className="size-5 mr-2" />
                        {open && <span>Blog</span>}
                      </div>
                      {open && (
                        <ChevronDown className={`size-5 transition-transform ${isBlogOpen ? "rotate-180" : ""}`} />
                      )}
                    </SidebarMenuButton>
                  </MenuItemWrapper>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link
                          aria-label="Create New Blog Post"
                          href="/dashboard/blog/editor"
                          className={pathname.startsWith("/dashboard/blog/editor") ? "text-primary bg-gray-200 dark:bg-black/50" : ""}
                        >
                          <PenLine className="size-5 mr-2" />
                          Create New
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link
                          aria-label="View All Blog Posts"
                          href="/dashboard/blog"
                          className={pathname === "/dashboard/blog" ? "text-primary bg-gray-200 dark:bg-black/50" : ""}
                        >
                          <FileText className="size-5 mr-2" />
                          View All
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                  <User2 /> {displayName}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <Link href="/dashboard/account" aria-label="Go to Account Settings">
                  <DropdownMenuItem className="cursor-pointer">
                    <User2 className="mr-2 size-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 size-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}