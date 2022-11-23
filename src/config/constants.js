// export const API_URL = "https://labreporter-staging.herokuapp.com/api/v1";
export const API_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1";
console.log("API_URL", API_URL);
export const DEFAULT_PAGE_SIZE = 10;
