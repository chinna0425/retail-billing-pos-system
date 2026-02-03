import { useContext, useState } from "react";
import { ContextApi } from "../../ContextApi/ContextApi";
import { deleteItem } from "../../ApiServices/ItemService";
import "./ItemsList.css";
import toast from "react-hot-toast";

const ItemsList = () => {
	const { itemsList, setItemsList, categories, setCategories } =
		useContext(ContextApi);
	const [searchTerm, setSearchTerm] = useState("");

	const filteredItems = itemsList.filter((item) =>
		item.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const deleteByItemId = async (itemId) => {
		try {
			const existingItem = itemsList.find((item) => item.itemId === itemId);

			const categoryId = existingItem?.categoryId;

			const response = await deleteItem(itemId);

			if (response.status === 204) {
				setItemsList((prev) => prev.filter((item) => item.itemId !== itemId));

				if (categoryId) {
					setCategories((prev) =>
						prev.map((category) =>
							category.categoryId === categoryId
								? {
										...category,
										itemsCount: category.itemsCount - 1,
									}
								: category,
						),
					);
				}

				toast.success("Item deleted successfully");
			}
		} catch (error) {
			console.error("Failed to delete item", error);
			toast.error("Failed to delete item");
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
						placeholder="Search Item..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<span className="input-group-text bg-warning">
						<i className="bi bi-search"></i>
					</span>
				</div>
			</div>
			<div className="row g-3 pe-2">
				{filteredItems.map((item) => (
					<div key={item.itemId} className="col-12">
						<div className="card p-3 bg-dark shadow">
							<div className="d-flex align-items-center">
								<div className="d-flex align-items-center w-100">
									<div className="d-flex w-75 justify-content-between">
										<div className="w-25" style={{ marginRight: "15px" }}>
											<img
												src={item.imgUrl}
												className="item-image"
												alt={item.name}
												width={50}
											/>
										</div>
										<div className="w-75 d-flex flex-column align-items-start">
											<h6 className="mb-1 text-white">{item.name}</h6>
											<p className="mb-0 text-white">
												Category: {item.categoryName}
											</p>
											<span className="mb-0 text-block badge rounded-pill text-bg-warning">
												&#8377;{item.price}
											</span>
										</div>
									</div>
									<div className="d-flex justify-content-end w-25">
										<button
											className="btn btn-danger btn-sm"
											onClick={() => deleteByItemId(item.itemId)}
										>
											<i className="bi bi-trash"></i>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
export default ItemsList;
