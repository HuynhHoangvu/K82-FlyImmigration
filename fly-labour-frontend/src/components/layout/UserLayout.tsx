import { Outlet } from "react-router-dom";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import FloatingContact from "@components/widgets/FloatingContact";
import BackgroundMusic from "@components/widgets/BackgroundMusic";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors duration-300">
      <Header />
      <Outlet />
      <Footer />
      <FloatingContact />
      <BackgroundMusic autoPlay={true} />
    </div>
  );
}
