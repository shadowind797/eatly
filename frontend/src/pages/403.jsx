import Header from "../components/Header.jsx";
import BaseHeader from "../components/BaseHeader.jsx";
import Footer from "../components/Footer.jsx";
import forbidden from "../assets/pages/forbidden.svg";
import useUrlParams from "../hooks/useUrlParams.jsx";
import { useEffect, useState } from "react";

function Forbidden() {
  const params = useUrlParams();
  const [page, setPage] = useState("");
  const [banDetail, setBanDetail] = useState("");

  useEffect(() => {
    if (params.reason) {
      if (params.reason === "no_permissions") {
        setPage("no_permissions");
      } else if (params.reason === "banned") {
        setPage("banned");
      }
    }

    if (params.detail) {
      setBanDetail(params.detail);
    }
  }, [params]);

  const checkPage = () => {
    if (page === "no_permissions") {
      return (
        <div className="forbidden">
          <img src={forbidden} alt="Forbidden" />
          <div>
            <h1>You do not have permission to access this page</h1>
            <p>
              This could happen because you clicked on an outdated link, another
              user's link, or a staff link.
            </p>
            <p id="mistake">
              If you think this is an error, please contact our{" "}
              <a href="/support">support team </a>
              and we will promptly resolve your issue.
            </p>
          </div>
        </div>
      );
    } else if (page === "banned") {
      return (
        <div className="forbidden">
          <img src={forbidden} alt="Forbidden" />
          <div>
            <h1>You have been temporarily banned</h1>
            <div>
              <p>
                <span>Ban reason is: </span>
              </p>
              <p id="detail">{banDetail}</p>
            </div>
            <p id="mistake">
              If you think this is an error, please contact our{" "}
              <a href="/support">support team </a>
              and we will promptly resolve your issue.
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <Header />
      <BaseHeader />
      {checkPage()}
      <Footer />
    </div>
  );
}

export default Forbidden;
