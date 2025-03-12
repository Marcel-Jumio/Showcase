import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./assets/components/Sidebar";
import Showcase from "./Pages/Showcase/Showcase";
// import other pages as needed

export default function App() {
  return (
    <Router>
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <div style={{ flexGrow: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Showcase />} />
            {/* Add additional routes for other pages */}
            {/* <Route path="/site-two" element={<SiteTwo />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}
