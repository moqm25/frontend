import React, { useEffect, useState } from "react";
import "./LandingPage.css"; // Import the CSS file
import { port } from "./configurations/config.js";

const LandingPage = () => {
	const [topFilms, setTopFilms] = useState([]);
	const [topActors, setTopActors] = useState([]);
	const [selectedFilm, setSelectedFilm] = useState(null);
	const [selectedActor, setSelectedActor] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetch(`http://localhost:${port}/api/top-films`)
			.then((response) => response.json())
			.then((data) => setTopFilms(data));

		fetch(`http://localhost:${port}/api/top-actors`)
			.then((response) => response.json())
			.then((data) => setTopActors(data));
	}, []);
	const handleFilmClick = (filmTitle) => {
		setSelectedActor(null); // Close the actor card if it's open
		setLoading(true);
		fetch(`http://localhost:${port}/api/films/${filmTitle}`)
			.then((response) => response.json())
			.then((data) => {
				setSelectedFilm(data);
				setLoading(false);
			});
	};

	const handleActorClick = (firstName, lastName) => {
		setSelectedFilm(null); // Close the film card if it's open
		setLoading(true);
		fetch(`http://localhost:${port}/api/actors/${firstName}/${lastName}`)
			.then((response) => response.json())
			.then((data) => {
				setSelectedActor(data);
				setLoading(false);
			});
	};

	const handleClose = () => {
		setSelectedFilm(null);
		setSelectedActor(null);
	};

	return (
		<div className="container" onClick={handleClose}>
			<h1>Top 5 Rented Films of All Times</h1>
			<table>
				<thead>
					<tr>
						<th>Title</th>
						<th>Rental Count</th>
					</tr>
				</thead>
				<tbody>
					{topFilms.map((film, index) => (
						<tr
							key={index}
							onClick={(e) => {
								e.stopPropagation();
								handleFilmClick(film.title);
							}}
							className="row"
						>
							<td>{film.title}</td>
							<td>{film.rental_count}</td>
						</tr>
					))}
				</tbody>
			</table>
			{loading && <p>Loading...</p>}
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
				</div>
			)}
			<br />
			<hr />
			<h1>Top 5 Actors</h1>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Film Count</th>
					</tr>
				</thead>
				<tbody>
					{topActors.map((actor, index) => (
						<tr
							key={index}
							onClick={(e) => {
								e.stopPropagation();
								handleActorClick(actor.first_name, actor.last_name);
							}}
							className="row"
						>
							<td>
								{actor.first_name} {actor.last_name}
							</td>
							<td>{actor.film_count}</td>
						</tr>
					))}
				</tbody>
			</table>
			{selectedActor && (
				<div className="actor-card" onClick={(e) => e.stopPropagation()}>
					<button className="close-button" onClick={handleClose}>
						X
					</button>
					<h2>
						{selectedActor.first_name} {selectedActor.last_name} (ID:{" "}
						{selectedActor.actor_id})
					</h2>
					<table>
						<thead>
							<tr>
								<th>Rank</th>
								<th>Title</th>
								<th>Rental Count</th>
							</tr>
						</thead>
						<tbody>
							{selectedActor.films.map((film, index) => (
								<tr
									key={index}
									onClick={(e) => {
										e.stopPropagation();
										handleFilmClick(film.title);
									}}
									className="row"
								>
									<td>{index + 1}</td>
									<td>{film.title}</td>
									<td>{film.rental_count}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default LandingPage;
