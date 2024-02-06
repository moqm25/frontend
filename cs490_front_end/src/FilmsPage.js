import React, { useState } from "react";
import "./LandingPage.css";
import "./FilmsPage.css";
import Pagination from "./Pagination";
import { port } from "./configurations/config.js";

const FilmsPage = () => {
	const [filmName, setFilmName] = useState("");
	const [actorFirstName, setActorFirstName] = useState("");
	const [actorLastName, setActorLastName] = useState("");
	const [genreName, setGenreName] = useState("");
	const [films, setFilms] = useState([]);
	const [selectedFilm, setSelectedFilm] = useState(null); // New state variable for the selected film
	const [currentPage, setCurrentPage] = useState(1);
	const [filmsPerPage] = useState(20);
	const [customerId, setCustomerId] = useState(""); // New state variable for the customer ID

	const handleSubmit = () => {
		let url = `http://localhost:${port}/api/films-genre-actor`;
		let params = [];

		if (filmName) {
			params.push(`film_name=${filmName}`);
		}
		if (actorFirstName) {
			params.push(`actor_first_name=${actorFirstName}`);
		}
		if (actorLastName) {
			params.push(`actor_last_name=${actorLastName}`);
		}
		if (genreName) {
			params.push(`genre_name=${genreName}`);
		}

		if (params.length > 0) {
			url += "?" + params.join("&");
		}

		console.log(`Fetching from URL: ${url}`);

		fetch(url)
			.then((response) => response.json())
			.then((data) => setFilms(data));
	};

	const handleFilmClick = (filmId) => {
		// Use filmId to fetch film details
		fetch(`http://localhost:${port}/api/filmsid/${filmId}`)
			.then((response) => response.json())
			.then((data) => setSelectedFilm(data));
	};

	const handleClose = () => {
		setSelectedFilm(null);
	};

	const handleRentSubmit = () => {
		fetch(`http://localhost:${port}/api/customer-exists/${customerId}`)
			.then((response) => response.json())
			.then((data) => {
				if (data.Exists) {
					alert("The film has been rented to the customer.");
					// Add code here to update the database and rent out the film to the customer
					// Will need to make a POST request to the server to update the database
					// make a POST request to the server to update the database
					// fetch(`http://localhost:${port}/api/rent-film`, {
					//     method: "POST",
					//     headers: {
					//         "Content-Type": "application/json",
					//     },
					//     body: JSON.stringify({
					//         film_id: selectedFilm.film_id,
					//         customer_id: customerId,
					//     }),
					// })
					//     .then((response) => response.json())
					//     .then((data) => {
					//         console.log(data);
					//     });
				} else {
					alert("Customer was not found.");
				}
			});
	};

	// Get current films
	const indexOfLastFilm = currentPage * filmsPerPage;
	const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
	const currentFilms = films.slice(indexOfFirstFilm, indexOfLastFilm);

	// Change page
	const paginate = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	return (
		<div className="container">
			<h1>Films</h1>
			<p>
				Enter any Film Name, Actor's First Name, Actor's Last Name, or Genre and
				search it up to get the corresponding films.
			</p>
			<div className="input-row">
				<input
					type="text"
					placeholder="Film Name"
					value={filmName}
					onChange={(e) => setFilmName(e.target.value)}
					className="field-infos"
				/>
				<input
					type="text"
					placeholder="Actor First Name"
					value={actorFirstName}
					onChange={(e) => setActorFirstName(e.target.value)}
					className="field-infos"
				/>
			</div>
			<div className="input-row">
				<input
					type="text"
					placeholder="Actor Last Name"
					value={actorLastName}
					onChange={(e) => setActorLastName(e.target.value)}
					className="field-infos"
				/>
				<input
					type="text"
					placeholder="Genre Name"
					value={genreName}
					onChange={(e) => setGenreName(e.target.value)}
					className="field-infos"
				/>
			</div>
			<div className="button-container">
				<button onClick={handleSubmit}>Search</button>
			</div>

			<br />
			<hr />
			<br />

			<table>
				<thead>
					<tr>
						<th>Film ID</th>
						<th>Title</th>
						<th>Actor</th>
						<th>Genre</th>
					</tr>
				</thead>
				<tbody>
					{currentFilms.map((film, index) => (
						<tr
							key={index}
							onClick={() => handleFilmClick(film.film_id)}
							className="row"
						>
							<td>{film.film_id}</td>
							<td>{film.title}</td>
							<td>
								{film.first_name} {film.last_name}
							</td>
							<td>{film.genre}</td>
						</tr>
					))}
				</tbody>
			</table>
			{films.length > 0 && (
				<Pagination
					filmsPerPage={filmsPerPage}
					totalFilms={films.length}
					paginate={paginate}
					currentPage={currentPage}
				/>
			)}
			{selectedFilm && (
				<div className="film-card" onClick={(e) => e.stopPropagation()}>
					<button className="close-button" onClick={handleClose}>
						X
					</button>
					<h2>{selectedFilm.title}</h2>
					<table>
						<tbody>
							<tr>
								<td>Description:</td>
								<td>{selectedFilm.description}</td>
							</tr>
							<tr>
								<td>Release Year:</td>
								<td>{selectedFilm.release_year}</td>
							</tr>
							<tr>
								<td>Rental Duration:</td>
								<td>{selectedFilm.rental_duration} days</td>
							</tr>
							<tr>
								<td>Rental Rate:</td>
								<td>${selectedFilm.rental_rate}</td>
							</tr>
							<tr>
								<td>Length:</td>
								<td>{selectedFilm.length} minutes</td>
							</tr>
							<tr>
								<td>Replacement Cost:</td>
								<td>${selectedFilm.replacement_cost}</td>
							</tr>
							<tr>
								<td>Rating:</td>
								<td>{selectedFilm.rating}</td>
							</tr>
							<tr>
								<td>Special Features:</td>
								<td>{selectedFilm.special_features}</td>
							</tr>
						</tbody>
					</table>
					<div className="input-button-container">
						<input
							type="text"
							placeholder="Enter Customer ID"
							className="rent-input"
							value={customerId}
							onChange={(e) => setCustomerId(e.target.value)}
						/>
						<button onClick={handleRentSubmit}>Rent to Customer</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default FilmsPage;
