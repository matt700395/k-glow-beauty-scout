import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, User, LogOut, Moon, Sun, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="container flex h-14 items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold gradient-text shrink-0">
          K-Glow
        </Link>

        {!isHome && (
          <button
            onClick={() => navigate("/")}
            className="hidden md:flex items-center gap-2 flex-1 max-w-md h-9 px-4 rounded-lg border border-input bg-background text-muted-foreground text-sm hover:bg-secondary transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>검색어를 입력하세요</span>
          </button>
        )}

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleDark}>
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => navigate("/saved")}>
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate("/account")}>
                <User className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => { logout(); navigate("/"); }}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button variant="soft" size="sm" onClick={() => navigate("/auth")}>
              로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
