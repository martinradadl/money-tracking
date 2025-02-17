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
