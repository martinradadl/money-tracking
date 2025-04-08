import { expiresOn, setCookie } from "./cookies";

export const isMobile = () => {
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
};

export const setExpiresOn = (expirationSeconds: number) => {
  const expiration = expirationSeconds * 1000;
  const now = new Date().getTime();
  setCookie("expiresOn", new Date(now + expiration).getTime());
};

export const isExpired = () => {
  const now = new Date().getTime();
  return now > expiresOn();
};

export const parseObjectToQueryParams = (params: object) => {
  let queryParams = "?";
  Object.entries(params).map((elem) => {
    if (elem[1]) {
      if (queryParams !== "?") queryParams += "&";
      queryParams += `${elem[0]}=${elem[1]}`;
    }
  });
  return queryParams;
};
