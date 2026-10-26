import { useLocation } from "react-router-dom";
import "../../styles/layout/motion.css";

// Wraps the routed page so each new screen fades in, the web
// counterpart of the app moving between screens. Keyed on the path so
// it plays on every navigation, not only the first.
export default function PageTransition({ children }) {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
