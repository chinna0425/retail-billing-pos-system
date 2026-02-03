import { useContext, useState } from "react";
import imageCompression from "browser-image-compression";
import "./ManageCategoriesForm.css";
import assets from "../../assets/assets.js";
import toast from "react-hot-toast";
import { ContextApi } from "../../ContextApi/ContextApi";

import { addCategory } from "../../ApiServices/CategoryService.js";

const ManageCategoriesForm = () => {
	const [loading, setLoading] = useState(false);
	const [image, setImage] = useState(false);
	const [data, setData] = useState({
		name: "",
		description: "",
	});

	const { categories, setCategories } = useContext(ContextApi);

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
			return showError("Category name is required");
		}

		if (!data.description) {
			return showError("Category description is required");
		}

		if (data.name.length < 3) {
			return showError("Category name is too short");
		}

		if (data.description.length < 10) {
			return showError("Description should be at least 10 characters long");
		}

		if (data.description.length > 200) {
			return showError("Description should not exceed 200 characters");
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
			const response = await addCategory(formData);
			if (response.status == 201) {
				setCategories([...categories, response.data]);
				toast.success("Category added");
				setData({ name: "", description: "" });
				setImage(false);
			} else {
				showError("Failed to add category");
			}
		} catch (error) {
			showError("Error adding category");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-2 m-auto">
			<div className="row">
				<div className="card col-md-9 form-container m-auto">
					<div className="card-body">
						<h5 className="card-title">Add New Category</h5>
						<form onSubmit={onSubmitHandler}>
							<div className="mb-2">
								<label htmlFor="image" className="form-label">
									Upload Image
									<br />
									<img
										src={image ? URL.createObjectURL(image) : assets.uploadImg}
										alt="categoryImg"
										width={85}
										height={70}
									/>
								</label>
								<input
									type="file"
									name="image"
									className="form-control"
									id="image"
									hidden
									cursor="pointer"
									onChange={(e) => setImage(e.target.files[0])}
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="categoryName" className="form-label">
									Category Name
								</label>
								<input
									type="text"
									name="categoryname"
									className="form-control"
									id="categoryName"
									placeholder="Enter the Category Name"
									required
									value={data.name}
									onChange={(e) => setData({ ...data, name: e.target.value })}
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="description" className="form-label">
									Description
								</label>
								<textarea
									rows="5"
									name="description"
									className="form-control"
									id="description"
									placeholder="Enter the Description"
									required
									value={data.description}
									onChange={(e) =>
										setData({ ...data, description: e.target.value })
									}
								></textarea>
							</div>
							<button
								type="submit"
								disabled={loading}
								className="btn btn-warning w-100"
							>
								{loading ? "loading..." : "Add Category"}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ManageCategoriesForm;
