import { useContext, useState } from "react";
import "./ExploreDisplayCartSummary.css";
import { ContextApi } from "../../ContextApi/ContextApi";
import ReceiptPopup from "../ReceiptPopup/ReceiptPopup";
import { createOrder, deleteOrder } from "../../ApiServices/OrderService";
import toast from "react-hot-toast";
import {
	createRazorpayOrder,
	verifyPayment,
} from "../../ApiServices/PaymentService";
import { AppConstants } from "../../util/constants";

const ExploreDisplayCartSummary = ({
	customerName,
	setCustomerName,
	mobileNumber,
	setMobileNumber,
}) => {
	const { cartItems, clearCart } = useContext(ContextApi);
	const [processingMethod, setProcessingMethod] = useState(null);
	const [orderDetails, setOrderDetails] = useState(null);
	const [showPopup, setPopup] = useState(false);
	const totalAmount = cartItems.reduce(
		(total, item) => total + item.price * item.quantity,
		0,
	);
	const tax = Number((totalAmount * 0.01).toFixed(2));
	const grandTotal = Number((totalAmount + tax).toFixed(2));

	const loadRazorpayScript = () => {
		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.onload = () => resolve(true);
			script.onerror = () => resolve(false);
			document.body.appendChild(script);
		});
	};

	const deleteOrderOnFailure = async (orderId) => {
		try {
			await deleteOrder(orderId);
		} catch (error) {
			console.log("Payment error", error);
			toast.error("Something went wrong");
		}
	};

	const clearAll = () => {
		setCustomerName("");
		setMobileNumber("");
		clearCart();
		setPopup(false);
	};

	const placeOrder = () => {
		setPopup(true);
	};

	const handlePrintReceipt = () => {
		clearAll();
		window.print();
	};
	const completePayment = async (paymentMethod) => {
		if (!customerName || !mobileNumber) {
			toast.error("Please Enter Customer Details");
			return;
		}
		if (cartItems.length === 0) {
			toast.error("Your Cart is Empty");
			return;
		}
		setProcessingMethod(paymentMethod.toUpperCase());
		const itemsInCart = cartItems.map((each) => ({
			itemId: each.itemId,
			name: each.name,
			price: each.price,
			quantity: each.quantity,
		}));
		const orderData = {
			customerName: customerName,
			mobileNumber: mobileNumber,
			cartItems: itemsInCart,
			subtotal: totalAmount,
			tax,
			grandTotal,
			paymentMethod: paymentMethod.toUpperCase(),
		};
		try {
			const apiResponse = await createOrder(orderData);
			const savedOrder = apiResponse.data;
			if (
				apiResponse.status === 201 &&
				paymentMethod.toUpperCase() === "CASH"
			) {
				toast.success("Cash received");
				setOrderDetails(apiResponse.data);
			} else if (
				apiResponse.status === 201 &&
				paymentMethod.toUpperCase() === "UPI"
			) {
				const razorpayLoaded = await loadRazorpayScript();
				if (!razorpayLoaded) {
					toast.error("Unable to load razorpay");
					await deleteOrderOnFailure(savedOrder.orderId);
					return;
				}

				const razorpayResponse = await createRazorpayOrder({
					amount: grandTotal,
					currency: "INR",
				});

				if (!razorpayResponse?.data?.id) {
					toast.error("Failed to initiate payment");
					await deleteOrderOnFailure(savedOrder.orderId);
					setIsProcessing(false);
					return;
				}

				const options = {
					key: AppConstants.RAZORPAY_KEY_ID,
					amount: razorpayResponse.data.amount,
					currency: razorpayResponse.data.currency,
					order_id: razorpayResponse.data.id,
					name: "My Retail Shop",
					description: "Order Payment",
					handler: async function (response) {
						await verifyPaymentHandler(response, savedOrder);
					},
					prefill: {
						name: customerName,
						contact: mobileNumber,
					},
					theme: {
						color: "#3399cc",
					},
					modal: {
						ondismiss: async () => {
							await deleteOrderOnFailure(savedOrder.orderId);
							toast.error("Payment Cancelled");
						},
					},
				};
				const rzp = new window.Razorpay(options);
				rzp.on("payment failed", async (response) => {
					await deleteOrderOnFailure(savedOrder.orderId);
					toast.error("Payment failed");
					console.error(response.error.description);
				});
				rzp.open();
			}
		} catch (error) {
			console.log("Order add error", error);
			toast.error("Payment Processing failed");
		} finally {
			setProcessingMethod(null);
		}
	};

	const verifyPaymentHandler = async (response, savedOrder) => {
		const paymentData = {
			razorpayOrderId: response.razorpay_order_id,
			razorpayPaymentId: response.razorpay_payment_id,
			razorpaySignature: response.razorpay_signature,
			orderId: savedOrder.orderId,
		};
		try {
			const paymentResponse = await verifyPayment(paymentData);
			if (paymentResponse.status === 200) {
				toast.success("Payment successful 🎉");
				setOrderDetails({
					...savedOrder,
					paymentDetails: {
						razorpayOrderId: response.razorpay_order_id,
						razorpayPaymentId: response.razorpay_payment_id,
						razorpaySignature: response.razorpay_signature,
					},
				});
			} else {
				toast.error("Payment Processing failed");
			}
		} catch (error) {
			toast.error("Payment error");
		}
	};

	console.log(orderDetails);
	console.log(processingMethod);

	return (
		<div className="mt-2">
			<div className="cart-summary-details">
				<div className="d-flex justify-content-between mb-2">
					<span className="text-light">Item:</span>
					<span className="text-light">₹{totalAmount.toFixed(2)}</span>
				</div>
				<div className="d-flex justify-content-between mb-2">
					<span className="text-light">Tax(1%):</span>
					<span className="text-light">₹{tax.toFixed(2)}</span>
				</div>
				<div className="d-flex justify-content-between mb-4">
					<span className="text-light">Total:</span>
					<span className="text-light">₹{grandTotal.toFixed(2)}</span>
				</div>
			</div>
			<div className="d-flex gap-3">
				<button
					className="btn btn-success flex-grow-1"
					onClick={() => completePayment("CASH")}
					disabled={cartItems.length === 0 || orderDetails !== null}
				>
					{processingMethod === "CASH" ? "Processing.." : "Cash"}
				</button>

				<button
					className="btn btn-primary flex-grow-1"
					onClick={() => completePayment("UPI")}
					disabled={cartItems.length === 0 || orderDetails !== null}
				>
					{processingMethod === "UPI" ? "Processing.." : "UPI"}
				</button>
			</div>
			<div className="d-flex gap-3 mt-3">
				<button
					className="btn btn-warning flex-grow-1"
					onClick={placeOrder}
					disabled={orderDetails === null}
				>
					Place Order
				</button>
			</div>
			{showPopup && (
				<ReceiptPopup
					orderDetails={{
						...orderDetails,
						razorpayOrderId: orderDetails.paymentDetails?.razorpayOrderId,
						razorpayPaymentId: orderDetails.paymentDetails?.razorpayPaymentId,
					}}
					onClose={() => setPopup(false)}
					onPrint={handlePrintReceipt}
				/>
			)}
		</div>
	);
};

export default ExploreDisplayCartSummary;
