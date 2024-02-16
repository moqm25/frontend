import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";
import "./CustomerPage.css";
import "./LandingPage.css";

import { port } from "./configurations/config.js";

const CustomerPage = () => {
	const [customers, setCustomers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [customerCardPage, setCustomerCardPage] = useState(1);
	const [customersPerPage] = useState(20);
	const [infoPerPage] = useState(10);
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [selectedCustomerId, setSelectedCustomerId] = useState(null);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [customerId, setCustomerId] = useState("");

	useEffect(() => {
		const fetchCustomers = () => {
			let url = `http://localhost:${port}/api/all-customers`;
			let params = [];

			if (firstName) {
				params.push(`first_name=${firstName}`);
			}
			if (lastName) {
				params.push(`last_name=${lastName}`);
			}
			if (customerId) {
				params.push(`customer_id=${customerId}`);
			}

			if (params.length > 0) {
				url += "?" + params.join("&");
			}

			fetch(url)
				.then((response) => response.json())
				.then((data) => setCustomers(data));
		};

		fetchCustomers();
	}, [firstName, lastName, customerId]);

	const indexOfLastCustomer = currentPage * customersPerPage;
	const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
	const currentCustomers = customers.slice(
		indexOfFirstCustomer,
		indexOfLastCustomer
	);
	const indexOfLastCustomerCard = customerCardPage * infoPerPage;
	const indexOfFirstCustomerCard = indexOfLastCustomerCard - infoPerPage;
	const currentCustomerCards = selectedCustomer
		? selectedCustomer.slice(indexOfFirstCustomerCard, indexOfLastCustomerCard)
		: [];

	const paginate = (pageNumber) => setCurrentPage(pageNumber);
	const paginateCustomerCard = (pageNumber) => setCustomerCardPage(pageNumber);

	const handleMoreInfoClick = (customerId) => {
		setSelectedCustomerId(customerId);
		fetch(`http://localhost:${port}/api/rentals/${customerId}`)
			.then((response) => response.json())
			.then((data) => setSelectedCustomer(data));
	};

	const handleClose = () => {
		setSelectedCustomer(null);
		setCustomerCardPage(1);
	};

	return (
		<div className="container">
			<h1>Customers</h1>
			<div className="input-row">
				<input
					type="text"
					placeholder="First Name"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					className="field-infos"
				/>
				<input
					type="text"
					placeholder="Last Name"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					className="field-infos"
				/>
				<input
					type="text"
					placeholder="Customer ID"
					value={customerId}
					onChange={(e) => setCustomerId(e.target.value)}
					className="field-infos"
				/>
			</div>

			<table>
				<thead>
					<tr>
						<th>Customer ID</th>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{currentCustomers.map((customer, index) => (
						<tr key={index}>
							<td>{customer.customer_id}</td>
							<td>{customer.first_name}</td>
							<td>{customer.last_name}</td>
							<td className="button-column">
								<button
									onClick={() => handleMoreInfoClick(customer.customer_id)}
								>
									More Info
								</button>
								<button>Edit</button>
								<button>Delete</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{customers.length > 0 && (
				<Pagination
					totalFilms={customers.length}
					filmsPerPage={customersPerPage}
					paginate={paginate}
					currentPage={currentPage}
				/>
			)}
			{selectedCustomer && (
				<div className="customer-card" onClick={(e) => e.stopPropagation()}>
					<button className="close-button" onClick={handleClose}>
						X
					</button>
					<h2>Customer ID: {selectedCustomerId}</h2>
					<table>
						<thead>
							<tr>
								<th>Film ID</th>
								<th>Title</th>
								<th>Rental ID</th>

								<th>Rental Status</th>
							</tr>
						</thead>
						<tbody>
							{currentCustomerCards.map((rental, index) => (
								<tr key={index}>
									<td>{rental.film_id}</td>
									<td>{rental.title}</td>
									<td>{rental.rental_id}</td>
									<td>{rental.rental_status}</td>
								</tr>
							))}
						</tbody>
					</table>
					<Pagination
						totalFilms={selectedCustomer.length}
						filmsPerPage={10}
						paginate={paginateCustomerCard}
						currentPage={customerCardPage}
					/>
				</div>
			)}
		</div>
	);
};

export default CustomerPage;
