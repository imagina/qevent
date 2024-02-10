export default {
  events: {
    permission: 'ievent.events.manage',
    activated: true,
    authenticated: true,
    path: '/event/events',
    name: 'qevent.admin.events',
    page: () => import('modules/qevent/_pages/admin/events/index'),
    layout: () => import('layouts/master.vue'),
    title: 'ievent.cms.sidebar.adminEvents',
    icon: 'fas fa-calendar-check',
    subHeader: {
      refresh: true,
    }
  },
  categories: {
    permission: 'ievent.categories.manage',
    activated: true,
    authenticated: true,
    path: '/event/categories',
    name: 'qevent.admin.categories',
    crud: import('modules/qevent/_crud/categories'),
    page: () => import('modules/qcrud/_pages/admin/crudPage.vue'),
    layout: () => import('layouts/master.vue'),
    title: 'ievent.cms.sidebar.adminCategories',
    icon: 'fas fa-calendar-week',
    subHeader: {
      refresh: true,
    }
  }
}
