import { useEffect, useState } from "react";
import Navigation from "@/components/site/Navigation";
import Hero from "@/components/site/Hero";
import TrustSignals from "@/components/site/TrustSignals";
import BrandsSection from "@/components/site/BrandsSection";
import ProductSection from "@/components/site/ProductSection";
import Philosophy from "@/components/site/Philosophy";
import Newsletter from "@/components/site/Newsletter";
import Footer from "@/components/site/Footer";
import { fetchBrands, fetchProducts } from "@/lib/api";

export default function Home() {
  const [brands, setBrands] = useState([]);
  const [newest, setNewest] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);

  useEffect(() => {
    fetchBrands().then(setBrands).catch(() => {});
    fetchProducts("new").then(setNewest).catch(() => {});
    fetchProducts("bestseller").then(setBestsellers).catch(() => {});
  }, []);

  return (
    <div className="bg-[#f9f7f4] min-h-screen" data-testid="lx-home">
      <Navigation />
      <main>
        <Hero />
        <TrustSignals />
        <BrandsSection brands={brands} />
        <ProductSection
          id="newest"
          eyebrow="Soeben eingetroffen"
          title="Die neuesten"
          italicWord="Stücke."
          description="Frische Maison-Drops und limitierte Editionen, persönlich für Sie ausgewählt."
          products={newest}
        />
        <Philosophy />
        <ProductSection
          id="bestsellers"
          eyebrow="Most loved"
          title="Bestseller der"
          italicWord="Saison."
          description="Pflege- und Parfumerie-Klassiker, die unsere Kundinnen immer wieder wählen."
          products={bestsellers}
          ctaLabel="Alle Bestseller"
        />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
