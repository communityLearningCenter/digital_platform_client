import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../ThemedApp";

export default function SessionTimeout({
  timeout =  30 * 60 * 1000,
}) {
  const navigate = useNavigate();
  const { logout } = useApp();

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        logout();
        navigate("/");
      }, timeout);
    };

    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timer);

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };

  }, [logout, navigate, timeout]);

  return null;
}