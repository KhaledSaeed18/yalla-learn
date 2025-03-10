"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Settings, ChevronDown, LayoutDashboard, LockKeyhole, FileCog, ChevronUp, User2 } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarFooter, useSidebar } from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const { open } = useSidebar()

  const isSettingsActive = pathname.startsWith("/dashboard/settings")

  React.useEffect(() => {
    if (isSettingsActive) {
      setIsSettingsOpen(true)
    }
  }, [isSettingsActive])

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
              <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <SidebarMenuItem>
                  <MenuItemWrapper
                    label="Settings"
                  >
                    <SidebarMenuButton
                      onClick={() => open && setIsSettingsOpen(!isSettingsOpen)}
                      className={`${isSettingsActive ? "text-primary" : ""} w-full justify-between cursor-pointer`}
                      aria-label="Toggle Settings"
                    >
                      <div className="flex items-center">
                        <Settings className="size-5 mr-2" />
                        {open && <span>Settings</span>}
                      </div>
                      {open && (
                        <ChevronDown className={`size-5 transition-transform ${isSettingsOpen ? "rotate-180" : ""}`} />
                      )}
                    </SidebarMenuButton>
                  </MenuItemWrapper>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link
                          aria-label="Go to General Settings"
                          href="/dashboard/settings/general"
                          className={pathname === "/dashboard/settings/general" ? "text-primary bg-gray-200 dark:bg-black/50" : ""}
                        >
                          <FileCog className="size-5 mr-2" />
                          General
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link
                          aria-label="Go to Security Settings"
                          href="/dashboard/settings/security"
                          className={pathname === "/dashboard/settings/security" ? "text-primary bg-gray-200 dark:bg-black/50" : ""}
                        >
                          <LockKeyhole className="size-5 mr-2" />
                          Security
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <Link href="/dashboard/account" aria-label="Go to Account Settings">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <span>Account</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="cursor-pointer">
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