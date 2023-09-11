import http from "../utils/http";

export function getAllCuisines() {
  return http({
    url: `/search/filters/cuisines`,
    method: "get",
  });
}

export function getAllExtraServices() {
  return http({
    url: `/search/filters/extra-services`,
    method: "get",
  });
}
