import React, { useEffect, useRef, useState } from 'react';
import ProductApi from './product_api';

export const ProductInput = ({
  onAdd,
  onUpdate,
  activeOption,
  sellistIndex,
  token,
  navigate,
  currentProduct,
  setIsDiscountingPar,
}) => {
  const [productName, setProductName] = useState('');
  const [productDetail, setProductDetail] = useState('');
  const [productMaker, setProductMaker] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [inventory, setInventory] = useState('');
  const [statusInput, setStatusInput] = useState('판매중');
  const [productPrice, setProductPrice] = useState('');
  const [discountRatio, setDiscountRatio] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [isDiscounting, setIsDiscounting] = useState('');
  const priceInputRef = useRef();
  const discountPriceInputRef = useRef();

  useEffect(() => {
    if (activeOption === '상품 수정') {
      ProductApi.findProduct(token, sellistIndex, navigate).then((response) => {
        localStorage.setItem('product', JSON.stringify(response.data));
        setProductName(response.data?.name);
        setProductDetail(response.data?.description);
        setIsDiscounting(response.data?.isDiscounting);
        setDiscountPrice(response.data?.discountPrice);
        setDiscountRatio(response.data?.discountRatio);
        setProductPrice(response.data?.price);
        priceInputRef.current.value = response.data.price.toLocaleString('ko-kr');
        setProductMaker(response.data?.manufacturer);
        setCategoryInput(response.data?.category_name);
        setStatusInput(response.data?.status);
        setInventory(response.data?.inventory);
      });
    }
  }, []);

  useEffect(() => {
    if (activeOption === '상품 수정') {
      if (currentProduct) {
        console.log('currentProduct price: ', currentProduct.price);
        setProductName(currentProduct?.name);
        setProductDetail(currentProduct?.description);
        setProductPrice(currentProduct?.price);
        setIsDiscounting(currentProduct?.isDiscounting);
        setDiscountPrice(currentProduct?.discountPrice);
        setDiscountRatio(currentProduct?.discountRatio);
        setProductMaker(currentProduct?.manufacturer);
        setCategoryInput(currentProduct?.category_name);
        setStatusInput(currentProduct?.status);
        setInventory(currentProduct?.inventory);
      } else {
        setProductName('');
        setProductDetail('');
        setProductPrice('');
        setIsDiscounting(false);
        setDiscountPrice('');
        setDiscountRatio('');
        setProductMaker('');
        setCategoryInput('');
        setStatusInput('');
        setInventory(0);
      }
    }
  }, [currentProduct]);

  useEffect(() => {
    if (isDiscounting) {
      if (discountPrice) {
        discountPriceInputRef.current.value = discountPrice.toLocaleString('ko-kr');
      }
    }
  }, [discountPrice]);

  useEffect(() => {
    setIsDiscountingPar(isDiscounting);
  }, [isDiscounting]);

  const tempConvertPrice = (value) => {
    const price = Number(value.split(',').join(''));
    return price;
  };

  const handleAddBtn = (e) => {
    e.preventDefault();
    console.log('product add 호출');
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('detail', `${productDetail}`);
    formData.append('price', productPrice);
    formData.append('isDiscounting', isDiscounting);
    formData.append('discountPrice', discountPrice);
    formData.append('discountRatio', discountRatio);
    formData.append('manufacturer', productMaker);
    formData.append('category', categoryInput);
    formData.append('inventory', inventory);
    formData.append('status', statusInput);
    onAdd(formData, isDiscounting);
    setIsDiscounting(false);
  };

  const handleUpdateBtn = (e) => {
    e.preventDefault();
    console.log('product update 호출');
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('detail', `${productDetail}`);
    formData.append('price', productPrice);
    formData.append('isDiscounting', isDiscounting);
    formData.append('discountPrice', discountPrice);
    formData.append('discountRatio', discountRatio);
    formData.append('manufacturer', productMaker);
    formData.append('category', categoryInput);
    formData.append('inventory', inventory);
    formData.append('status', statusInput);

    setProductName('');
    setProductDetail('');
    setProductPrice('');
    setIsDiscounting(false);
    setDiscountPrice('');
    setDiscountRatio(0);
    setProductMaker('');
    setCategoryInput('');
    setInventory(0);
    setStatusInput('');
    onUpdate(formData, isDiscounting);
  };

  const handleDiscountChange = (e) => {
    setIsDiscounting(e.target.checked);
    if (!e.target.checked) {
      setDiscountRatio('');
      setDiscountPrice(productPrice);
    }
  };

  const handleDiscountRateChange = (e) => {
    const ratio = Number(e.target.value) / 100;
    const price = tempConvertPrice(productPrice.toLocaleString('ko-kr'));

    if (ratio >= 0 && ratio < 100) {
      const result = price - price * ratio.toFixed(1);
      const formatValue = result.toLocaleString('ko-kr');
      discountPriceInputRef.current.value = formatValue;
      setDiscountRatio(e.target.value);
      setDiscountPrice(formatValue);
    } else {
      alert('할인율은 1퍼센트부터 99퍼센트까지 가능합니다!');
    }
  };

  const handleDiscountedPriceChange = (e) => {
    // 현재 원가
    const origin_price = tempConvertPrice(productPrice.toLocaleString('ko-kr'));
    // 현재 할인가
    const discount_price = tempConvertPrice(e.target.value);
    const rate = ((origin_price - discount_price) / origin_price) * 100;

    let price = e.target.value;
    price = Number(price.replaceAll(',', ''));
    if (isNaN(price)) {
      discountPriceInputRef.current.value = 0;
    } else {
      const formatValue = price.toLocaleString('ko-kr');
      discountPriceInputRef.current.value = formatValue;
      setDiscountPrice(formatValue);
    }
    setDiscountRatio(rate.toFixed(0));
  };

  // 가격 사이사이에 Comma 를 붙여주는 코드
  const handlePriceComma = (e) => {
    let price = e.target.value;
    price = Number(price.replaceAll(',', ''));
    if (isNaN(price)) {
      priceInputRef.current.value = 0;
    } else {
      const formatValue = price.toLocaleString('ko-KR');
      priceInputRef.current.value = formatValue;
      setProductPrice(formatValue);
    }
  };

  return (
    <div className="max-w-4xl py-14 mw-md:max-w-xl mw-md:mx-0">
      <div className="bg-white w-[550px] rounded mb-4 -mt-10 mw-md:-mt-20">
        <div className="mb-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 mw-md:text-[0.7rem] mw-md:text-nowrap"
            for="product_name"
          >
            상품명
          </label>
          <input
            className="shadow appearance-none border rounded mw-md:w-auto py-2 px-3 mw-md:text-[0.5rem] text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
            id="product_name"
            type="text"
            placeholder="Enter your product name"
            value={productName}
            onChange={(e) => setProductName(e.currentTarget.value)}
          />
        </div>
        <div className="mb-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 mw-md:text-[0.7rem] mw-md:text-nowrap"
            for="product_detail"
          >
            상세설명
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full mw-md:w-auto mw-md:text-[0.5rem] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
            id="product_detail"
            placeholder="Enter the detail of the product"
            value={productDetail}
            onChange={(e) => setProductDetail(e.currentTarget.value)}
          ></textarea>
        </div>
        <div className="mb-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 mw-md:text-[0.7rem] mw-md:text-nowrap"
            for="product_price"
          >
            가격
          </label>
          <div className="flex items-center mb-0">
            <input
              className="shadow appearance-none border rounded w-[200px] text-right mw-md:w-auto mw-md:text-[0.5rem] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
              id="product_price"
              type="text"
              placeholder="Enter the price"
              ref={priceInputRef}
              onChange={(e) => handlePriceComma(e)}
            />
            <span className="ml-1 text-gray-700 text-sm font-bold">원</span>
          </div>
        </div>
        <div className="mb-2">
          <div className="flex">
            <label
              className="block text-gray-700 text-sm font-bold mr-1 mw-md:text-[0.7rem] mw-md:text-nowrap"
              for="product_price"
            >
              할인 적용
            </label>
            <input
              className="shadow mw-md:w-auto text-gray-700 focus:outline-none focus:shadow-outline"
              id="isDiscounting"
              type="checkbox"
              checked={isDiscounting}
              onChange={(e) => handleDiscountChange(e)}
            />
          </div>
        </div>
        {isDiscounting && (
          <>
            <div className="mb-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 mw-md:text-[0.7rem] mw-md:text-nowrap"
                for="add_label_discount_ratio"
              >
                할인율
              </label>
              <div className="flex items-center">
                <input
                  className="shadow appearance-none border rounded w-[200px] text-right mw-md:w-auto mw-md:text-[0.5rem] py-2 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                  id="add_discount_ratio"
                  type="number"
                  value={discountRatio}
                  onChange={(e) => handleDiscountRateChange(e)}
                />
                <span className="ml-1 text-gray-700 text-sm font-bold">%</span>
              </div>
            </div>
            <div className="mb-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 mw-md:text-[0.7rem] mw-md:text-nowrap"
                for="product_price"
              >
                할인가
              </label>
              <div className="flex items-center">
                <input
                  className="shadow appearance-none border rounded w-[200px] text-right mw-md:w-auto mw-md:text-[0.5rem] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
                  id="add_discount_price"
                  type="text"
                  ref={discountPriceInputRef}
                  onChange={(e) => handleDiscountedPriceChange(e)}
                />
                <span className="ml-1 text-gray-700 text-sm font-bold">원</span>
              </div>
            </div>
          </>
        )}
        <div className="mb-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 mw-md:text-[0.7rem] mw-md:text-nowrap"
            for="product_maker"
          >
            제조사/원산지
          </label>
          <input
            className="shadow appearance-none border rounded w-full mw-md:w-auto mw-md:text-[0.5rem] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
            id="product_maker"
            type="text"
            placeholder="Enter the manufacturer"
            value={productMaker}
            onChange={(e) => setProductMaker(e.currentTarget.value)}
          />
        </div>
        <div className="mb-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 mw-md:text-[0.7rem] mw-md:text-nowrap"
            for="categories"
          >
            카테고리
          </label>
          <select
            class="block appearance-none w-full mw-md:w-auto mw-md:text-[0.55rem] bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            id="categories"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.currentTarget.value)}
          >
            <option value="의류">의류</option>
            <option value="가구">가구</option>
            <option value="식품">식품</option>
            <option value="전자제품">전자제품</option>
            <option value="스포츠">스포츠</option>
            <option value="게임">게임</option>
            <option value="도서">도서</option>
            <option value="장난감">장난감</option>
          </select>
        </div>
        <div className="mb-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 mw-md:text-[0.7rem] mw-md:text-nowrap"
            for="inventory"
          >
            재고 수량
          </label>
          <input
            className="shadow appearance-none border rounded w-[200px] mw-md:w-auto mw-md:text-[0.5rem] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-400 hover:border-gray-500"
            id="inventory"
            type="text"
            placeholder="Enter the inventory quantity"
            value={inventory}
            onChange={(e) => setInventory(e.currentTarget.value)}
          />
        </div>
        <div className="mb-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 mw-md:text-[0.7rem] mw-md:text-nowrap"
            for="status"
          >
            판매 여부
          </label>
          <select
            className="block appearance-none w-full mw-md:w-auto mw-md:text-[0.5rem] bg-white border border-gray-400 hover:border-gray-700 hover:bg-gray-200 cursor-pointer px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            id="status"
            value={statusInput}
            onChange={(e) => setStatusInput(e.currentTarget.value)}
          >
            <option value="판매중">판매중</option>
            <option value="보류">보류</option>
          </select>
        </div>
        <div className="flex items-center justify-center mw-md:-ml-14">
          <button
            className="bg-blue-500 hover:bg-blue-700 mt-3 text-white font-bold py-2 px-10 mw-md:py-1 rounded focus:outline-none focus:shadow-outline transition-all duration-300"
            type="button"
            onClick={(e) => (activeOption === '상품 추가' ? handleAddBtn(e) : handleUpdateBtn(e))}
          >
            <span className="font-bold mw-md:text-[0.6rem] text-nowrap">제출</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductInput);
