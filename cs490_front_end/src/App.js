// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import FilmsPage from "./FilmsPage";

// import FilmsPage from "./FilmsPage";
// import CustomerPage from "./CustomerPage";
import Navigation from "./Navigation";

const App = () => {
	return (
		<Router>
			<Navigation />
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/films" element={<FilmsPage />} />
			</Routes>
		</Router>
	);
};

export default App;
