import http from "../utils/http";

export function registerUser(data) {
  return http({
    url: "/users/register",
    method: "post",
    data,
  });
}

export function loginUser(data) {
  return http({
    url: "/users/login",
    method: "post",
    data,
  });
}
