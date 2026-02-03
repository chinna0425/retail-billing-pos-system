import { useContext, useState } from "react";
import { ContextApi } from "../../ContextApi/ContextApi.jsx";

import "./Explore.css";
import ExploreDisplayCartSummary from "../../components/ExploreDisplayCartSummary/ExploreDisplayCartSummary.jsx";
import ExploreDisplayCustomerForm from "../../components/ExploreDisplayCustomerForm/ExploreDisplayCustomerForm.jsx";
import ExploreDisplayCategory from "../../components/ExploreDisplayCategory/ExploreDisplayCategory.jsx";
import ExploreDisplayCartItems from "../../components/ExploreDisplayCartItems/ExploreDisplayCartItems.jsx";
import ExploreDisplayItems from "../../components/ExploreDisplayItems/ExploreDisplayItems.jsx";
const Explore = () => {
	const { categories } = useContext(ContextApi);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [customerName, setCustomerName] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	return (
		<div className="explore-container text-light">
			<div className="left-column">
				<h5>Categories</h5>
				<div className="first-row" style={{ overflowY: "auto" }}>
					<ExploreDisplayCategory
						selectedCategory={selectedCategory}
						setSelectedCategory={setSelectedCategory}
						categories={categories}
					/>
				</div>
				<hr className="horizontal-line" />
				<div className="second-row" style={{ overflowY: "auto" }}>
					<ExploreDisplayItems selectedCategory={selectedCategory} />
				</div>
			</div>
			<div className="right-column d-flex flex-column">
				<div className="customer-form-container" style={{ height: "15%" }}>
					<ExploreDisplayCustomerForm
						customerName={customerName}
						setCustomerName={setCustomerName}
						mobileNumber={mobileNumber}
						setMobileNumber={setMobileNumber}
					/>
				</div>
				<hr className="my-3 text-light" />
				<div
					className="cart-items-container"
					style={{ height: "50%", overflowY: "auto" }}
				>
					<ExploreDisplayCartItems />
				</div>
				<hr className="my-3 text-light" />
				<div
					className="billing-summary-container"
					/* style={{ height: "35%", overflowY: "auto" }} */
				>
					<ExploreDisplayCartSummary
						customerName={customerName}
						setCustomerName={setCustomerName}
						mobileNumber={mobileNumber}
						setMobileNumber={setMobileNumber}
					/>
				</div>
			</div>
		</div>
	);
};
export default Explore;
