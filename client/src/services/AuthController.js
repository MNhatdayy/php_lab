import { getAuthToken, request, setAuthToken } from "../util/ApiFunction";
import { jwtDecode } from "jwt-decode";

export const login = async function (email, password) {
  
  const respone = await request("POST", "/auth/login", {
    email,
    password,
  });
  if (respone.status === 200) {
    console.log(respone.data);
    setAuthToken(respone.data.token);
    return respone.data.token;
  } else {
    return null;
  }
};

export const register = async function (username, email, password, phone) {
  const role = "user";
  const respone = await request("POST", "/auth/register", {
    username,
    email,
    phone,
    password,
    role,
  });
  if (respone.status === 200) {
    return respone.data.token;
  } else {
    return null;
  }
};

export const logout = function () {
  window.sessionStorage.removeItem("token");
};

export const parseToken = () => {
  try {
    const token = getAuthToken();
    const decoded = jwtDecode(token);
    const id = decoded.id;
    const role = decoded.role;
    const name = decoded.name;
    return { id, role, name };
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
