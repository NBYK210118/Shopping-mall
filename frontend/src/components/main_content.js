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
      { txt: '의류', category: 'clothes', icon: <span class="material-symbols-outlined text-7xl">checkroom</span> },
      {
        txt: '전자제품',
        category: 'electronics',
        icon: <span class="material-symbols-outlined text-7xl">laptop_mac</span>,
      },
      { txt: '식품', category: 'foods', icon: <span class="material-symbols-outlined text-7xl">restaurant</span> },
      { txt: '가구', category: 'furniture', icon: <span class="material-symbols-outlined text-7xl">chair</span> },
    ];

    const Result = () => {
      return items_dict.map((ctg, idx) => {
        return (
          <div
            key={idx}
            onClick={() => handleCategoryClick(ctg.category)}
            className="w-[80px] h-[80px] miw-md:w-[200px] miw-md:h-[200px] miw-md:mr-2 box-border border border-solid border-black flex flex-col"
          >
            <div className="h-[80%] flex justify-center items-center border border-solid border-black hover:cursor-pointer hover:bg-sky-100 transition-all duration-300 hover:scale-[1.03]">
              {ctg.icon}
            </div>
            <div className="h-[20%] flex justify-center items-center">
              <span className="">{ctg.txt}</span>
            </div>
          </div>
        );
      });
    };

    return <Result />;
  };

  return (
    <>
      <div id="main_content" className="w-[90vw] h-[100vh] flex justify-between bg-gray-400">
        <div
          id="main_content_left_content"
          className="w-1/2 h-[21%] mw-md:w-[50%] mw-md:h-1/2 flex border border-solid border-black"
        >
          이전에 살펴보셨던 상품들
        </div>
        <div id="main_content_right_content" className="mw-md:w-[50%] h-1/2 flex flex-wrap justify-end">
          <Categories />
          <Categories />
        </div>
      </div>
    </>
  );
}
