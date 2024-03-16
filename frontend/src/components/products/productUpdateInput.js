// import React from 'react';

// export const ProductUpdateInput = ({ onUpdate }) => {

//   return (
//     <>
//       <div className="max-w-4xl mx-20 py-14 mw-md:max-w-xl mw-md:-ml-8 mw-md:-mt-12">
//         <div className="bg-white rounded px-8 mb-4 -mt-10 mw-md:-mt-20">
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" for="product_name">
//               상품명
//             </label>
//             <input
//               className="shadow appearance-none border rounded w-auto mw-md:text-[0.5rem] px-4 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
//               id="product_name"
//               type="text"
//               placeholder="Enter your product name"
//               onChange={(e) => setProductName(e.currentTarget.value)}
//               value={productName}
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" for="product_detail">
//               상세설명
//             </label>
//             <textarea
//               className="shadow appearance-none border rounded w-auto mw-md:text-[0.5rem] px-4 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
//               id="product_detail"
//               placeholder="Enter the detail of the product"
//               onChange={(e) => setProductDetail(e.currentTarget.value)}
//               value={productDetail}
//             ></textarea>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" for="product_price">
//               가격
//             </label>
//             <input
//               className="shadow appearance-none border rounded w-auto mw-md:text-[0.5rem] px-4 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
//               id="product_price"
//               type="text"
//               placeholder="Enter the price"
//               ref={priceInputRef}
//               onChange={(e) => handlePriceComma(e)}
//               value={productPrice}
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" for="product_maker">
//               판매자
//             </label>
//             <input
//               className="shadow appearance-none border rounded w-auto mw-md:text-[0.5rem] px-4 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
//               id="product_maker"
//               type="text"
//               placeholder="Enter the manufacturer"
//               onChange={(e) => setProductMaker(e.currentTarget.value)}
//               value={productMaker}
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" for="categories">
//               카테고리
//             </label>
//             <select
//               class="block appearance-none w-auto mw-md:text-[0.5rem] bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
//               id="categories"
//               onChange={(e) => setCategoryInput(e.target.value)}
//               value={categoryInput}
//             >
//               <option value="의류">의류</option>
//               <option value="가구">가구</option>
//               <option value="식품">식품</option>
//               <option value="전자제품">전자제품</option>
//               <option value="스포츠">스포츠</option>
//               <option value="게임">게임</option>
//               <option value="도서">도서</option>
//               <option value="장난감">장난감</option>
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" for="inventory">
//               재고 수량
//             </label>
//             <input
//               className="shadow appearance-none border rounded w-auto mw-md:text-[0.5rem] px-4 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
//               id="inventory"
//               type="text"
//               placeholder="Enter the inventory quantity"
//               onChange={(e) => setInventory(e.currentTarget.value)}
//               value={inventory}
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" for="status">
//               판매 여부
//             </label>
//             <select
//               className="block appearance-none w-auto mw-md:text-[0.5rem] bg-white border border-gray-400 hover:border-gray-700 hover:bg-gray-200 cursor-pointer py-2 px-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
//               id="status"
//               onChange={(e) => setStatusInput(e.currentTarget.value)}
//               value={statusInput}
//             >
//               <option>판매중</option>
//               <option>보류</option>
//             </select>
//           </div>
//           <div className="flex items-center justify-center -ml-32 mw-md:-ml-16">
//             <button
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded focus:outline-none focus:shadow-outline transition-all duration-300"
//               type="button"
//               onClick={(e) => handleUpdateBtn(e)}
//             >
//               <span className="font-bold mw-md:text-[0.7rem] text-nowrap">제출</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default React.memo(ProductUpdateInput);
