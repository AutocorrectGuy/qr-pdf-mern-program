import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import CataloguesList from "./components/CataloguesList"
import CreateCatalogue from "./components/CreateCatalogue";
import ViewCatalogue from "./components/ViewCatalogue";
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
          <Route path="/catalogues/:id" element={<ViewCatalogue />} />
          <Route path="/catalogues/add" element={<CreateCatalogue />} />
        </Routes>
        <NavRight />
      </div>
    </Router>
  );
}

export default App; 
