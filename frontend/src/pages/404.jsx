import Header from "../components/Header.jsx";
import BaseHeader from "../components/BaseHeader.jsx";
import Footer from "../components/Footer.jsx";

function NotFound() {
  return (
    <div>
      <Header />
      <BaseHeader />
      <div className="notfound">
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <a href="/">Return to Home</a>
      </div>
      <Footer />
    </div>
  );
}

export default NotFound;
