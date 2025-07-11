import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { axios, user } = useContext(AppContext);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="mt-12 pb-16">
      <div>
        <p className="text-2xl md:text-3xl font-medium">My Orders</p>
      </div>

      {myOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16">
          <p className="text-xl text-gray-500 font-semibold">
            You haven't placed any orders yet!
          </p>
        </div>
      ) : null}

      {myOrders.map((order, index) => (
        <div
          key={index}
          className="my-8 border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
        >
          <div className="mb-4">
            <p className="text-gray-800 font-semibold">
              <span className="mr-2">Order ID:</span> {order._id}
            </p>
            <p className="text-gray-800 font-semibold">
              <span className="mr-2">Payment:</span> {order.paymentType}
            </p>
            <p className="text-gray-800 font-semibold">
              <span className="mr-2">Total Amount:</span> ${order.amount}
            </p>

            {/* ✅ Company Name and Description */}
            {order.companyName && (
              <>
                <p className="mt-2 text-[#a45f53] font-semibold">
                  Company Name: {order.companyName}
                </p>
                <p className="text-gray-600 italic">
                  {order.companyDescription}
                </p>
              </>
            )}

            {/* ✅ Contact Number */}
            {order.contactNumber && (
              <p className="text-gray-800 font-semibold">
                <span className="mr-2">Contact Number:</span> {order.contactNumber}
              </p>
            )}

            {/* ✅ Timeline */}
            {order.timeLine && (
              <p className="text-gray-800 font-semibold">
                <span className="mr-2">Timeline:</span> {order.timeLine}
              </p>
            )}
          </div>

          {order.items.map((item, idx) => (
            <div
              key={idx}
              className={`relative bg-white text-gray-800/70 ${
                order.items.length !== idx + 1 && "border-b"
              } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 w-full max-w-4xl`}
            >
              <div className="flex items-center mb-4 md:mb-0">
                <div className="p-4 rounded-lg">
                  <img
                    src={`http://localhost:5001/images/${item.product.image[0]}`}
                    alt=""
                    className="w-16 h-16"
                  />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-medium">{item.product.name}</h2>
                  <p>{item.product.category}</p>
                </div>
              </div>

              <div className="text-lg font-medium text-center md:text-left">
                <p>Quantity: {item.quantity || "1"}</p>
                <p>Status: {order.status}</p>
                <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
              </div>

              <p className="text-lg font-semibold text-center md:text-left">
                Amount: ${item.product.offerPrice * item.quantity}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
