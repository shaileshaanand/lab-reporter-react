import { showNotification } from "@mantine/notifications";
import { X } from "tabler-icons-react";

import { API_URL } from "../config/constants";
const baseUrl = API_URL;

export const FireRequest = async (
  method,
  path,
  body,
  bodyRequired,
  pathParam,
  params,
  authenticationRequired
) => {
  //headers
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (authenticationRequired)
    headers.append(
      "Authorization",
      `Bearer ${JSON.parse(localStorage.getItem("token"))}`
    );

  // fetch api options
  const options = {
    method: method,
    headers: headers,
  };

  if (bodyRequired) options["body"] = JSON.stringify(body);

  // modifying path according to params
  if (params) {
    Object.entries(params).forEach((obj) => {
      path = path.replace(`:${obj[0]}`, obj[1]);
    });
  }

  // modifying path according to pathParam
  if (pathParam) {
    path = path + "?";
    path += new URLSearchParams(pathParam).toString();
  }

  // calling fetch api
  const response = fetch(baseUrl + path, options)
    .then((response) => {
      const data = response.json();
      return Promise.all([response, data]);
    })
    .then((res) => {
      if (res[0].status === 401) {
        // toast.error("Unauthorized access denied");
        localStorage.removeItem("token");
      } else if (res[0].status === 405) showNotification("Method not allowed");
      else if (res[0].status >= 400) {
        for (var k in res[1]) {
          if (typeof res[1][k] === "string") {
            // toast.error(
            //   res[1][k].replace(/\w\S*/g, (w) =>
            //     w.replace(/^\w/, (c) => c.toUpperCase())
            //   )
            // );
            showNotification({
              message: res[1][k].replace(/\w\S*/g, (w) =>
                w.replace(/^\w/, (c) => c.toUpperCase())
              ),
              title: "Error",
              icon: <X />,
              color: "red",
            });
            console.log(res[1][k]);
          } else {
            // toast.error(
            //   res[1][k][0].replace(/\w\S*/g, (w) =>
            //     w.replace(/^\w/, (c) => c.toUpperCase())
            //   )
            // );

            showNotification({
              message: res[1][k][0].replace(/\w\S*/g, (w) =>
                w.replace(/^\w/, (c) => c.toUpperCase())
              ),
              title: "Error",
              icon: <X />,
              color: "red",
            });
            console.log(res[1][k][0]);
          }
        }
      }

      return res;
    })
    .catch((err) => {
      // toast.error("Something went wrong");
      showNotification({
        message: "Something went wrong",
        title: "Error",
        icon: <X />,
        color: "red",
      });
      console.log(err);
    });
  return response;
};
