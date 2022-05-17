import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import CataloguesList from "./components/Views/CataloguesList"
import UploadLink from "./components/Views/UploadLink";
import ViewPdf from "./components/Views/ViewPdf";
import UploadPdf from "./components/Views/UploadPdf";
import NavLeft from "./components/navbar/NavLeft"
import NavRight from "./components/navbar/NavRight"
import Test from "./components/Views/Test";

function App() {
  return (
    <div className="flex min-h-full">
      <Router>
        <NavLeft />
        <Routes>
          <Route path="/" element={<CataloguesList />} />
          <Route path="/upload-link" element={<UploadLink />} />
          <Route path="/upload-pdf" element={<UploadPdf />} />
          {/* <Route path="/api/pdfs/view/:id" element={<ViewPdf />} /> */}
          <Route path="/pdfs/:id" element={<ViewPdf />} />
          <Route path="/test" element={<Test />} />
        </Routes>
        <NavRight />
      </Router>
      </div>
  );
}

export default App; 
