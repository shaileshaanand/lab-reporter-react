import { FireRequest } from "./fire-request";

export const login = (body) => {
  return FireRequest("POST", `/auth/login`, body, true, null, null, false);
};

export const listReports = (pathParam) => {
  return FireRequest("GET", `/usg-report`, null, false, pathParam, null, true);
};

export const listPatients = (pathParam) => {
  return FireRequest("GET", `/patient`, null, false, pathParam, null, true);
};

export const newPatient = (body) => {
  return FireRequest("POST", `/patient`, body, true, null, null, true);
};

export const updatePatient = (body, params) => {
  return FireRequest("PUT", `/patient/:id`, body, true, null, params, true);
};

export const getPatient = (params) => {
  return FireRequest("GET", `/patient/:id`, null, false, null, params, true);
};

export const listDoctors = (pathParam) => {
  return FireRequest("GET", `/doctor`, null, false, pathParam, null, true);
};

export const newDoctor = (body) => {
  return FireRequest("POST", `/doctor`, body, true, null, null, true);
};

export const updateDoctor = (body, params) => {
  return FireRequest("PUT", `/doctor/:id`, body, true, null, params, true);
};

export const getDoctor = (params) => {
  return FireRequest("GET", `/doctor/:id`, null, false, null, params, true);
};

export const deleteDoctor = (params) => {
  return FireRequest("DELETE", `/doctor/:id`, null, false, null, params, true);
};

export const newUSGReport = (body) => {
  return FireRequest("POST", `/usg-report`, body, true, null, null, true);
};

export const getUSGReport = (params) => {
  return FireRequest("GET", `/usg-report/:id`, null, false, null, params, true);
};

export const updateUSGReport = (body, params) => {
  return FireRequest("PUT", `/usg-report/:id`, body, true, null, params, true);
};

export const deleteUSGReport = (params) => {
  return FireRequest(
    "DELETE",
    `/usg-report/:id`,
    null,
    false,
    null,
    params,
    true
  );
};

export const listUSGReports = (pathParam) => {
  return FireRequest("GET", `/usg-report`, null, false, pathParam, null, true);
};
