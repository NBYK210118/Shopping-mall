import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../auth.context";

export default function MainContent() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const handleCategoryClick = (category) => {
    navigate(`/products/${category}`);
  };

  const Categories = () => {
    const items_dict = [
      { txt: "의류", category: "clothes" },
      { txt: "전자제품", category: "electronics" },
      { txt: "식품", category: "foods" },
      { txt: "가구", category: "furniture" },
    ];

    return items_dict.map((ctg, idx) => {
      return (
        <div
          key={idx}
          onClick={() => handleCategoryClick(ctg.category)}
          className="w-[22%] h-[100%] border border-solid border-black rounded-lg flex justify-center items-center hover:cursor-pointer hover:bg-sky-100"
        >
          <span className="">{ctg.txt}</span>
        </div>
      );
    });
  };

  const Containers = () => {
    return (
      <div className="w-full h-[85%] flex justify-center">
        <div className="w-full h-full ml-5 mr-5 flex flex-row justify-center items-center border border-solid border-black rounded-md bg-gray-50"></div>
      </div>
    );
  };

  return (
    <>
      <div
        id="main_content_1"
        className="w-[90%] h-full flex flex-col justify-center mb-5 absolute top-24"
      >
        <div
          id="1_first_content"
          className="w-full h-full flex justify-around items-center bg-gray-300"
        >
          <Categories />
        </div>
        <div
          id="2_second_content"
          className="w-full h-full flex justify-center items-center bg-gray-300"
        >
          <Containers />
        </div>
      </div>
    </>
  );
}
