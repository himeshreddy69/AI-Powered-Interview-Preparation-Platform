import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import AboutPanel from "../components/dashboard/AboutPanel";

function About() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "40px 20px", minHeight: "80vh" }}>
        <AboutPanel />
      </div>
      <Footer />
    </div>
  );
}

export default About;