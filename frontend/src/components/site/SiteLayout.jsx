import { useState } from "react";
import Navigation from "@/components/site/Navigation";
import CartDrawer from "@/components/site/CartDrawer";
import Footer from "@/components/site/Footer";

export default function SiteLayout({ children, mainClassName = "" }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="bg-[#f5f0e8] min-h-screen flex flex-col" data-testid="bas-layout">
      <Navigation onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <main className={`flex-1 pt-[148px] ${mainClassName}`}>{children}</main>
      <Footer />
    </div>
  );
}
