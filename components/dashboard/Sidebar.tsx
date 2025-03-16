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
import type { RootState } from "@/redux/store"
import { logout } from "@/lib/auth/logout"
import { toast } from "sonner"
import { motion } from "framer-motion"

const MotionSidebarMenuButton = motion.create(SidebarMenuButton)
const MotionSidebarMenuSubButton = motion.create(SidebarMenuSubButton)
const MotionSidebarFooter = motion.create(SidebarFooter)

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isBlogOpen, setIsBlogOpen] = React.useState(false)
  const { open } = useSidebar()
  const { user } = useSelector((state: RootState) => state.auth)
  const [clickedItem, setClickedItem] = React.useState<string | null>(null)
  const [isBlogActive, setIsBlogActive] = React.useState(false)

  const handleLogout = async (e: React.MouseEvent) => {
    try {
      e.preventDefault()
      await logout()
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    }
  }

  const displayName = user ? `${user.firstName} ${user.lastName}` : ""

  React.useEffect(() => {
    if (user) {
      setIsBlogActive(pathname.startsWith("/dashboard/blog"))
    } else {
      setIsBlogActive(false)
    }
  }, [pathname, user])

  React.useEffect(() => {
    if (isBlogActive) {
      setIsBlogOpen(true)
    } else {
      setIsBlogOpen(false)
    }
  }, [isBlogActive])

  const hoverAnimation = {
    scale: 1.02,
    transition: { duration: 0.2 },
  }

  const tapAnimation = {
    scale: 0.98,
    transition: { duration: 0.1 },
  }

  const footerVariants = {
    expanded: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    collapsed: {
      opacity: open ? 1 : 0.8,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  }

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

  if (!user) {
    return null
  }

  return (
    <Sidebar collapsible="icon">
      {/* Sidebar Header */}
      <SidebarHeader className="border-b h-12 px-4 justify-center items-center">
        {open ? (
          <Link href="/" aria-label="Go to Home Page">
            <motion.span
              className="text-xl text-center font-bold truncate"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              My Dashboard
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

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <MenuItemWrapper label="Home">
                  <MotionSidebarMenuButton
                    asChild
                    whileHover={hoverAnimation}
                    whileTap={tapAnimation}
                    animate={clickedItem === "home" ? { scale: 0.98 } : { scale: 1 }}
                    onClick={() => setClickedItem("home")}
                    onAnimationComplete={() => setClickedItem(null)}
                  >
                    <Link
                      aria-label="Go to Dashboard Home"
                      href="/dashboard"
                      className={`flex items-center ${pathname === "/dashboard" ? "text-primary bg-gray-200 dark:bg-black/50" : ""}`}
                    >
                      <Home className="size-5 mr-2" />
                      {open && <span>Home</span>}
                    </Link>
                  </MotionSidebarMenuButton>
                </MenuItemWrapper>
              </SidebarMenuItem>

              {/* Blog Section */}
              <Collapsible open={isBlogOpen} onOpenChange={setIsBlogOpen}>
                <SidebarMenuItem>
                  <MenuItemWrapper label="Blog">
                    <MotionSidebarMenuButton
                      onClick={(e) => {
                        // Only toggle blog open state if clicking directly on this button
                        // not when the event bubbles up from child elements
                        if (
                          e.currentTarget === e.target ||
                          (e.target instanceof Element &&
                            e.currentTarget.contains(e.target) &&
                            !e.currentTarget.querySelector("a")?.contains(e.target))
                        ) {
                          setClickedItem("blog")
                          open && setIsBlogOpen(!isBlogOpen)
                        }
                      }}
                      className={`${isBlogActive ? "text-primary" : ""} w-full justify-between cursor-pointer`}
                      aria-label="Toggle Blog"
                      whileHover={hoverAnimation}
                      whileTap={tapAnimation}
                      animate={clickedItem === "blog" ? { scale: 0.98 } : { scale: 1 }}
                      onAnimationComplete={() => setClickedItem(null)}
                    >
                      <div className="flex items-center">
                        <FileText className="size-5 mr-2" />
                        {open && <span>Blog</span>}
                      </div>
                      {open && (
                        <motion.div
                          initial={false}
                          animate={{ rotate: isBlogOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          key="chevron-icon"
                        >
                          <ChevronDown className="size-5" />
                        </motion.div>
                      )}
                    </MotionSidebarMenuButton>
                  </MenuItemWrapper>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <MotionSidebarMenuSubButton
                        asChild
                        whileHover={hoverAnimation}
                        whileTap={tapAnimation}
                        animate={clickedItem === "create-blog" ? { scale: 0.98 } : { scale: 1 }}
                        onClick={() => setClickedItem("create-blog")}
                        onAnimationComplete={() => setClickedItem(null)}
                      >
                        <Link
                          aria-label="Create New Blog Post"
                          href="/dashboard/blog/editor"
                          className={
                            pathname.startsWith("/dashboard/blog/editor")
                              ? "text-primary bg-gray-200 dark:bg-black/50"
                              : ""
                          }
                        >
                          <PenLine className="size-5 mr-2" />
                          Create New
                        </Link>
                      </MotionSidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <MotionSidebarMenuSubButton
                        asChild
                        whileHover={hoverAnimation}
                        whileTap={tapAnimation}
                        animate={clickedItem === "view-blog" ? { scale: 0.98 } : { scale: 1 }}
                        onClick={() => setClickedItem("view-blog")}
                        onAnimationComplete={() => setClickedItem(null)}
                      >
                        <Link
                          aria-label="View All Blog Posts"
                          href="/dashboard/blog"
                          className={pathname === "/dashboard/blog" ? "text-primary bg-gray-200 dark:bg-black/50" : ""}
                        >
                          <FileText className="size-5 mr-2" />
                          View All
                        </Link>
                      </MotionSidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer with smooth animation */}
      <MotionSidebarFooter
        className="border-t"
        variants={footerVariants}
        animate={open ? "expanded" : "collapsed"}
        initial={false}
      >
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MotionSidebarMenuButton className="cursor-pointer" whileHover={hoverAnimation} whileTap={tapAnimation}>
                  <User2 /> {displayName}
                  <motion.div animate={{ rotate: open ? 0 : 180 }} transition={{ duration: 0.3 }}>
                    <ChevronUp className="ml-auto" />
                  </motion.div>
                </MotionSidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <Link href="/dashboard/account" aria-label="Go to Account Settings">
                  <DropdownMenuItem className="cursor-pointer">
                    <User2 className="mr-2 size-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 size-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </MotionSidebarFooter>
    </Sidebar>
  )
}

