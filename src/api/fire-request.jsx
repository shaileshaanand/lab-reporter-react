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
  try {
    const response = await fetch(baseUrl + path, options);
    let data = {};
    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }
    if (response.status === 401) {
      showNotification({
        message: "Unauthorized access denied",
        title: "Error",
        icon: <X />,
        color: "red",
      });
      localStorage.removeItem("token");
    } else if (response.status === 405) {
      showNotification("Method not allowed");
    } else if (response.status >= 400) {
      for (var k in data) {
        if (typeof data[k] === "string") {
          showNotification({
            message: data[k].replace(/\w\S*/g, (w) =>
              w.replace(/^\w/, (c) => c.toUpperCase())
            ),
            title: "Error",
            icon: <X />,
            color: "red",
          });
          console.log(data[k]);
        } else {
          showNotification({
            message: data[k][0].replace(/\w\S*/g, (w) =>
              w.replace(/^\w/, (c) => c.toUpperCase())
            ),
            title: "Error",
            icon: <X />,
            color: "red",
          });
          console.log(data[k][0]);
        }
      }
    }
    return [response, data];
  } catch (err) {
    showNotification({
      message: "Something went wrong",
      title: "Error",
      icon: <X />,
      color: "red",
    });
    console.log(err);
  }
};
