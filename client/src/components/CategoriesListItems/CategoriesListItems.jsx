import { useContext, useState } from "react";
import { ContextApi } from "../../ContextApi/ContextApi.jsx";
import "./CategoriesListItems.css";
import { deleteCategory } from "../../ApiServices/CategoryService";
import toast from "react-hot-toast";

const CategoriesListItems = () => {
	const { categories, setCategories } = useContext(ContextApi);
	const [searchTerm, setSearchTerm] = useState("");

	const filteredCategories = categories.filter((category) =>
		category.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const deleteByCategory = async (categoryId) => {
		try {
			const response = await deleteCategory(categoryId);
			if (response.status === 204) {
				setCategories((prev) =>
					prev.filter((category) => category.categoryId !== categoryId),
				);

				toast.success("Category deleted successfully");
			} else {
				toast.error("Failed to delete category");
			}
		} catch (error) {
			console.error("Failed to delete category", error);
			toast.error("Failed to delete category");
		}
	};

	return (
		<div
			className="category-list-container"
			style={{ height: "100vh", overflowY: "auto", overflowX: "hidden" }}
		>
			<div className="row pe-2">
				<div className="input-group mb-3">
					<input
						name="keyword"
						id="keyword"
						type="text"
						className="form-control"
						placeholder="Search Categories..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<span className="input-group-text bg-warning">
						<i className="bi bi-search"></i>
					</span>
				</div>
			</div>
			<div className="row g-3 pe-2">
				{filteredCategories.map((category) => (
					<div key={category.categoryId} className="col-12">
						<div
							className="card p-4 shadow"
							style={{ backgroundColor: "#343a40" }}
						>
							<div className="d-flex align-items-center justify-content-between">
								<div className="d-flex align-items-center">
									<div style={{ marginRight: "25px" }}>
										<img
											src={category.imgUrl}
											alt={category.name}
											className="category-image"
										/>
									</div>
									<div>
										<h5 className="mb-1 text-white">{category.name}</h5>
										<p className="mb-0 text-light">
											{category.itemsCount} Items
										</p>
									</div>
								</div>
								<button
									className="btn btn-danger btn-sm"
									onClick={() => deleteByCategory(category.categoryId)}
								>
									<i className="bi bi-trash"></i>
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
export default CategoriesListItems;
