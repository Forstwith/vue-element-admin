/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'clients',
  meta: {
    title: 'Table',
    icon: 'table'
  },
  children: [
    // {
    //   path: 'dynamic-table',
    //   component: () => import('@/views/table/dynamic-table/index'),
    //   name: 'DynamicTable',
    //   meta: { title: 'Dynamic Table' }
    // },
    // {
    //   path: 'drag-table',
    //   component: () => import('@/views/table/drag-table'),
    //   name: 'DragTable',
    //   meta: { title: 'Drag Table' }
    // },
    {
      path: 'agents-table',
      component: () => import('@/views/table/agents-table'),
      name: 'Agents',
      meta: { title: 'Agents' }
    },
    {
      path: 'client-table',
      component: () => import('@/views/table/client-table'),
      name: 'Clients',
      meta: { title: 'Clients' }
    }
  ]
}
export default tableRouter
