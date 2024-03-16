import { useEffect, useState } from 'react';
import ProductApi from './product_api';
import { useAuth } from '../../auth.context';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComments,
  faEdit,
  faGear,
  faHeart,
  faMoneyBillWave,
  faShoppingCart,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as fablankStar } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

export const ProductDetail = () => {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isCurrentUserProduct, setIsCurrentUsersProduct] = useState(null);
  const { token, user, navigate, setLoading, setClickedSellingProduct } = useAuth();
  const [currentComment, setCurrentComment] = useState(null);
  const [currentStars, setCurrentStars] = useState(5);
  const [fetchStars, setFetchStars] = useState(null);
  const [fetchComment, setFetchComment] = useState(null);
  const [userLiked, setUserLiked] = useState(false);
  const [currentUserReview, setCurrentUserReview] = useState(null);
  const [currentLikesCount, setCurrentLikesCount] = useState(0);
  // createOrEdit 리뷰 제출했을 때 사용할 state 변수 true 이면 edit 상태, false 이면 create 상태
  const [createOrEdit, setCreateOrEdit] = useState(true);
  const [cReviewStars, setCReviewStars] = useState({
    first: false,
    second: false,
    third: false,
    fourth: false,
    fifth: false,
  });
  let { productId } = useParams();

  // 상품 리스트에서 상품을 클릭했을 때 로드됨
  useEffect(() => {
    setLoading(true);
    console.log(productId);
    ProductApi.findProduct(token, productId, navigate).then((response) => {
      if (response && response.data) {
        setCurrentProduct(response.data);
        setUserLiked(response.data.likedBy.some((val) => val.userId === user.id));
        setCurrentLikesCount(response.data.likedBy.length);

        // 회원이 상품을 봤을 때와 게스트가 상품을 봤을 때
        if (user) {
          const formData = new FormData();
          formData.append('productId', productId);
          ProductApi.userViewed(token, formData, navigate).then((response) => {
            if (response && response.data) {
              console.log('user watched result: ', response.data);
            }
          });
          if (response.data.reviews.length > 0) {
            const review = response.data.reviews.filter((val) => val.userId === user.id);
            if (review[0]) {
              setCurrentUserReview(review[0]);
              setFetchStars(review[0].stars);
              setFetchComment(review[0].txt);
            }
          }
        } else {
          const formData = new FormData();
          formData.append('productId', productId);
          ProductApi.guestViewed(formData, navigate).then((response) => {
            if (response && response.data) {
              console.log('guest watched Product result: ', response.data);
            }
          });
        }
      }
    });
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    ProductApi.isUsersProduct(token, productId, navigate).then((response) => {
      setIsCurrentUsersProduct(response.data);
    });
  }, [currentUserReview]);

  // 리뷰 제출 버튼 클릭시 실행
  const handleProductReview = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('productId', productId);
    formdata.append('review', currentComment);
    formdata.append('stars', currentStars);

    setLoading(true);
    ProductApi.updateReview(token, formdata, navigate).then((response) => {
      if (response && response.data) {
        console.log('response 도착:', response.data);
        setFetchStars(response.data.stars);
        setFetchComment(response.data.txt);
        setCurrentUserReview(response.data);
      }
    });
    setLoading(false);
    setCreateOrEdit(true);
  };

  // 좋아요 버튼 관리
  const handleLikedBtn = () => {
    setUserLiked(!userLiked);
    const data = {};
    data[productId] = !userLiked;
    const formData = new FormData();
    formData.append('likes', JSON.stringify(data));
    ProductApi.updatelikeProduct(token, formData, navigate).then((response) => {
      console.log('좋아요 버튼 클릭 후: ', response.data);
    });
    ProductApi.findProduct(token, productId, navigate).then((response) => {
      if (response && response.data) {
        console.log(response.data);
        setCurrentLikesCount(response.data.likedBy.length);
      }
    });
  };

  const ProductStars = () => {
    return Array(5).fill(
      <span className="ml-1">
        <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-[1.2rem] mw-md:text-[0.7rem]" />
      </span>
    );
  };

  // 클릭한 별의 위치에 따라 별점 주기 기능
  const handleCReviewStars = (val) => {
    setCReviewStars((prevState) => {
      const newState = { ...prevState };
      const keyArray = Object.keys(prevState);
      const howManyFilled = keyArray.indexOf(val);

      for (const _ of keyArray) {
        if (newState[val]) {
          for (const key of keyArray.slice(0, howManyFilled + 1)) {
            newState[key] = false;
          }
        } else {
          for (const key of keyArray.slice(0, howManyFilled + 1)) {
            newState[key] = true;
          }
        }
      }

      return newState;
    });
  };

  // 설정 아이콘 클릭 -> 해당 상품 정보 수정을 위해 PersonalStore 로 이동
  const handleClickGear = () => {
    setClickedSellingProduct(Number(productId));
    navigate(`/user/my-store`);
  };

  // 별표 갯수가 확정되고 별점이 몇 점인지 state로 저장해주기
  useEffect(() => {
    console.log('cReviewStars: ', cReviewStars);
    setCurrentStars(() => {
      return Object.keys(cReviewStars).filter((val) => cReviewStars[val] === true).length;
    });
  }, [cReviewStars]);

  // 별점이 몇 점인지 체크
  useEffect(() => {
    console.log('createOrEdit: ', createOrEdit);
  }, [createOrEdit]);

  // 리뷰 작성칸의 별점들
  const CreateReviewStars = (val) => {
    const data = ['first', 'second', 'third', 'fourth', 'fifth'];
    return data.map((val) => (
      <span className="ml-1">
        <FontAwesomeIcon
          key={val}
          icon={cReviewStars[val] ? faStar : fablankStar}
          className="text-yellow-400 text-[1.2rem] mw-md:text-[0.9rem] cursor-pointer"
          onClick={() => handleCReviewStars(val)}
        />
      </span>
    ));
  };

  // 샘플 리뷰에 넣을 별점 컴포넌트 그리고 edit 버튼 클릭해서 별점과 텍스트 수정 가능
  const ReviewStars = ({ product_stars }) => {
    const cnt = product_stars ? product_stars : 5;
    return Array(cnt).fill(
      <span className="ml-1">
        <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-[1.2rem] mw-md:text-[0.9rem]" />
      </span>
    );
  };

  const ItemInfo = () => {
    if (currentProduct) {
      return (
        <div id="product_entire_wrapper" className="flex justify-center mw-md:h-4/5">
          <div id="product_info" className="w-[60%] mw-md:w-[80%] h-3/5 mt-10 my-auto flex justify-between">
            <img
              src={
                currentProduct.images
                  ? currentProduct.images[0].imgUrl
                  : `https://source.unsplash.com/random/200x200?product`
              }
              alt=""
              className="w-[30%] h-[420px] mw-md:w-[65%] mw-md:h-auto rounded"
            />
            <div className="w-1/2 mw-md:w-1/2 mw-md:h-auto flex flex-col justify-around p-4 bg-gray-200 rounded">
              <div className="flex justify-between items-center">
                <span className="text-[0.8rem] mw-md:text-[0.7rem] mw-md:mb-4 mw-md:-ml-[1px] ml-1 text-blue-500 hover:underline hover:cursor-pointer">
                  {currentProduct.manufacturer ? `${currentProduct.manufacturer}` : 'Failed to load manufacturer'}
                </span>
                {isCurrentUserProduct && (
                  <span className="mw-md:text-xs mw-md:mb-5 cursor-pointer" onClick={() => handleClickGear()}>
                    <FontAwesomeIcon icon={faGear} />
                  </span>
                )}
              </div>
              <div className="flex items-center -mt-5 mw-md:flex-wrap mw-md:flex-col mw-md:items-start">
                <span className="font-bold miw-lg:text-[1.6rem] mw-md:text-[0.9rem]">
                  {currentProduct && currentProduct.name}
                </span>
                <div className="hidden mw-md:flex mw-md:-ml-1">
                  <ProductStars />
                </div>
              </div>
              <span className="font-semibold miw-lg:text-[1.2rem]">
                {currentProduct.price ? currentProduct.price.toLocaleString('ko-kr') : 'Failed to load price'}원
              </span>
              <span className="mb-10 mw-md:mb-0 mw-md:text-[0.7rem]">
                {currentProduct.description || currentProduct.description === ''
                  ? `상세정보: ${currentProduct.description}`
                  : 'Failed to load description'}
              </span>
              <span className="mw-md:text-[0.7rem]">
                <b>판매자:</b> {user ? user.profile.nickname : "Failed to load seller's name"}
              </span>
              <div className="flex justify-end mt-3 mw-md:flex-col mw-md:text-nowrap mw-md:mt-2">
                <span
                  className="text-center miw-lg:px-2 miw-lg:text-[0.7rem] text-nowrap py-2 mx-2 mw-md:mb-2 flex justify-center items-center bg-blue-500 hover:bg-blue-600 trasition-all duration-150 rounded cursor-pointer"
                  onClick={() => handleLikedBtn()}
                >
                  <FontAwesomeIcon
                    icon={userLiked ? faHeart : faHeartRegular}
                    className="text-red-500 mr-1 hover:-translate-y-1"
                  />
                  <b className="text-white mw-md:text-[0.6rem]">{currentLikesCount} 좋아요</b>
                </span>
                <span className="text-center text-nowrap miw-lg:px-2 miw-lg:text-[0.7rem] py-2 mx-2 mw-md:mb-2 bg-black hover:bg-black/70 trasition-all duration-150 text-white font-bold rounded cursor-pointer mw-md:text-[0.6rem] ">
                  <FontAwesomeIcon icon={faMoneyBillWave} className="mr-1" />
                  <b className="mw-md:text-[0.6rem]">구매하기</b>
                </span>
                <span className="text-center text-nowrap miw-lg:px-2 miw-lg:text-[0.7rem] mw-md:w-20 py-2 mx-2 mw-md:mb-2 mw-md:flex mw-md:justify-center mw-md:items-center bg-green-600 hover:bg-green-700 trasition-all duration-150 rounded cursor-pointer mw-md:text-[0.6rem]">
                  <FontAwesomeIcon icon={faShoppingCart} className="text-white mr-1" />
                  <b className="text-white">장바구니</b>
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div>Product Not Found</div>;
    }
  };

  const Reviews = () => {
    return (
      <div id="review_1_wrapper" className="p-5 mb-5 bg-white shadow border border-gray-300 rounded">
        <div id="reviewed_user_info_1" className="flex -mt-2 mw-md:-ml-4">
          <span className="material-symbols-outlined text-7xl mw-md:text-6xl -mt-2">account_circle</span>
          <div className="flex flex-col">
            <span className="ml-1 miw-lg:text-lg font-bold">User Name</span>
            <div className="flex">
              <ReviewStars />
            </div>
          </div>
        </div>
        <div id="user_comment_1" className="flex items-center p-2 ml-2 mw-md:-ml-4 mw-md:pb-1">
          <span className="">상품의 상태가 매우 좋습니다.</span>
        </div>
      </div>
    );
  };

  const UserAlreadyReviewed = () => {
    if (currentUserReview) {
      return (
        <div
          id="create_review_wrapper"
          className="p-5 mw-md:w-full mw-md:px-0 mw-md:py-7 bg-white shadow border border-gray-300 rounded mb-5"
        >
          <div id="reviewed_user_info_1" className="flex -mt-4 mw-md:ml-2">
            {user.profile.imageUrl ? (
              <img src={user.profile.imageUrl} alt="user_profile" className="w-[72px] h-[72px] rounded-full" />
            ) : (
              <span className="material-symbols-outlined text-7xl mw-md:text-6xl -mt-1">account_circle</span>
            )}

            <div className="flex flex-col mt-1">
              {/* 사용자 닉네임과 Edit 버튼 */}
              <div className="flex items-center ml-1">
                <span className="mx-1 block miw-lg:text-lg font-bold">
                  {user ? user.profile.nickname : 'Failed to load NickName'}
                </span>
                <FontAwesomeIcon
                  icon={faEdit}
                  className="cursor-pointer hover:bg-gray-200 p-1 rounded"
                  onClick={() => setCreateOrEdit(!createOrEdit)}
                />
              </div>
              {/* 사용자가 남겼던 별점 */}
              <span className="block miw-lg:text-lg">
                {Array(fetchStars).fill(
                  <FontAwesomeIcon
                    icon={faStar}
                    className="text-yellow-400 text-[1.2rem] mw-md:text-[0.9rem] cursor-pointer px-1"
                  />
                )}
              </span>
            </div>
          </div>
          {/* 사용자 리뷰 텍스트 */}
          <div id="user_comment_1" className="flex items-end p-2 mt-1 border border-gray-300 rounded">
            <span className="">{fetchComment ? fetchComment : 'Failed to loaded'}</span>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <div
        id={`product_detail_container_${productId}`}
        className="w-[90%] mw-md:w-full h-full mt-10 border border-gray-300 mw-md:ml-0 mw-md:border-none mw-md:mb-20"
      >
        <ItemInfo />
        <div id="product_reviews" className="w-3/5 h-2/5 mw-md:w-[85%] mw-md:ml-9  flex flex-col mt-10 mx-auto">
          {user ? (
            isCurrentUserProduct ? (
              ''
            ) : currentUserReview ? (
              createOrEdit ? (
                <UserAlreadyReviewed />
              ) : (
                <div
                  id="create_review_wrapper"
                  className="p-5 mw-md:w-full mw-md:px-0 mw-md:py-7 bg-white shadow border border-gray-300 rounded mb-5"
                >
                  <div id="reviewed_user_info_1" className="flex -mt-4 mw-md:ml-2">
                    <span className="material-symbols-outlined text-7xl mw-md:text-6xl -mt-1">account_circle</span>
                    <div className="flex flex-col mt-1">
                      <span className="ml-1 block miw-lg:text-lg font-bold">
                        {user ? user.profile.nickname : 'Failed to load NickName'}
                      </span>
                      <span className="block miw-lg:text-lg">
                        <CreateReviewStars />
                      </span>
                    </div>
                  </div>
                  <div id="user_comment_1" className="flex items-end p-2">
                    <form className="w-full flex items-end p-2 ml-2">
                      <input
                        type="text"
                        className="focus:outline-none shadow px-[17px] py-[20px] mw-md:px-[12px] mw-md:py-[10px] w-[90%] border border-gray-200 focus:border-gray-400 placeholder:mw-md:text-[0.8rem]"
                        value={currentComment}
                        onChange={(e) => setCurrentComment(e.target.value)}
                        placeholder="How was ths quality of the product?"
                      />
                      <button
                        className="px-[17px] py-[21px] mw-md:px-[12px] mw-md:py-[10px] bg-blue-500 rounded-r-lg text-white font-bold hover:bg-blue-600 transition-all duration-150"
                        onClick={(e) => handleProductReview(e)}
                      >
                        <FontAwesomeIcon icon={faComments} />
                      </button>
                    </form>
                  </div>
                </div>
              )
            ) : (
              <div
                id="create_review_wrapper"
                className="p-5 mw-md:w-full mw-md:px-0 mw-md:py-7 bg-white shadow border border-gray-300 rounded mb-5"
              >
                <div id="reviewed_user_info_1" className="flex -mt-4 mw-md:ml-2">
                  <span className="material-symbols-outlined text-7xl mw-md:text-6xl -mt-1">account_circle</span>
                  <div className="flex flex-col mt-1">
                    <span className="ml-1 block miw-lg:text-lg font-bold">
                      {user ? user.profile.nickname : 'Failed to load NickName'}
                    </span>
                    <span className="block miw-lg:text-lg">
                      <CreateReviewStars />
                    </span>
                  </div>
                </div>
                <div id="user_comment_1" className="flex items-end p-2">
                  <form className="w-full flex items-end p-2 ml-2">
                    <input
                      type="text"
                      className="focus:outline-none shadow px-[17px] py-[20px] mw-md:px-[12px] mw-md:py-[10px] w-[90%] border border-gray-200 focus:border-gray-400 placeholder:mw-md:text-[0.8rem]"
                      onChange={(e) => setCurrentComment(e.target.value)}
                      placeholder="How was ths quality of the product?"
                    />
                    <button
                      className="px-[17px] py-[21px] mw-md:px-[12px] mw-md:py-[10px] bg-blue-500 rounded-r-lg text-white font-bold hover:bg-blue-600 transition-all duration-150"
                      onClick={(e) => handleProductReview(e)}
                    >
                      <FontAwesomeIcon icon={faComments} />
                    </button>
                  </form>
                </div>
              </div>
            )
          ) : (
            ''
          )}

          <Reviews />
          <div
            id="review_1_wrapper"
            className="h-60 p-5 mb-5 flex items-center bg-white shadow border border-gray-300 rounded"
          >
            <img src="https://via.placeholder.com/1024x192" alt="" className="h-full" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
