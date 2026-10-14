import { useLocation, useNavigate } from "react-router-dom";

export const useCartNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return () => navigate("/panier", {
    state: {
      backgroundLocation: location,
      cartOrigin: location.pathname + location.search + location.hash,
      cartScroll: window.scrollY,
    },
  });
};