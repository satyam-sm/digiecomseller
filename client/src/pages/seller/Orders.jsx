import { useContext, useEffect, useState } from "react";
import { AppContext, useAppContext } from "../../context/AppContext";
import { assets, dummyOrders } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const boxIcon =
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg";

  const [orders, setOrders] = useState([]);
  const { axios } = useContext(AppContext);
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="md:p-10 p-4 space-y-4">
      <h2 className="text-lg font-medium">Orders List</h2>
      {orders.map((order, index) => (
        <div
          key={index}
          className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-6xl rounded-md border border-gray-300 text-gray-800"
        >
          <div className="flex gap-5">
            <img
              className="w-12 h-12 object-cover opacity-60"
              src={`http://localhost:5001/images/${order.items[0].product.image[0]}`}
              alt="boxIcon"
            />
            <>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex flex-col justify-center">
                  <p className="font-medium">
                    {item.product.name}{" "}
                    <span
                      className={`text-[#a45f53] ${
                        item.quantity < 2 && "hidden"
                      }`}
                    >
                      x {item.quantity}
                    </span>
                  </p>
                </div>
              ))}
            </>
          </div>

           <div className="flex flex-col text-sm">
            <p>
              <span className="font-medium">Company Name:</span>{" "}
              {order.companyName || "-"}
            </p>
            <p>
              <span className="font-medium">Description:</span>{" "}
              {order.companyDescription || "-"}
            </p>
          </div>

          <div className="flex flex-col text-sm">
            <p>
              <span className="font-medium">Contact Number:</span>{" "}
              {order.contactNumber || "-"}
            </p>
          </div>

          <div className="flex flex-col text-sm">
            <p>
              <span className="font-medium">Timeline:</span>{" "}
              {order.timeLine ? new Date(order.timeLine).toLocaleDateString() : "-"}
            </p>
          </div>

          <div className="flex flex-col text-sm">
            <p>Method: {order.paymentType}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
            <p>Status: {order.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Orders;
