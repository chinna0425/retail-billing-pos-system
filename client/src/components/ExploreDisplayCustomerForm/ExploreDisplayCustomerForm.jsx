import "./ExploreDisplayCustomerForm.css";

const ExploreDisplayCustomerForm = ({
	customerName,
	setCustomerName,
	mobileNumber,
	setMobileNumber,
}) => {
	return (
		<div className="p-1">
			<div className="mb-3">
				<div className="d-flex align-items-center gap-2">
					<label htmlFor="customerName" className="col-4">
						Customer Name
					</label>
					<input
						value={customerName}
						onChange={(e) => setCustomerName(e.target.value)}
						type="text"
						className="form-control form-control-sm"
						id="customerName"
						placeholder="Name.."
						required
					/>
				</div>
			</div>
			<div className="mb-3">
				<div className="d-flex align-items-center gap-2">
					<label htmlFor="mobileNumber" className="col-4">
						Mobile Number
					</label>
					<input
						value={mobileNumber}
						onChange={(e) => {
							const value = e.target.value.replace(/\D/g, ""); // remove non-digits
							setMobileNumber(value);
						}}
						type="tel"
						className="form-control form-control-sm"
						id="mobileNumber"
						maxLength={10}
						pattern="[0-9]{10}"
						placeholder="9876543210.."
						required
					/>
				</div>
			</div>
		</div>
	);
};

export default ExploreDisplayCustomerForm;
