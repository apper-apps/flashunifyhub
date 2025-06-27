import Inbox from '@/components/pages/Inbox';
import Projects from '@/components/pages/Projects';
import Calendar from '@/components/pages/Calendar';
import Rules from '@/components/pages/Rules';
import Settings from '@/components/pages/Settings';

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