import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// Test endpoint to verify order creation
export const testOrderCreation = async (req, res) => {
  try {
    console.log("Testing order creation...");
    
    const testOrder = await Order.create({
      userId: "test-user-id",
      items: [
        {
          product: "test-product-id",
          quantity: 1,
        }
      ],
      companyName: "Test Company",
      companyDescription: "Test Description",
      contactNumber: 1234567890,
      timeLine: new Date(),
      paymentType: "COD",
      isPaid: false,
    });
    
    console.log("Test order created:", testOrder);
    res.status(200).json({ success: true, message: "Test order created", order: testOrder });
  } catch (error) {
    console.error("Test order creation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Place order COD: /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    console.log("Received order request:", req.body);
    console.log("User ID:", req.user);
    
    const userId = req.user || req.body.userId; // Use req.user if available, otherwise fallback to body
    if (!userId) {  
      console.error("User ID is missing in the request");
      return res.status(400).json({ message: "User ID is required", success: false });
    }
    console.log("User ID for order:", userId);
    const { items, companyName, companyDescription, contactNumber, timeLine } = req.body;
    
    if (!items || items.length === 0) {
      console.log("No items in order");
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }

    if (!companyName || !companyDescription || !contactNumber || !timeLine) {
      console.log("Missing required fields:", { companyName, companyDescription, contactNumber, timeLine });
      return res
        .status(400)
        .json({ message: "Please fill all company information fields", success: false });
    }

    const orderData = {
      userId,
      items,
      companyName,
      companyDescription,
      contactNumber: Number(contactNumber),
      timeLine: new Date(timeLine),
      paymentType: "COD",
      isPaid: false,
    };

    console.log("Creating order with data:", orderData);

    const newOrder = await Order.create(orderData);
    console.log("Order created successfully:", newOrder._id);
    
    res
      .status(201)
      .json({ message: "Order placed successfully", success: true, orderId: newOrder._id });
  } catch (error) {
    console.error("Order creation error:", error);
    console.error("Error details:", error.message);
    res.status(500).json({ message: "Internal Server Error", success: false, error: error.message });
  }
};

// order details for individual user :/api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get all orders for admin :/api/order/all
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
