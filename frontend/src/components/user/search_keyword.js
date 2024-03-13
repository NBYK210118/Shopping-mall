import React, { useState } from 'react';

const StoreSearchBar = ({ setKeyword }) => {
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setKeyword(searchKeyword, setSearchKeyword);
  };

  return (
    <div className="mb-10 mw-md:mb-3 mw-md:ml-10 mw-md:mt-0 flex justify-center items-center border border-transparent rounded-lg">
      <div id="search-box" className="flex justify-center items-center mr-5 mw-md:h-1/2 mw-md:ml-3">
        <form method="get" className="flex justify-center" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your search term"
            className="w-[350px] focus:w-[400px] mw-md:w-[170px] mw-md:focus:w-[230px] mw-md:pl-3 mw-md:-ml-10 text-[0.7rem] mw-md:text-[0.6rem] px-5 rounded-l-md outline-4 border border-gray-400 border-solid focus:border-gray-500 focus:outline-none transition-all duration-300"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button
            type="submit"
            className="mw-md:flex mw-md:items-center mw-md:p-1 px-2 bg-sky-400 text-white rounded-r-md border border-solid hover:bg-sky-600"
          >
            <span class="material-symbols-outlined text-center mt-1">search</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default React.memo(StoreSearchBar);
