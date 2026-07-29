import Hero from '@/components/home/Hero';
import CompanySection from '@/components/home/CompanySection';
import FacilitiesSection from '@/components/home/FacilitiesSection';
import CapabilitiesSection from '@/components/home/CapabilitiesSection';
import ProductsSection from '@/components/home/ProductsSection';
import GallerySection from '@/components/home/GallerySection';
import CustomersSection from '@/components/home/CustomersSection';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  return (
    <>
      <Hero />
      <CompanySection />
      <FacilitiesSection />
      <CapabilitiesSection />
      <ProductsSection />
      <GallerySection />
      <CustomersSection />
      <ContactSection />
    </>
  );
}
