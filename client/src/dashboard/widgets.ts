// src/dashboard/widgets.ts
import UserPanel from './widgets/UserPanel';
import ContentEditor from './widgets/ContentEditor';
import Reports from './widgets/Reports';

export const widgetConfig = [
  { capability: 'manage_users', component: UserPanel },
  { capability: 'edit_content', component: ContentEditor },
  { capability: 'view_reports', component: Reports },
];
