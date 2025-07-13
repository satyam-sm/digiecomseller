import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";

const Cart = () => {
  const {
    products,
    navigate,
    cartCount,
    cartItems,
    setCartItems,
    removeFromCart,
    user,
    companyName,
    setCompanyName,
    companyDescription,
    setCompanyDescription,
    contactNumber,
    setContactNumber,
    timeLine,
    setTimeLine,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((product) => product._id === key);
      if (product) {
        product.quantity = cartItems[key];
        tempArray.push(product);
      }
    }
    setCartArray(tempArray);
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  const placeOrder = async () => {
    try {
      console.log("Placing order with data:", {
        items: cartArray.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        companyName,
        companyDescription,
        contactNumber,
        timeLine,
      });

      if (!companyName || !companyDescription || !contactNumber || !timeLine) {
        return toast.error("Please fill all company information fields");
      }

      if (cartArray.length === 0) {
        return toast.error("Cart is empty");
      }

      const { data } = await axios.post("/api/order/cod", {
        items: cartArray.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        companyName,
        companyDescription,
        contactNumber,
        timeLine,
      });

      console.log("Order response:", data);

      if (data.success) {
        toast.success(data.message);
        setCartItems({});
        navigate("/my-orders");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Place order error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || error.message || "Failed to place order");
    }
  };

  if (!cartArray.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-gray-500 mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-[#a45f53] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#c77e71] transition-colors duration-300 flex items-center gap-2"
        >
          <FaArrowLeft />
          <span>Continue Shopping</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-baseline mb-6 border-b pb-4">
              <h1 className="text-3xl font-bold text-gray-800">
                Shopping Cart
              </h1>
              <span className="text-lg font-medium text-[#a45f53]">
                {cartCount()} Items
              </span>
            </div>

            <div className="space-y-6">
              {cartArray.map((product) => (
                <div
                  key={product._id}
                  className="flex flex-col sm:flex-row items-center gap-4 border-b pb-6 last:border-b-0"
                >
                  <img
                    onClick={() =>
                      navigate(`product/${product.category}/${product._id}`)
                    }
                    className="w-28 h-28 object-cover rounded-lg cursor-pointer border"
                    src={`http://localhost:5001/images/${product.image[0]}`}
                    alt={product.name}
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-lg font-semibold text-gray-800">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Weight: {product.weight || "N/A"}
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Qty:</span>{" "}
                        {product.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      aria-label={`Remove ${product.name} from cart`}
                    >
                      <FaTrashAlt size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/products")}
              className="group cursor-pointer flex items-center mt-8 gap-2 text-[#a45f53] font-medium hover:text-[#c77e71] transition-colors"
            >
              <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
              Continue Shopping
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow-md h-fit">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">
              Order Summary
            </h2>

            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-700 uppercase mb-2">
                Company Information
              </h3>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your Company Name"
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a45f53]"
              />
              <textarea
                rows="4"
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                placeholder="Description about your company..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a45f53]"
              ></textarea>
              <input
                type="number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Contact Number"
                className="w-full p-2 mt-4 border border-gray-300 rounded-lg"
              />
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                Time line for this project
              </label>
              <input
                type="date"
                value={timeLine}
                onChange={(e) => setTimeLine(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              onClick={placeOrder}
              className="w-full mt-3 py-3 bg-[#a45f53] text-white font-bold rounded-lg hover:bg-[#c77e71] transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-[#a45f53]/50"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
