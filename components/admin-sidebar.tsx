"use client";

import { adminSidebarLinks } from "@/constants";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Activity, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";

const sidebarVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <Sidebar className="border-r-0 shadow-xl">
      {/* Header */}
      <SidebarHeader className="border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-800 px-5 py-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <span className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-900/40">
            <Activity className="h-5 w-5 text-white" />
            <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
          </span>
          <div>
            <p className="font-heading text-[15px] font-bold leading-tight text-white">
              Mercer Fitness
            </p>
            <p className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">
              Admin Panel
            </p>
          </div>
        </motion.div>
      </SidebarHeader>

      {/* Nav Links */}
      <SidebarContent className="bg-gradient-to-b from-slate-800 to-slate-900 px-3 py-4">
        <SidebarGroup>
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Navigation
          </p>
          <SidebarMenu>
            <motion.div
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-1"
            >
              {adminSidebarLinks.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <motion.div key={item.title} variants={itemVariants}>
                    <SidebarMenuItem>
                      <Link
                        href={item.href}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {/* Active indicator bar */}
                        {isActive && (
                          <motion.span
                            layoutId="activeIndicator"
                            className="absolute inset-0 rounded-xl bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/20"
                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                          />
                        )}

                        {/* Icon */}
                        <span
                          className={cn(
                            "relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                            isActive
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-white"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                        </span>

                        {/* Label */}
                        <span className="relative">{item.title}</span>

                        {/* Active dot */}
                        {isActive && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="relative ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400"
                          />
                        )}
                      </Link>
                    </SidebarMenuItem>
                  </motion.div>
                );
              })}
            </motion.div>
          </SidebarMenu>
        </SidebarGroup>

        {/* Divider */}
        <div className="mx-3 my-4 border-t border-white/[0.06]" />

        {/* Secondary Links */}
        <SidebarGroup>
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            System
          </p>
          <SidebarMenu>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-1"
            >
              {[{ title: "Settings", href: "/settings", icon: Settings }].map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-500 transition-all duration-200 group-hover:bg-white/10 group-hover:text-white">
                        <item.icon className="h-4 w-4" />
                      </span>
                      {item.title}
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </motion.div>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-white/[0.06] bg-slate-900 px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.35 }}
          className="flex items-center gap-3"
        >
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-700 text-xs font-bold text-white shadow-inner ring-1 ring-white/10">
            MF
          </span>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-white">Admin User</p>
            <p className="truncate text-xs text-slate-500">admin@mercer.fit</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-500 transition-all duration-200 hover:bg-white/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;