import React from "react";
import Projects from "@/components/pages/Projects";
import ProjectTimeline from "@/components/pages/ProjectTimeline";
import Settings from "@/components/pages/Settings";
import Calendar from "@/components/pages/Calendar";
import Inbox from "@/components/pages/Inbox";
import Rules from "@/components/pages/Rules";

export const routes = {
  inbox: {
    id: 'inbox',
    label: 'Inbox',
    path: '/',
    icon: 'Inbox',
    component: Inbox
  },
  projects: {
    id: 'projects',
    label: 'Projects',
path: '/projects',
    icon: 'FolderOpen',
    component: Projects
  },
  projectTimeline: {
    id: 'projectTimeline',
    label: 'Timeline',
    path: '/projects/timeline/:projectId?',
    icon: 'Timeline',
    component: ProjectTimeline,
    hidden: true
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: Calendar
  },
  rules: {
    id: 'rules',
    label: 'Rules',
    path: '/rules',
    icon: 'Settings2',
    component: Rules
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);
export default routes;