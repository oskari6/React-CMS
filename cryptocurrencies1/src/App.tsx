import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import CryptoPrices from "./pages/CryptoPrices";
import Footer from "./components/Footer";
import Heading from "./components/Heading";
import Incomplete from "./pages/Incomplete";

function App() {
  return (
    <>
      <div className="outer-wrapper">
        <Heading />
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/cryptoprices" element={<CryptoPrices />} />
            <Route path="/incomplete" element={<Incomplete />} />
          </Routes>
        </Router>
        <Footer />
      </div>
    </>
  );
}

export default App;
