import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  // Return null if no product data is available to prevent rendering errors
  if (!product) {
    return null;
  }

  const handleCardClick = () => {
    navigate(`/product/${product.category.toLowerCase()}/${product._id}`);
    window.scrollTo(0, 0);
  };

  // Prevent click event from bubbling up to the card when interacting with cart controls
  const handleCartInteraction = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="group relative w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-xl">
      {/* Product Image Section */}
      <div
        onClick={handleCardClick}
        className="relative h-60 w-full overflow-hidden cursor-pointer"
      >
        <img
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={`http://localhost:5001/images/${product.image[0]}`}
          alt={product.name}
        />
      </div>

      {/* Product Details Section */}
      <div onClick={handleCardClick} className="p-4 cursor-pointer">
        <span className="mb-2 inline-block rounded-full bg-[#dc9d9254] px-2 py-1 text-xs font-semibold text-[#c77e71]">
          {product.category}
        </span>
        <h3
          onClick={handleCardClick}
          className="truncate text-lg font-bold text-gray-800 cursor-pointer"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Ratings */}

        {/* Price and Cart Controls */}
        <div className="mt-0 flex items-center justify-between">
          <div className="mt-2 flex items-center">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <img
                  key={i}
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon} // Assuming 4-star rating
                  alt="rating star"
                  className="h-4 w-4"
                />
              ))}
            <span className="ml-2 text-sm text-gray-500">(120)</span>
          </div>
          {/* <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold text-[#c77e71]">
              ${product.offerPrice}
            </p>
            <p className="text-sm text-gray-400 line-through">
              ${product.price}
            </p>
          </div> */}

          <div onClick={handleCartInteraction}>
            {!cartItems?.[product._id] ? (
              // Add to cart button is now here
              <button
                onClick={() => addToCart(product._id)}
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#a45f53] px-4 text-sm font-medium text-white transition-colors hover:bg-[#c77e71]"
                aria-label="<%=Add to cart%>"
              >
                <img
                  src={assets.add_cart}
                  alt="Add to Cart"
                  className="w-5 h-5"
                />
                Add
              </button>
            ) : (
              // Quantity Selector for items in cart
              <div
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-gray-100 select-none px-4"
                onClick={() => {
                  return (
                    cartItems?.[product._id] && removeFromCart(product._id)
                  );
                }}
              >
                Remove
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
