import { BrowserRouter, Routes, Route } from "react-router";
import Landing from "@/app/pages/Landing.tsx";
import TourList from "@/app/pages/TourList.tsx";
import SuwonTour from "@/app/pages/SuwonTour.tsx";
import GangneungTour from "@/app/pages/GangneungTour.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/tour" element={<TourList />} />
        <Route path="/tour/suwon" element={<SuwonTour />} />
        <Route path="/tour/gangneung" element={<GangneungTour />} />
      </Routes>
    </BrowserRouter>
  );
}
