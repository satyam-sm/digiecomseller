import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

// Components
import ProductCard from "../components/ProductCard";

// It's good practice to create a dedicated Star component for reusability.
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-2 text-sm text-gray-600">({rating} Reviews)</span>
    </div>
  );
};

const SingleProduct = () => {
  const { products, navigate, addToCart } = useAppContext();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Effect to find and set the current product
  useEffect(() => {
    const foundProduct = products.find((p) => p._id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setThumbnail(foundProduct.image?.[0] || null);
    } else {
      // Optional: handle case where product is not found, e.g., navigate to a 404 page
      // navigate('/not-found');
    }
  }, [id, products]);

  // Effect to find related products
  useEffect(() => {
    if (product && products.length > 0) {
      const related = products.filter(
        // Corrected logic: find products in the same category but exclude the current one
        (p) => p.category === product.category && p._id !== product._id
      );
      setRelatedProducts(related.slice(0, 5)); // Show up to 5 related products
    }
  }, [product, products]);

  if (!product) {
    // Display a loading state or a "not found" message
    return <div className="text-center py-20">Loading product...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-[#c77e71]">
          Home
        </Link>{" "}
        /
        <Link to="/products" className="hover:text-[#c77e71]">
          {" "}
          Products
        </Link>{" "}
        /
        <Link
          to={`/products/${product.category.toLowerCase()}`}
          className="hover:text-[#c77e71]"
        >
          {" "}
          {product.category}
        </Link>{" "}
        /<span className="text-gray-800 font-medium"> {product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Image Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-3 justify-center md:justify-start">
            {product.image.map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  thumbnail === image
                    ? "border-[#a45f53] shadow-md"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={`http://localhost:5001/images/${image}`}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="flex-1 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            <img
              src={`http://localhost:5001/images/${thumbnail}`}
              alt="Selected product"
              className="w-full h-full object-contain aspect-square"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>

          <div className="mt-3">
            <StarRating rating={product.rating} />
          </div>

          <div className="mt-6">
            <span className="text-gray-500 line-through text-lg">
              ${product.price}
            </span>
            <p className="text-4xl font-extrabold text-[#c77e71] ml-2 inline-block">
              ${product.offerPrice}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              (inclusive of all taxes)
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800">
              About this item
            </h2>
            <ul className="list-disc ml-5 mt-2 space-y-2 text-gray-600">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto pt-8 flex items-center gap-4">
            <button
              onClick={() => addToCart(product._id)}
              className="w-full py-4 text-base font-semibold rounded-lg bg-indigo-100 text-[#d99386] hover:bg-indigo-200 transition-colors duration-300"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product._id);
                navigate("/cart");
                window.scrollTo(0, 0);
              }}
              className="w-full py-4 text-base font-semibold rounded-lg bg-[#c77e71] text-white hover:bg-[#d99386] transition-colors duration-300 shadow-md"
            >
              Buy Now
            </button>
          </div>
        </div>
        <div className="text-gray-700 whitespace-pre-line">
          {product.detailedDescription
            ? product.detailedDescription
            : "No detailed description available for this product."}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Related Products
            </h2>
            <div className="w-24 h-1 bg-[#a45f53] mx-auto mt-3 rounded-full"></div>
          </div>

          <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 items-center justify-center">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => {
                navigate("/products");
                window.scrollTo(0, 0);
              }}
              className="px-8 py-3 text-base font-semibold rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-300"
            >
              View All Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
