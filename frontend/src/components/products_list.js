import { Route, Routes } from "react-router-dom";
import { Clothes } from "./products/clothes";
import { Electronics } from "./products/electronics";
import { Foods } from "./products/foods";
import { Furniture } from "./products/furniture";

export function Products(props) {
  return (
    <div
      id="products_main"
      className="w-[100%] h-[110%] flex justify-center relative"
    >
      <div
        id="products_container"
        className="w-[100%] h-[100%] absolute top-28"
      >
        <Routes>
          <Route path="clothes" element={<Clothes />}></Route>
          <Route path="electronics" element={<Electronics />}></Route>
          <Route path="foods" element={<Foods />}></Route>
          <Route path="furniture" element={<Furniture />}></Route>
        </Routes>
      </div>
    </div>
  );
}
