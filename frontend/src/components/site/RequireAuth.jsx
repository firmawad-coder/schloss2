import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export default function RequireAuth({ children }) {
  const { user, initialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (initialized && !user) {
      const redirect = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?redirect=${redirect}`, { replace: true });
    }
  }, [initialized, user, navigate, location.pathname, location.search]);

  if (!initialized || !user) {
    return (
      <div className="bg-[#f5f0e8] min-h-screen flex items-center justify-center" data-testid="bas-auth-loading">
        <div className="flex flex-col items-center gap-5">
          <div className="w-9 h-9 border border-[#ddd2bf] border-t-[#a8814a] rounded-full animate-spin" />
          <span className="font-italiana text-[10px] tracking-[0.4em] uppercase text-[#a8814a]">Beauty am Schloss</span>
        </div>
      </div>
    );
  }

  return children;
}
