import http from "../utils/http";

export function getRestaurantReviews(id) {
  return http({
    url: `/restaurants/${id}/reviews?offset=0`,
    method: "get",
  });
}

export function postReview(id, data) {
  return http({
    url: `/restaurants/${id}/reviews`,
    method: "post",
    data,
  });
}

export function editReview(id, data) {
  let reviewId = data?.reviewId;
  delete data?.reviewId;
  return http({
    url: `/restaurants/${id}/reviews/${reviewId}`,
    method: "put",
    data,
  });
}

export function deleteReview(id, reviewId) {
  return http({
    url: `/restaurants/${id}/reviews/${reviewId}`,
    method: "delete",
  });
}
