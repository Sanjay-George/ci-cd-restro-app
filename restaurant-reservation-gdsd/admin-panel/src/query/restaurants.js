import http from '../utils/http'

export function addRestaurant(data) {
  return http({
    url: '/restaurants',
    method: 'post',
    data,
  })
}

export function getMyRestaurants(limit = 20) {
  return http({
    url: `/restaurants/my-restaurants?limit=${limit}`,
    method: 'get',
  })
}

export function restaurantDetailsById(id) {
  return http({
    url: `/restaurants/${id}`,
    method: 'get',
  })
}

export function updateRestaurant(id, data) {
  return http({
    url: `/restaurants/update/${id}`,
    method: 'put',
    data,
  })
}

export function deleteRestaurant(id) {
  return http({
    url: `/restaurants/${id}`,
    method: 'delete',
  })
}

export function getAllRestaurants() {
  return http({
    url: '/restaurants/all?limit=100',
    method: 'get',
  })
}

export function updateStatusRestaurant(data) {
  return http({
    url: `/restaurants/update-status`,
    method: 'patch',
    data,
  })
}

export function getImages(restaurantId) {
  return http({
    url: `/restaurants/${restaurantId}/images/?status=all`,
    method: 'get',
  })
}

export function deleteImage(imageId, restaurantId) {
  return http({
    url: `/restaurants/${restaurantId}/images/${imageId}/`,
    method: 'delete',
  })
}

export function updateImageStatus(imageId, restaurantId, status) {
  return http({
    url: `restaurants/${restaurantId}/images/${imageId}/status`,
    method: 'put',
    data: {
      status: status,
    },
  })
}

export function getUserReservations() {
  return http({
    url: '/booking/user-reservations',
    method: 'get',
  })
}
