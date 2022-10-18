import { controller } from "../services/controller.js";
import { PostRoutes } from "../routes/index.js";
import { getItem, addItem, clearStorage } from "../services/storage.js";
import { Keys } from "../constants/index.js";

document.addEventListener("readystatechange", async () => {
  let page = 1;
  const RefreshButton = document.getElementById("refresh-session");
  const OrdersTable = document.getElementById("orders-table");
  const NextButton = document.getElementById("next");
  const LoaderContainer = document.getElementById("loader");
  const ChartLoader = document.getElementById("chart-loader");
  const PreviousButton = document.getElementById("previous");
  const SearchButton = document.getElementById("search-btn");

  //
  document.getElementById("logout-btn").addEventListener("click", () => {
    clearStorage();
    window.location.replace("/views/index.html");
  });
  //
  SearchButton.addEventListener("click", async () => {
    const searchtext = document.getElementById("search-txt").value;
    SearchButton.classList.add("disabled");
    try {
      const user = await getItem(Keys.user);

      if (user) {
        try {
          const results = await controller(
            PostRoutes.orders_search(page, searchtext),
            "",
            "get",
            user?.access_token
          );
          console.log(results);
          if (results?.orders.length <= 0) {
            alert("No Record Found");
          } else {
            loadOrders(results?.orders);
          }
          SearchButton.classList.remove("disabled");
        } catch (error) {
          console.log(error);
          SearchButton.classList.remove("disabled");
        }
      } else {
        alert("session expired");
        window.location.replace("/views/index.html");
      }
    } catch (error) {
      alert(error);
      console.log(error);
      SearchButton.classList.remove("disabled");
    }
  });

  async function GetSellers() {
    let user = await getItem(Keys.user);
    ChartLoader.classList.remove("loader");
    if (user) {
      try {
        const data = await controller(
          PostRoutes.dashboard,
          "",
          "get",
          user.access_token
        );
        const bestsellers = data.dashboard.bestsellers;
        loadData(bestsellers);
        ChartLoader.classList.add("loader");
      } catch (error) {
        alert(error);
        ChartLoader.classList.add("loader");
      }
    } else {
      window.location.replace("/views/index.html");
      ChartLoader.classList.add("loader");
    }
  }

  GetSellers();

  function loadChart(data1, data2) {
    var chart = bb.generate({
      bindto: "#chart",
      data: {
        type: "bar",
        columns: [data1, data2],
      },
    });
  }

  function loadData(sellers = []) {
    const data1 = ["Revenue"];
    const data2 = ["Units"];
    for (let i = 0; i < sellers.length; i++) {
      const seller = sellers[i];
      data1.push(seller?.revenue);
      data2.push(seller?.units);
      loadChart(data1, data2);
    }
  }

  getOrders();

  function loadOrders(orders = []) {
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const el = `
       <tr>
          <th scope="row">
          ${i + 1}
          </th>
          <td>
          ${order?.customer?.surname} ${order?.customer?.name}
          </td>
          <td>
          ${moment(order?.created_at).format("DD/MM/YYYY h:m a")}
          </td>
          <td>
          ${order?.product?.quantity}
          </td>
          <td>
          ${order?.currency} ${order.total}
          </td>
          <td>
          ${order?.status}
          </td>
        </tr>
      `;
      OrdersTable.innerHTML += el;
    }
  }

  async function handleRefresh() {
    const user = await getItem(Keys.user);
    if (user) {
      try {
        const data = await controller(
          PostRoutes.refresh,
          "",
          "post",
          user?.refresh_token
        );

        await addItem(Keys.user, { ...user, access_token: data?.access_token });
        GetSellers();
        getOrders();
      } catch (error) {
        alert(error);
      }
    } else {
      window.location.replace("/views/index.html");
    }
  }
  RefreshButton.addEventListener("click", handleRefresh);

  async function getOrders() {
    LoaderContainer.classList.remove("loader");
    try {
      const user = await getItem(Keys.user);
      if (user) {
        const data = await controller(
          PostRoutes.orders(page),
          null,
          "get",
          user.access_token
        );
        loadOrders(data.orders);
        console.log(data);
        LoaderContainer.classList.add("loader");
      }
    } catch (error) {
      alert(error);
      LoaderContainer.classList.add("loader");
    }
    LoaderContainer.classList.add("loader");
  }

  async function handleNextPage() {
    LoaderContainer.classList.remove("loader");
    page = page + 1;
    const user = await getItem(Keys.user);
    if (user) {
      try {
        const data = await controller(
          PostRoutes.orders(page),
          null,
          "get",
          user.access_token
        );
        loadOrders(data.orders);
        console.log(data);
        LoaderContainer.classList.add("loader");
      } catch (error) {
        alert(error);
        LoaderContainer.classList.add("loader");
      }
    }
    LoaderContainer.classList.add("loader");
  }
  PreviousButton.addEventListener("click", handleBackPage);
  NextButton.addEventListener("click", handleNextPage);

  //
  async function handleBackPage() {
    LoaderContainer.classList.remove("loader");
    page = page === 1 ? page : page - 1;
    try {
      const user = await getItem(Keys.user);
      if (user) {
        const data = await controller(
          PostRoutes.orders(page),
          null,
          "get",
          user.access_token
        );
        loadOrders(data.orders);
        LoaderContainer.classList.add("loader");
      }
    } catch (error) {
      LoaderContainer.classList.add("loader");
      alert(error);
    }
    LoaderContainer.classList.add("loader");
  }
});
