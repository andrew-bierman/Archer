import React, { useEffect, useState } from "react";
import "./ScrollToTop.css";

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 400) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
  }, []);

  return (
    <>
      {showButton && (
        <button type="button" className="to-top-btn" onClick={scrollToTop}>
          <i className="fa-sharp fa-solid fa-arrow-up"></i>
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
