import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setrefreshToken] = useState();
  const [expiresIn, setexpiresIn] = useState();

  useEffect(() => {
    axios
      .post("http://localhost:3001/login", { code })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setrefreshToken(res.data.refreshToken);
        setexpiresIn(res.data.expiresIn);
        window.history.pushState({}, null, "/");
      })
      .catch((err) => {
        window.location = "/";
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios
        .post("http://localhost:3001/refresh", { refreshToken })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setexpiresIn(res.data.expiresIn);
        })
        .catch((err) => {
          window.location = "/";
        });
    }, (expiresIn - 60) * 1000);
    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
