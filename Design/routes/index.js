export const PostRoutes = {
  login: "login",
  dashboard: "dashboard",
  orders: (page = 1) => "orders?page=" + page,
  orders_search: (page = 1, search = "") => `orders?page=${page}&q=${search}`,
  refresh: "refresh",
};
