import { controller } from "../services/controller.js";
import { PostRoutes } from "../routes/index.js";
import { addItem } from "../services/storage.js";
import { Keys } from "../constants/index.js";
const LoginButton = document.getElementById("login-btn");
const Usernametxt = document.getElementById("username");
const Passwordtxt = document.getElementById("password");
const Loader = document.getElementById("loader");

//pwd=ElmStreet2019
//uname=freddy
LoginButton.addEventListener("click", async () => {
  try {
    Loader.classList.remove("loader");
    const loginInfo = {
      username: Usernametxt.value || "freddy",
      password: Passwordtxt.value || "ElmStreet2019",
    };
    const info = await controller(PostRoutes.login, loginInfo);
    await addItem(Keys.user, info);
    Loader.classList.add("loader");
    window.location.replace("/views/home.html");
  } catch (error) {
    alert(error);
    Loader.classList.add("loader");
  }
});
