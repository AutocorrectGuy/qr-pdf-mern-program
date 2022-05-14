import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import CataloguesList from "./components/Views/CataloguesList"
import UploadLink from "./components/Views/UploadLink";
import ViewCatalogue from "./components/Views/ViewCatalogue";
import UploadPdf from "./components/Views/UploadPdf";
import NavLeft from "./components/navbar/NavLeft"
import NavRight from "./components/navbar/NavRight"


const class1 = "flex gap-2 bg-neutral-800 w-full min-h-screen items-center justify-center";

function App() {
  return (
    <Router>
      <div className="flex min-h-full">
        <NavLeft />
        <Routes>
          <Route path="/" element={<CataloguesList />} />
          <Route path="/upload-link" element={<UploadLink />} />
          <Route path="/upload-pdf" element={<UploadPdf />} />
        </Routes>
        <NavRight />
      </div>
    </Router>
  );
}

export default App; 
