import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const AddRestaurant = React.lazy(() => import('./views/restaurants/index'))
const ImageUploader = React.lazy(() => import('./views/restaurants/ImageUploader'))
const ImageModerator = React.lazy(() => import('./views/restaurants/ImageModerator'))
const ViewRestaurants = React.lazy(() => import('./views/restaurants/viewRestaurants'))
const RestaurantApproval = React.lazy(() => import('./views/restaurants/restaurantApproval'))
const UserReservations = React.lazy(() => import('./views/restaurants/UserReservations'))
const Chat = React.lazy(() => import('./views/chat/Chat'))

const routes = [
  { path: '/', exact: true, name: 'Home', roles: ['admin', 'user', 'restaurantOwner', 'waiter'] },
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: Dashboard,
    roles: ['admin', 'user', 'restaurantOwner', 'waiter'],
  },
  {
    path: '/dashboard/add-restaurant',
    name: 'Add Restaurant',
    element: AddRestaurant,
    roles: ['restaurantOwner'],
  },
  {
    path: '/dashboard/view-restaurant',
    name: 'View Restaurant',
    element: ViewRestaurants,
    roles: ['restaurantOwner'],
  },
  { path: '/dashboard/chat', name: 'Chat', element: Chat, roles: ['restaurantOwner', 'waiter'] },
  {
    path: '/dashboard/restaurant-approval',
    name: 'Restaurant Approval',
    element: RestaurantApproval,
    roles: ['admin'],
  },
  {
    path: '/dashboard/upload-images',
    name: 'Upload Images',
    element: ImageUploader,
    roles: ['restaurantOwner'],
  },
  {
    path: '/dashboard/moderate-images',
    name: 'Moderate Images',
    element: ImageModerator,
    roles: ['admin'],
  },
  {
    path: '/dashboard/user-reservations',
    name: 'User Reservations',
    element: UserReservations,
    roles: ['restaurantOwner'],
  },
]

export default routes
