import { useContext, useState } from "react";
import assets from "../../assets/assets";
import imageCompression from "browser-image-compression";
import { ContextApi } from "../../ContextApi/ContextApi";
import { addItem } from "../../ApiServices/ItemService";
import toast from "react-hot-toast";

const ManageItemsForm = () => {
	const { categories, setCategories, setItemsList } = useContext(ContextApi);
	const [image, setImage] = useState(false);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({
		name: "",
		categoryId: "",
		price: "",
		description: "",
	});

	const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

	const showError = (msg) => {
		toast.error(msg);
		setLoading(false);
	};

	const onSubmitHandler = async (e) => {
		e.preventDefault();
		setLoading(true);
		if (!image) {
			return showError("Please upload an image");
		}

		if (!data.name) {
			return showError("Item name is required");
		}

		if (!data.description) {
			return showError("Item description is required");
		}
		if (!data.categoryId) {
			return showError("Select the item category");
		}

		if (data.name.length < 2) {
			return showError("Item name is too short");
		}

		if (data.description.length <= 9) {
			return showError("Description should be at least 10 characters long");
		}

		if (data.description.length > 200) {
			return showError("Description should not exceed 200 characters");
		}

		if (data.price <= 0.0) {
			return showError("Price should be greater than 0.0");
		}
		if (image.size > MAX_IMAGE_SIZE) {
			return showError("Image size should not exceed 5MB");
		}

		const compressedImage = await imageCompression(image, {
			maxSizeMB: 1.5, // compress to ~1–2MB
			maxWidthOrHeight: 1200,
			useWebWorker: true,
		});

		const formData = new FormData();
		formData.append("image", compressedImage);
		formData.append(
			"data",
			new Blob([JSON.stringify(data)], { type: "application/json" }),
		);
		try {
			const response = await addItem(formData);
			if (response.status == 201) {
				setItemsList((prevState) => [...prevState, response.data]);
				setCategories((prevState) =>
					prevState.map((category) =>
						category.categoryId === data.categoryId
							? { ...category, itemsCount: category.itemsCount + 1 }
							: category,
					),
				);
				toast.success("Item added");
				setData({ name: "", categoryId: "", price: "", description: "" });
				setImage(false);
			} else {
				showError("Failed to add item");
			}
		} catch (error) {
			showError("Error adding item");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="items-form-container"
			style={{ height: "100vh", overflowY: "auto", overflowX: "hidden" }}
		>
			<div className="mx-2 mt-2">
				<div className="row">
					<div className="card col-md-8 form-container m-auto">
						<div className="card-body">
							<h5 className="card-title mb-0">Add New Item Details</h5>
							<form onSubmit={onSubmitHandler}>
								<div className="mb-1 mt-2">
									<label htmlFor="image" className="form-label">
										<img
											src={
												image ? URL.createObjectURL(image) : assets.uploadImg
											}
											alt="item-logo"
											width={85}
											height={70}
											className="img-fluid category-image"
										/>
									</label>
									<input
										cursor="pointer"
										onChange={(e) => setImage(e.target.files[0])}
										type="file"
										name="image"
										className="form-control"
										id="image"
										hidden
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="ItemName" className="form-label">
										Item Name
									</label>
									<input
										value={data.name}
										onChange={(e) => setData({ ...data, name: e.target.value })}
										type="text"
										name="ItemName"
										className="form-control"
										id="ItemName"
										placeholder="Enter the Item Name"
										required
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="category" className="form-label">
										Category
									</label>
									<select
										name="category"
										className="form-select"
										id="category"
										value={data.categoryId}
										onChange={(e) =>
											setData({ ...data, categoryId: e.target.value })
										}
										required
									>
										<option value="">--Select Category--</option>
										{categories.map((category) => (
											<option
												key={category.categoryId}
												value={category.categoryId}
											>
												{category.name}
											</option>
										))}
									</select>
								</div>
								<div className="mb-3">
									<label htmlFor="price" className="form-label">
										Price
									</label>
									<input
										value={data.price}
										onChange={(e) => {
											let val = e.target.value;

											// allow only digits and dot
											val = val.replace(/[^0-9.]/g, "");

											// allow only one decimal point
											const parts = val.split(".");
											if (parts.length > 2) {
												val = parts[0] + "." + parts.slice(1).join("");
											}

											// limit to 2 decimal places
											if (parts[1]?.length > 2) {
												val = parts[0] + "." + parts[1].slice(0, 2);
											}

											setData({ ...data, price: val });
										}}
										type="text"
										inputMode="decimal"
										name="price"
										className="form-control"
										id="price"
										placeholder="₹200.00"
										required
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="description" className="form-label">
										Description
									</label>
									<textarea
										value={data.description}
										onChange={(e) =>
											setData({ ...data, description: e.target.value })
										}
										rows="5"
										name="description"
										className="form-control"
										id="description"
										placeholder="Enter the Description"
										required
									></textarea>
								</div>
								<button
									type="submit"
									className="btn btn-warning w-100"
									disabled={loading}
								>
									{loading ? "Loading..." : "Add Item"}
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ManageItemsForm;
