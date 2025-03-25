import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./assets/components/Sidebar";
import Showcase from "./Pages/Showcase/Showcase";
import Rules from "./Pages/Rules/Rules";
import Websdk from "./Pages/Websdk/Websdk";
// import other pages as needed

export default function App() {
  return (
    <Router>
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <div style={{ flexGrow: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Showcase />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/Websdk" element={<Websdk />} />
            {/* Add additional routes for other pages */}
            {/* <Route path="/site-two" element={<SiteTwo />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}
