import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [company, setCompany] = useState("AMZ");
  const [category, setCategory] = useState("Phone");
  const [sort, setSort] = useState("price");
  const [order, setOrder] = useState("asc");

  const companyNames = ["AMZ", "FLP", "SNP", "MYN", "AZO"];
  const categoryNames = [
    "Phone",
    "Computer",
    "TV",
    "Earphone",
    "Tablet",
    "Charger",
    "Mouse",
    "Keypad",
    "Bluetooth",
    "Pendrive",
    "Remote",
    "Speaker",
    "Headset",
    "Laptop",
    "PC",
  ];

  const fetchToken = async () => {
    try {
      const response = await axios.post("http://20.244.56.144/test/auth",{
    companyName: 'goMart',
    clientID: 'd16c360a-877f-40e2-b3a6-ffe6e646172b',
    clientSecret: 'SJTspgSPZkdjTUqK',
    ownerName: 'Initha Murugesan',
    ownerEmail: '927621bit035@mkce.ac.in',
    rollNo: '927621bit035'
  });
      return response.data.access_token;
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = await fetchToken();
      const response = await axios.get(
        `http://20.244.56.144/test/companies/${company}/categories/${category}/products`,
        {
          params: { top: 10, minPrice, maxPrice },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const sortProducts = (products, sortBy, sortOrder) => {
    return [...products].sort((a, b) => {
      if (sortBy === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      } else if (sortBy === "rating") {
        return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
      } else if (sortBy === "discount") {
        return sortOrder === "asc"
          ? a.discount - b.discount
          : b.discount - a.discount;
      }
    });
  };

  const handleSort = () => {
    setProducts(sortProducts(products, sort, order));
  };

  useEffect(() => {
    fetchProducts();
  }, [company, category, minPrice, maxPrice]);

  return (
    <div className="p-4">
      <div className="flex flex-col space-y-4">
        <Select
          label="Select Company:"
          value={company}
          onChange={setCompany}
          options={companyNames}
        />
        <Select
          label="Select Category:"
          value={category}
          onChange={setCategory}
          options={categoryNames}
        />
        <Input label="Min Price:" value={minPrice} onChange={setMinPrice} />
        <Input label="Max Price:" value={maxPrice} onChange={setMaxPrice} />
        <button className="bg-blue-400 p-2 text-white" onClick={fetchProducts}>
          Fetch Products
        </button>
      </div>

      {products.length > 0 && (
        <>
          <div className="flex space-x-4 my-4">
            <Select
              label="Sort By:"
              value={sort}
              onChange={setSort}
              options={["price", "rating", "discount"]}
            />
            <Select
              label="Order:"
              value={order}
              onChange={setOrder}
              options={["asc", "desc"]}
            />
            <button
              className="bg-indigo-400 p-2 text-white"
              onClick={handleSort}
            >
              Sort
            </button>
          </div>
          <h1 className="text-2xl font-bold p-4">
            Top Products from {company} in {category}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Select = ({ label, value, onChange, options }) => (
  <label>
    {label}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="ml-2"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

const Input = ({ label, value, onChange }) => (
  <label>
    {label}
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="ml-2"
    />
  </label>
);

const ProductCard = ({ product }) => (
  <div className="border p-4 shadow-md">
    <img src={"https://picsum.photos/id/1/200/300"} alt="" />
    <h1>{product.productName}</h1>
    <h2>Price: ${product.price}</h2>
    <h3>Rating: {product.rating}</h3>
    <h4>Discount: {product.discount}%</h4>
    <h5>
      Availability:{" "}
      {product.availability === "yes" ? "In Stock" : "Out of Stock"}
    </h5>
  </div>
);

export default App;
