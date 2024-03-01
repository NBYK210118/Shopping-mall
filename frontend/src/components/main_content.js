import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth.context';

export default function MainContent() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const handleCategoryClick = (category) => {
    navigate(`/products/${category}`);
  };

  const Categories = () => {
    const items_dict = [
      { txt: '의류', category: 'clothes' },
      { txt: '전자제품', category: 'electronics' },
      { txt: '식품', category: 'foods' },
      { txt: '가구', category: 'furniture' },
    ];

    return items_dict.map((ctg, idx) => {
      return (
        <div
          key={idx}
          onClick={() => handleCategoryClick(ctg.category)}
          className="w-[24%] h-full border border-solid border-black flex flex-col hover:cursor-pointer hover:bg-sky-100"
        >
          <div className="h-[80%] border border-solid border-black"></div>
          <div className="h-[10%] flex justify-center items-center">
            <span className="">{ctg.txt}</span>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div id="main_content_1" className="w-[45vw] h-[50vh] flex flex-col justify-center">
        <div className="w-full h-[70%] flex flex-col justify-around">
          <div id="1_first_content" className="w-full h-[90%] flex justify-around items-center ">
            <Categories />
          </div>
          <div id="2_second_content" className="w-full h-[90%] flex justify-around items-center">
            <Categories />
          </div>
        </div>
      </div>
    </>
  );
}
