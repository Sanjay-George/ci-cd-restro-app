import http from "../utils/http";

export function trendingRestaurants() {
  return http({
    url: "/restaurants/trending?limit=20",
    method: "get",
  });
}

export function searchRestaurants(term) {
  return http({
    url: `/search`,
    params: term,
    method: "get",
  });
}

export function restaurantDetailsById(id) {
  return http({
    url: `/restaurants/${id}`,
    method: "get",
  });
}

export function getChatDetailsByRestaurantId(restaurantId) {
  return http({
    url: `/chats/chat-id/${restaurantId}`,
    method: "get",
  });
}

export function checkReservationAvailability(restaurantId, data) {
  return http({
    url: `/booking/checkReservationAvailability/${restaurantId}`,
    method: "post",
    data,
  });
}

export function reserveRestaurant(data) {
  return http({
    url: `/booking`,
    method: "post",
    data,
  });
}

export function updateReserveRestaurant(data) {
  return http({
    url: `/booking/update`,
    method: "put",
    data,
  });
}

export function cancelReserveRestaurant(id) {
  return http({
    url: `/booking/cancel/${id}`,
    method: "delete",
  });
}

export function allRestaurants() {
  return http({
    url: "/restaurants/all/public?limit=20",
    method: "get",
  });
}
