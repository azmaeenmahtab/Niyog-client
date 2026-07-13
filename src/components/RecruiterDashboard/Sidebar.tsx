'use client';
import { Bars, Bell, Envelope, Gear, House, Person, Plus, Persons, ShieldCheck, ListCheck } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import Link from "next/link";
import type { ComponentType } from "react";
import { useUserInfo } from "@/lib/contexts/userInfoContext";

interface NavItem {
  icon: ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

export function Sidebar() {
  const { user } = useUserInfo();
  const role = (user as { role?: string } | null)?.role;

  const applicantNavItems: NavItem[] = [
    { icon: House, label: "Home", href: "/dashboard/applicant" },
    { icon: Plus, label: "Search Jobs", href: "/jobs" },
    { icon: Bell, label: "My Applications", href: "/dashboard/applicant/applications" },
    { icon: Envelope, label: "Saved Jobs", href: "/dashboard/applicant/saved" },
    // { icon: Person, label: "Manage Resume/CV", href: "/dashboard/applicant/resume" },
    // { icon: Gear, label: "Interviews", href: "/dashboard/applicant/interviews" },
    { icon: Person, label: "Profile", href: "/dashboard/profile" },
    // { icon: Gear, label: "Settings", href: "/dashboard/settings" },
  ];

  const recruiterNavItems: NavItem[] = [
    { icon: House, label: "Home", href: "/dashboard/recruiter" },
    { icon: Plus, label: "Post Job", href: "/dashboard/recruiter/jobs/new" },
    { icon: Bell, label: "Manage Jobs", href: "/dashboard/recruiter/jobs" },
    { icon: Bell, label: "Manage Applications", href: "/dashboard/recruiter/applications" },
    { icon: Envelope, label: "Company Profile", href: "/dashboard/recruiter/company-profile" },
    { icon: Person, label: "Profile", href: "/dashboard/profile" },
    { icon: Gear, label: "Settings", href: "/dashboard/settings" },
  ];

  const adminNavItems: NavItem[] = [
    { icon: House, label: "Home", href: "/dashboard/admin" },
    { icon: Persons, label: "Manage Users", href: "/dashboard/admin/manage/users" },
    { icon: ListCheck, label: "Manage Jobs", href: "/dashboard/admin/manage/jobs" },
    { icon: ListCheck, label: "Manage Company", href: "/dashboard/admin/manage/company" },
    { icon: ShieldCheck, label: "Approvals", href: "/dashboard/admin/approvals" },
    { icon: Bell, label: "Reports", href: "/dashboard/admin/reports" },
    { icon: Person, label: "Profile", href: "/dashboard/profile" },
    { icon: Gear, label: "Settings", href: "/dashboard/settings" },
  ];

  const navItemsByRole: Record<string, NavItem[]> = {
    applicant: applicantNavItems,
    recruiter: recruiterNavItems,
    admin: adminNavItems,
  };

  const navItems = navItemsByRole[role ?? ""] ?? recruiterNavItems;

  const navcontent = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <Link key={item.label} href={item.href} className="w-full">
          <button
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white transition-colors hover:bg-default"
            type="button"
          >
            <item.icon className="size-5 text-muted" />
            {item.label}
          </button>
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <div className="hidden w-64 border-r border-white/20 px-4 py-4 lg:block h-full p-4">
        {navcontent}
      </div>

      <div className="lg:hidden p-4">
        <Drawer>
          <Button variant="secondary">
            <Bars />
            Menu
          </Button>
          <Drawer.Backdrop>
            <Drawer.Content placement="left">
              <Drawer.Dialog>
                <Drawer.CloseTrigger />
                <Drawer.Header>
                  <Drawer.Heading>Navigation</Drawer.Heading>
                </Drawer.Header>
                <Drawer.Body>
                  {navcontent}
                </Drawer.Body>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
      </div>
    </>
  );
}
