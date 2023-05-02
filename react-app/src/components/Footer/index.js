import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="content">
        <div className="columns has-text-centered-mobile is-align-items-baseline	">
          <div className="column ">
            <h3>Andrew Bierman</h3>
          </div>

          <div className="column  ml-auto footer-links has-text-right has-text-centered-mobile">
            <a
              href="https://www.linkedin.com/in/andrew-bierman/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-linkedin"></i> LinkedIn
            </a>

            <a
              href="https://github.com/andrew-bierman"
              target="_blank"
              rel="noreferrer"
              className="ml-5"
            >
              <i className="fab fa-github"></i> Github
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
