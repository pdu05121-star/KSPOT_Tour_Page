import { BrowserRouter, Routes, Route } from "react-router";
import Landing from "@/app/pages/Landing.tsx";
import TourList from "@/app/pages/TourList.tsx";
import SuwonTour from "@/app/pages/SuwonTour.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/tour" element={<TourList />} />
        <Route path="/tour/suwon" element={<SuwonTour />} />
      </Routes>
    </BrowserRouter>
  );
}
