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
    totalCartAmount,
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
    setTimeLine
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [address, setAddress] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

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

  const getAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddress(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      getAddress();
    }
  }, [user]);

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }
      if (!companyName || !companyDescription || !contactNumber || !timeLine) {
        return toast.error("Please fill all company information fields");
      }
      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
          companyName,
          companyDescription,
          contactNumber,
          timeLine,
        });

        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      } else if (paymentOption === "Online") {
        toast.error("Online payment is not implemented yet.");
      }
    } catch (error) {
      toast.error(error.message);
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
                    <p className="text-lg font-bold text-gray-800">
                      ${(product.offerPrice * product.quantity).toFixed(2)}
                    </p>
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

                  {/* Address Section */}
            <div className="mb-4">
              <h3 className="text-md font-semibold text-gray-700 uppercase mb-2">
                Delivery Address
              </h3>
              <div className="relative p-3 bg-gray-100 rounded-lg">
                <p className="text-gray-600 text-sm pr-16">
                  {selectedAddress
                    ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}`
                    : "No address selected"}
                </p>
                <button
                  onClick={() => setShowAddress(!showAddress)}
                  className="absolute top-3 right-3 text-sm text-[#a45f53] font-semibold hover:underline"
                >
                  Change
                </button>
                {showAddress && (
                  <div className="absolute z-10 top-full mt-2 w-full bg-white border rounded-lg shadow-lg py-1">
                    {address.map((addr) => (
                      <p
                        key={addr._id}
                        onClick={() => {
                          setSelectedAddress(addr);
                          setShowAddress(false);
                        }}
                        className="text-gray-600 text-sm p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {addr.street}, {addr.city}, {addr.state}
                      </p>
                    ))}
                    <p
                      onClick={() => navigate("/add-address")}
                      className="text-[#a45f53] text-center cursor-pointer p-2 hover:bg-[#a45f53]/10"
                    >
                      Add address
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="mb-4">
              <h3 className="text-md font-semibold text-gray-700 uppercase mb-2">
                Payment Method
              </h3>
              <select
                onChange={(e) => setPaymentOption(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#a45f53]"
              >
                <option value="COD">Cash On Delivery</option>
                <option value="Online">Online Payment</option>
              </select>
            </div>

            <hr className="my-4" />

            <div className="space-y-2 text-gray-600">
              <p className="flex justify-between">
                <span>Subtotal</span>{" "}
                <span className="font-medium">
                  ${totalCartAmount().toFixed(2)}
                </span>
              </p>
              <p className="flex justify-between">
                <span>Shipping Fee</span>{" "}
                <span className="font-medium text-green-600">Free</span>
              </p>
              <p className="flex justify-between">
                <span>Tax (2%)</span>{" "}
                <span className="font-medium">
                  ${(totalCartAmount() * 0.02).toFixed(2)}
                </span>
              </p>
              <hr className="my-2" />
              <p className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>{" "}
                <span>${(totalCartAmount() * 1.02).toFixed(2)}</span>
              </p>
            </div>

            <button
              onClick={placeOrder}
              className="w-full mt-6 py-3 bg-[#a45f53] text-white font-bold rounded-lg hover:bg-[#c77e71] transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-[#a45f53]/50"
            >
              {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
