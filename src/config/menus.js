// Navigation data only. Page components and routes are registered separately.
export const menus = [
  {
    id: 'menu1', label: '메뉴1', path: '/menu1',
    children: [
      { id: 'menu1-sub1', label: '하위메뉴1', path: '/menu1/sub1' },
      { id: 'menu1-sub2', label: '하위메뉴2', path: '/menu1/sub2' },
    ],
  },
  { id: 'menu2', label: '메뉴2', path: '/menu2' },
  { id: 'menu3', label: '메뉴3', path: '/menu3' },
  { id: 'menu4', label: '메뉴4', path: '/menu4' },
]
