import { useEffect, useState } from "react";
import Navigation from "@/components/site/Navigation";
import Hero from "@/components/site/Hero";
import TrustSignals from "@/components/site/TrustSignals";
import BrandsSection from "@/components/site/BrandsSection";
import ProductSection from "@/components/site/ProductSection";
import Reviews from "@/components/site/Reviews";
import Philosophy from "@/components/site/Philosophy";
import Newsletter from "@/components/site/Newsletter";
import Footer from "@/components/site/Footer";
import CartDrawer from "@/components/site/CartDrawer";
import { fetchBrands, fetchProducts } from "@/lib/api";

export default function Home() {
  const [parfumBrands, setParfumBrands] = useState([]);
  const [fragrances, setFragrances] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newest, setNewest] = useState([]);
  const [skincare, setSkincare] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    fetchBrands("fragrance").then(setParfumBrands).catch(() => {});
    fetchProducts({ category: "fragrance" }).then(setFragrances).catch(() => {});
    fetchProducts({ filter: "bestseller", category: "fragrance" }).then(setBestsellers).catch(() => {});
    fetchProducts({ filter: "new", category: "fragrance" }).then(setNewest).catch(() => {});
    fetchProducts({ category: "skincare" }).then(setSkincare).catch(() => {});
  }, []);

  return (
    <div className="bg-[#f5f0e8] min-h-screen" data-testid="bas-home">
      <Navigation onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <main>
        <Hero />
        <TrustSignals />
        <BrandsSection brands={parfumBrands} />
        <ProductSection
          id="fragrances"
          eyebrowNumber="N°I"
          eyebrow="HAUTE PARFUMERIE"
          title="Die Auswahl der"
          italicWord="Maison."
          description="Acht Parfums, sorgfältig kuratiert aus den Häusern, die olfaktorische Geschichte schreiben. Jeder Flakon eine Signatur."
          products={fragrances.slice(0, 4)}
          ctaLabel="Alle Parfums"
        />
        <Reviews />
        <ProductSection
          id="newest"
          eyebrowNumber="N°II"
          eyebrow="NOUVELLES PARUTIONS"
          title="Frisch in"
          italicWord="Berlin."
          description="Die jüngsten Editionen unserer Maisons — limitiert, persönlich freigegeben, in Kleinstchargen abgefüllt."
          products={newest.slice(0, 4)}
          dark
          ctaLabel="Alle Neuheiten"
        />
        <Philosophy />
        <ProductSection
          id="bestsellers"
          eyebrowNumber="N°VI"
          eyebrow="LES INCONTOURNABLES"
          title="Die zeitlosen"
          italicWord="Klassiker."
          description="Parfums, die unsere Kundinnen seit Jahren wählen — Komposition gewordene Eleganz."
          products={bestsellers.slice(0, 4)}
          ctaLabel="Alle Bestseller"
        />
        <ProductSection
          id="skincare"
          eyebrowNumber="N°VII"
          eyebrow="MEDICAL SKINCARE"
          title="Auch für die"
          italicWord="Haut."
          description="Hochleistungs-Pflege aus dermatologischen Laboren — als olfaktorische Ergänzung zu Ihrem Ritual."
          products={skincare.slice(0, 4)}
          ctaLabel="Alle Pflege"
        />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
