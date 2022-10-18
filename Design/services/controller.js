const baseURL = "https://freddy.codesubmit.io/";

export function controller(url, data, method, token) {
  return new Promise(function (resolve, reject) {
    try {
      axios({
        baseURL,
        data,
        url,
        method: method ? method : "post",
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
        .then((response) => resolve(response.data))
        .catch((error) =>
          reject(error?.response?.data || error?.message || error)
        );
    } catch (error) {
      reject(error);
      alert(error);
    }
  });
}
