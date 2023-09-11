import http from "../utils/http";

export function getMyProfile() {
  return http({
    url: "/users/my-profile",
    method: "get",
  });
}
