import cookies from "js-cookie"

export const clearUserData = () => {
  localStorage.removeItem("user")
  cookies.remove("isLoggedIn")
}