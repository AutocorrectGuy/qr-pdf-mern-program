import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import CataloguesList from "./components/Views/CataloguesList"
import UploadLink from "./components/Views/UploadLink";
import ViewPdf from "./components/Views/ViewPdf";
import ViewLink from "./components/Views/ViewLink";
import UploadPdf from "./components/Views/UploadPdf";
import Secret from "./components/Views/Secret";
import Login from "./components/Views/Login";
import Register from "./components/Views/Register";
import NotFoundPage from "./components/Views/NotFoundPage";
import 'react-toastify/dist/ReactToastify.css';
import UserContext from "./context/UserContext";

function App() {
  const [userContextData, setUserContextData] = useState([]);
  const value = { userContextData, setUserContextData };

  return (
    <div className="flex min-h-full">
      <Router>
          <UserContext.Provider value={value}>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/secret" element={<Secret />} />
              <Route path="/" element={<CataloguesList />} />
              <Route path="/upload-link" element={<UploadLink />} />
              <Route path="/upload-pdf" element={<UploadPdf />} />
              <Route path="/pdfs/:id" element={<ViewPdf />} />
              <Route path="/links/:id" element={<ViewLink />} />
            </Routes>
          </UserContext.Provider>
      </Router>
      </div>
  );
}

export default App; 

{/* <Route element={<NotFoundPage />} /> */}