//Navigation.js
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navigation.css"; // Import the CSS file
import logo from "./logo.png"; // Import your logo

const Navigation = () => {
	const location = useLocation();

	return (
		<nav>
			<ul className="navbar">
				<li className="navbar-item">
					<NavLink to="/" className={location.pathname === "/" ? "active" : ""}>
						Home <span></span>
					</NavLink>
				</li>
				<li className="navbar-item">
					<NavLink
						to="/films"
						className={location.pathname === "/films" ? "active" : ""}
					>
						Films <span></span>
					</NavLink>
				</li>
				<li className="navbar-item">
					<NavLink
						to="/customer"
						className={location.pathname === "/customer" ? "active" : ""}
					>
						Customer <span></span>
					</NavLink>
				</li>
				<li className="navbar-item sakila">
					<span>Sakila.</span>
				</li>
				<li className="navbar-item logo">
					<img src={logo} alt="Logo" />
				</li>
			</ul>
		</nav>
	);
};

export default Navigation;
