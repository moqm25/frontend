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
	const [isActive, setIsActive] = useState("");

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

	const [newFirstName, setNewFirstName] = useState("");
	const [newLastName, setNewLastName] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [newAddress, setNewAddress] = useState("");
	const [newDistrict, setNewDistrict] = useState("");
	const [newCity, setNewCity] = useState("");
	const [newPostalCode, setNewPostalCode] = useState("");
	const [newPhone, setNewPhone] = useState("");
	const [newCountry, setNewCountry] = useState("");
	const [showForm, setShowForm] = useState(false);

	const [editingCustomer, setEditingCustomer] = useState(null);

	const handleEditClick = (customer) => {
		setEditingCustomer(customer);
		setShowForm(true);

		// Make a GET request to your backend API to fetch the customer's details
		console.log(customer.customer_id);
		fetch(`http://localhost:${port}/api/customer/${customer.customer_id}`)
			.then((response) => response.json())
			.then((data) => {
				// Update the form fields with the fetched data
				setNewFirstName(data.first_name);
				setNewLastName(data.last_name);
				setNewEmail(data.email);
				setNewAddress(data.address);
				setNewDistrict(data.district);
				setNewCity(data.city);
				setNewPostalCode(data.postal_code);
				setNewPhone(data.phone);
				setNewCountry(data.country);
				setIsActive(data.active);
				console.log(data);
			})
			.catch((error) => console.error("Error:", error));
	};

	const handleMoreInfoClick = (customerId) => {
		setSelectedCustomerId(customerId);
		fetch(`http://localhost:${port}/api/rentals/${customerId}`)
			.then((response) => response.json())
			.then((data) => setSelectedCustomer(data));
	};

	const handleAddCustomer = () => {
		// Create a new customer object
		const newCustomer = {
			firstName: newFirstName,
			lastName: newLastName,
			email: newEmail,
			address: newAddress,
			district: newDistrict,
			city: newCity,
			postalCode: newPostalCode,
			phone: newPhone,
			country: newCountry,
			active: isActive,
		};

		// Make a POST request to your backend API to add the new customer
		fetch(`http://localhost:${port}/api/add-customer`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newCustomer),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.message === "Customer added successfully!") {
					// Update the customers state to include the new customer
					setCustomers([...customers, newCustomer]);
					// Clear the form fields
					setNewFirstName("");
					setNewLastName("");
					setNewEmail("");
					setNewAddress("");
					setNewDistrict("");
					setNewCity("");
					setNewPostalCode("");
					setNewPhone("");
					setNewCountry("");
					// Close the form
					setShowForm(false);
					// Show an alert message
					window.alert("New customer added successfully!");
					// Reload the page
					window.location.reload();
				}
			})
			.catch((error) => console.error("Error:", error));
	};

	const handleDeleteCustomer = (customerId) => {
		// Confirm with the user
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this customer?"
		);
		if (confirmDelete) {
			// Make a DELETE request to your backend API to delete the customer
			fetch(`http://localhost:${port}/api/delete-customer/${customerId}`, {
				method: "DELETE",
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.message === "Customer deleted successfully!") {
						// Remove the deleted customer from the customers state
						setCustomers(
							customers.filter(
								(customer) => customer.customer_id !== customerId
							)
						);
					}
				})
				.catch((error) => console.error("Error:", error));
		}
	};

	const handleClose = () => {
		setSelectedCustomer(null);
		setCustomerCardPage(1);
	};

	const handleEditCustomer = () => {
		// Make a PUT request to your backend API to update the customer
		console.log(editingCustomer);
		fetch(
			`http://localhost:${port}/api/edit-customer/${editingCustomer.customer_id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName: newFirstName,
					lastName: newLastName,
					email: newEmail,
					address: newAddress,
					district: newDistrict,
					city: newCity,
					postalCode: newPostalCode,
					phone: newPhone,
					country: newCountry,
					customerId: editingCustomer.customer_id,
					active: isActive,
				}),
			}
		)
			.then((response) => response.json())
			.then((data) => {
				if (data.message === "Customer updated successfully!") {
					// Update the customers state to reflect the updated customer
					setCustomers(
						customers.map((customer) =>
							customer.customer_id === editingCustomer.customer_id
								? editingCustomer
								: customer
						)
					);
					// Close the form
					setShowForm(false);
					// Show an alert message
					window.alert("Customer updated successfully!");
					// Reload the page
					window.location.reload();
				}
			})
			.catch((error) => console.error("Error:", error));
	};

	return (
		<div className="container">
			<h1>Customers</h1>

			<button onClick={() => setShowForm(!showForm)}>Add Customer</button>
			{showForm && (
				<div className={showForm ? "customer-card" : ""}>
					<h2>Add Customer</h2>
					<button className="close-button" onClick={() => setShowForm(false)}>
						X
					</button>
					<input
						type="text"
						placeholder="First Name"
						value={newFirstName}
						onChange={(e) => setNewFirstName(e.target.value)}
						className="field-infos"
					/>
					<br />
					<input
						type="text"
						placeholder="Last Name"
						value={newLastName}
						onChange={(e) => setNewLastName(e.target.value)}
						className="field-infos"
					/>
					<br />
					<input
						type="text"
						placeholder="Email"
						value={newEmail}
						onChange={(e) => setNewEmail(e.target.value)}
						className="field-infos"
					/>
					<br />
					<input
						type="text"
						placeholder="Address"
						value={newAddress}
						onChange={(e) => setNewAddress(e.target.value)}
						className="field-infos"
					/>
					<br />
					<input
						type="text"
						placeholder="District"
						value={newDistrict}
						onChange={(e) => setNewDistrict(e.target.value)}
						className="field-infos"
					/>
					<br />
					<input
						type="text"
						placeholder="City"
						value={newCity}
						onChange={(e) => setNewCity(e.target.value)}
						className="field-infos"
					/>
					<br />
					<input
						type="text"
						placeholder="Postal Code"
						value={newPostalCode}
						onChange={(e) => setNewPostalCode(e.target.value)}
						className="field-infos"
					/>
					<br />
					<input
						type="text"
						placeholder="Phone"
						value={newPhone}
						onChange={(e) => setNewPhone(e.target.value)}
						className="field-infos"
					/>
					<br />
					<input
						type="text"
						placeholder="Country"
						value={newCountry}
						onChange={(e) => setNewCountry(e.target.value)}
						className="field-infos"
					/>
					<br />
					<button onClick={handleAddCustomer}>Submit</button>
				</div>
			)}

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
								<button onClick={() => handleEditClick(customer)}>Edit</button>
								<button
									onClick={() => handleDeleteCustomer(customer.customer_id)}
								>
									Delete
								</button>
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
			{showForm && (
				<div className={showForm ? "customer-card" : ""}>
					<h2>{editingCustomer ? "Edit Customer" : "Add Customer"}</h2>
					<button className="close-button" onClick={() => setShowForm(false)}>
						X
					</button>
					<input
						type="text"
						placeholder="First Name"
						value={newFirstName}
						onChange={(e) => setNewFirstName(e.target.value)}
						className="field-infos"
					/>
					<input
						type="text"
						placeholder="Last Name"
						value={newLastName}
						onChange={(e) => setNewLastName(e.target.value)}
						className="field-infos"
					/>

					<input
						type="text"
						placeholder="Email"
						value={newEmail}
						onChange={(e) => setNewEmail(e.target.value)}
						className="field-infos"
					/>

					<input
						type="text"
						placeholder="Address"
						value={newAddress}
						onChange={(e) => setNewAddress(e.target.value)}
						className="field-infos"
					/>

					<input
						type="text"
						placeholder="District"
						value={newDistrict}
						onChange={(e) => setNewDistrict(e.target.value)}
						className="field-infos"
					/>

					<input
						type="text"
						placeholder="City"
						value={newCity}
						onChange={(e) => setNewCity(e.target.value)}
						className="field-infos"
					/>

					<input
						type="text"
						placeholder="Postal Code"
						value={newPostalCode}
						onChange={(e) => setNewPostalCode(e.target.value)}
						className="field-infos"
					/>
					<input
						type="text"
						placeholder="Phone"
						value={newPhone}
						onChange={(e) => setNewPhone(e.target.value)}
						className="field-infos"
					/>

					<input
						type="text"
						placeholder="Country"
						value={newCountry}
						onChange={(e) => setNewCountry(e.target.value)}
						className="field-infos"
					/>
					<input
						type="text"
						placeholder="Active"
						value={isActive}
						onChange={(e) => setIsActive(e.target.value)}
						className="field-infos"
					/>

					<button
						onClick={editingCustomer ? handleEditCustomer : handleAddCustomer}
					>
						{editingCustomer ? "Update" : "Submit"}
					</button>
				</div>
			)}
		</div>
	);
};

export default CustomerPage;
