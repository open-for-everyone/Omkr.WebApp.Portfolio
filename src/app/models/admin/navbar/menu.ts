import { NavItem } from './nav-item';

export const menu: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'dashboard',
    route: 'dashboard'
  },
  {
    displayName: 'User',
    iconName: 'face',
    route: 'user',
    // children: [
    //   {
    //     displayName: 'Account Info',
    //     iconName: 'account_box',
    //     route: 'user/account-info'
    //   }
    // ]
  },
  {
    displayName: 'Organization',
    iconName: 'business',
    route: 'organization',
    // children: [
    //   {
    //     displayName: 'Account Info',
    //     iconName: 'account_box',
    //     route: '/admin/organization'
    //   }
    // ]
  },
  {
    displayName: 'Visitor',
    iconName: 'person_outline',
    route: 'visitor',
    // children: [
    //   {
    //     displayName: 'Account Info',
    //     iconName: 'account_box',
    //     route: '/admin/organization'
    //   }
    // ]
  },
  {
    displayName: 'Chat',
    iconName: 'chat',
    route: 'chat',
    // children: [
    //   {
    //     displayName: 'Account Info',
    //     iconName: 'account_box',
    //     route: '/admin/organization'
    //   }
    // ]
  },
  {
    displayName: 'Markdown Renderer',
    iconName: 'text_format',
    route: 'markdown-renderer'
  },
  {
    displayName: 'Files',
    iconName: 'cloud_upload',
    route: 'file'
  },
  {
    displayName: 'Topic',
    iconName: 'question_answer',
    route: 'topic'
  }
];
