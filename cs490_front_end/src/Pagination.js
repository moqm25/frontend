import React, { useState, useEffect } from "react";
import "./Pagination.css";

const Pagination = ({ totalFilms, filmsPerPage, paginate, currentPage }) => {
	const totalPages = Math.ceil(totalFilms / filmsPerPage);
	console.log("*totalPages: ", totalPages);
	console.log("*totalFilms: ", totalFilms);
	console.log("*filmsPerPage: ", filmsPerPage);
	console.log("*paginate: ", paginate);
	console.log("*currentPage: ", currentPage);
	const [inputValue, setInputValue] = useState("");

	const handlePageChange = (newPage) => {
		if (isNaN(newPage)) {
			return;
		}
		if (newPage < 1) {
			newPage = 1;
		} else if (newPage > totalPages) {
			newPage = totalPages;
		}
		paginate(newPage);
	};

	const handleInputChange = (event) => {
		const value = event.target.value;
		setInputValue(value);
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			handlePageChange(Number(inputValue));
		}
	};

	useEffect(() => {
		setInputValue("");
		if (currentPage > totalPages) {
			paginate(totalPages);
		}
	}, [totalFilms, currentPage, totalPages, paginate]);

	return (
		<div className="pagination-buttons">
			<button onClick={() => handlePageChange(1)}>First</button>
			<button onClick={() => handlePageChange(currentPage - 1)}>Back</button>
			<input
				type="text"
				value={inputValue}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				placeholder="Page #"
				className="pagination-input"
			/>

			<span className="page-info">
				{totalPages > 0 ? `${currentPage} / ${totalPages}` : "0 / 0"}
			</span>
			<button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
			<button onClick={() => handlePageChange(totalPages)}>Last</button>
		</div>
	);
};

export default Pagination;
