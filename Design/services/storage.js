export function addItem(key, data) {
  return new Promise(function (resolve, reject) {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

export function getItem(key) {
  return new Promise(function (resolve, reject) {
    try {
      const data = window.localStorage.getItem(key);
      resolve(JSON.parse(data));
    } catch (error) {
      reject(error);
    }
  });
}

export function clearStorage() {
  window.localStorage.clear();
}
