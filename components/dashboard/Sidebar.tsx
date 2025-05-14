"use client"

import type React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, LayoutDashboard, ChevronUp, User2, LogOut } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarFooter, useSidebar } from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { logout } from "@/lib/auth/logout"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { useUserRole } from "@/hooks/useUserRole"
import { sidebarRoutes, type SidebarRoute } from "@/config/sidebarRoutes"

const MotionSidebarMenuButton = motion.create(SidebarMenuButton)
const MotionSidebarMenuSubButton = motion.create(SidebarMenuSubButton)

export function DashboardSidebar() {
  const pathname = usePathname()
  const { open } = useSidebar()
  const { user } = useSelector((state: RootState) => state.auth)
  const firstName = user?.firstName || ""
  const [clickedItem, setClickedItem] = useState<string | null>(null)
  const { isAdmin } = useUserRole()
  const userRole = isAdmin ? "ADMIN" : "USER"
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  const handleLogout = useCallback(async (e: React.MouseEvent) => {
    try {
      e.preventDefault()
      await logout()
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    }
  }, []);

  const displayName = user ? `${user.firstName} ${user.lastName}` : ""

  useEffect(() => {
    const newOpenMenus: Record<string, boolean> = {}

    sidebarRoutes.forEach(route => {
      if (route.children && route.children.some(child => child.activeWhen(pathname))) {
        newOpenMenus[route.id] = true
      }
    })

    setOpenMenus(prev => ({ ...prev, ...newOpenMenus }))
  }, [pathname])

  const hoverAnimation = {
    scale: 1.02,
    transition: { duration: 0.2 },
  }

  const tapAnimation = {
    scale: 0.98,
    transition: { duration: 0.1 },
  }

  const MenuItemWrapper = useMemo(() => {
    return ({ children, label }: { children: React.ReactNode; label: string }) => {
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
  }, [open]);

  const filteredRoutes = useMemo(() => {
    return sidebarRoutes.filter(route => route.roles.includes(userRole))
  }, [userRole])

  const renderMenuItem = useCallback((route: SidebarRoute, isSubItem = false) => {
    const isActive = route.activeWhen(pathname)
    const hasChildren = route.children && route.children.length > 0
    const filteredChildren = route.children?.filter(child => child.roles.includes(userRole))
    const hasFilteredChildren = filteredChildren && filteredChildren.length > 0

    if (hasChildren && !hasFilteredChildren) return null

    const toggleMenu = (e: React.MouseEvent, id: string) => {
      if (
        e.currentTarget === e.target ||
        (e.target instanceof Element &&
          e.currentTarget.contains(e.target) &&
          !e.currentTarget.querySelector("a")?.contains(e.target))
      ) {
        setClickedItem(id)
        open && setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }))
      }
    }

    const IconComponent = route.icon

    if (hasFilteredChildren) {
      return (
        <SidebarMenuItem key={route.id}>
          <MenuItemWrapper label={route.label}>
            <MotionSidebarMenuButton
              onClick={(e) => toggleMenu(e, route.id)}
              className={`${isActive ? "text-primary" : ""} w-full justify-between cursor-pointer`}
              aria-label={`Toggle ${route.label}`}
              whileHover={hoverAnimation}
              whileTap={tapAnimation}
              animate={clickedItem === route.id ? { scale: 0.98 } : { scale: 1 }}
              onAnimationComplete={() => setClickedItem(null)}
            >
              <div className="flex items-center">
                <IconComponent className="size-5 mr-2" />
                {open && <span>{route.label}</span>}
              </div>
              {open && (
                <motion.div
                  initial={false}
                  animate={{ rotate: openMenus[route.id] ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  key={`chevron-${route.id}`}
                >
                  <ChevronDown className="size-5" />
                </motion.div>
              )}
            </MotionSidebarMenuButton>
          </MenuItemWrapper>
          <Collapsible open={!!openMenus[route.id]} onOpenChange={(isOpen) =>
            setOpenMenus(prev => ({ ...prev, [route.id]: isOpen }))
          }>
            <CollapsibleContent>
              <SidebarMenuSub>
                {filteredChildren?.map(child => renderMenuItem(child, true))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>
      )
    }

    if (isSubItem) {
      return (
        <SidebarMenuSubItem key={route.id}>
          <MotionSidebarMenuSubButton
            asChild
            whileHover={hoverAnimation}
            whileTap={tapAnimation}
            animate={clickedItem === route.id ? { scale: 0.98 } : { scale: 1 }}
            onClick={() => setClickedItem(route.id)}
            onAnimationComplete={() => setClickedItem(null)}
          >
            <Link
              aria-label={route.label}
              href={route.href || "#"}
              className={isActive ? "text-primary bg-gray-200 dark:bg-black/50" : ""}
            >
              <IconComponent className="size-5 mr-2" />
              {route.label}
            </Link>
          </MotionSidebarMenuSubButton>
        </SidebarMenuSubItem>
      )
    }

    return (
      <SidebarMenuItem key={route.id}>
        <MenuItemWrapper label={route.label}>
          <MotionSidebarMenuButton
            asChild
            whileHover={hoverAnimation}
            whileTap={tapAnimation}
            animate={clickedItem === route.id ? { scale: 0.98 } : { scale: 1 }}
            onClick={() => setClickedItem(route.id)}
            onAnimationComplete={() => setClickedItem(null)}
          >
            <Link
              aria-label={route.label}
              href={route.href || "#"}
              className={`flex items-center ${isActive ? "text-primary bg-gray-200 dark:bg-black/50" : ""}`}
            >
              <IconComponent className="size-5 mr-2" />
              {open && <span>{route.label}</span>}
            </Link>
          </MotionSidebarMenuButton>
        </MenuItemWrapper>
      </SidebarMenuItem>
    )
  }, [open, pathname, clickedItem, userRole, openMenus, MenuItemWrapper, hoverAnimation, tapAnimation])

  const userMenu = useMemo(() => (
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center w-full"
              >
                <User2 className="mr-2 size-4" />
                <span>Account</span>
              </motion.div>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleLogout}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center w-full"
            >
              <LogOut className="mr-2 size-4" />
              <span>Sign out</span>
            </motion.div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  ), [displayName, handleLogout]);

  const sidebarHeader = useMemo(() => (
    <SidebarHeader className="border-b h-12 px-4 justify-center items-center">
      {open ? (
        <Link href="/" aria-label="Go to Home Page">
          <motion.span
            className="text-xl text-center font-bold truncate"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            {
              firstName ? (
                <>Hello, {firstName}! 👋</>
              ) : (
                <LayoutDashboard className="size-5" aria-hidden="true" />
              )
            }
          </motion.span>
        </Link>
      ) : (
        <Link href="/" aria-label="Go to Home Page">
          <motion.div whileHover={{ rotate: 5, scale: 1.1 }} transition={{ duration: 0.2 }}>
            <LayoutDashboard className="size-5" aria-hidden="true" />
          </motion.div>
        </Link>
      )}
    </SidebarHeader>
  ), [open]);

  if (!user) {
    return null
  }

  return (
    <Sidebar collapsible="icon">
      {/* Sidebar Header */}
      {sidebarHeader}

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredRoutes.map(route => renderMenuItem(route))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t">
        <SidebarMenu>
          {userMenu}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}