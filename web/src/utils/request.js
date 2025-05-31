export const API_DOMAIN = process.env.REACT_APP_PATH_API;

const buildHeaders = (token, isJson = true, isForm = false) => {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (isJson) headers["Content-Type"] = "application/json";
  if (isForm) headers["Content-Type"] = "application/x-www-form-urlencoded";
  return headers;
};

export const get = async (path, token = null) => {
  const res = await fetch(API_DOMAIN + path, {
    method: "GET",
    headers: buildHeaders(token, false),
  });
  return res.json();
};

export const postJson = async (path, data, token = null) => {
  const res = await fetch(API_DOMAIN + path, {
    method: "POST",
    headers: buildHeaders(token, true),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const postForm = async (path, formData, token = null) => {
  const res = await fetch(API_DOMAIN + path, {
    method: "POST",
    headers: buildHeaders(token, false, true),
    body: formData,
  });
  return res.json();
};

export const post = postForm; // Alias for backward compatibility

export const auth = get; // Reuse get with token

export const authPost = async (path, token) => {
  const res = await fetch(API_DOMAIN + path, {
    method: "POST",
    headers: buildHeaders(false),
    body: JSON.stringify({ refresh_token: token }),
  });
  return res.json();
};

export const del = async (path, token = null) => {
  const res = await fetch(API_DOMAIN + path, {
    method: "DELETE",
    headers: buildHeaders(token, false),
  });
  return res.json();
};

export const patch = async (path, options, token = null) => {
  const res = await fetch(API_DOMAIN + path, {
    method: "PATCH",
    headers: buildHeaders(token),
    body: JSON.stringify(options),
  });
  return res.json();
};

export const postFile = async (path, formData, token = null) => {
  const res = await fetch(API_DOMAIN + path, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  return res.json();
};