import React, { useState } from 'react';
import { useAuth } from '../../auth.context';

export const ProfileInput = ({ onProfile }) => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [store, setStore] = useState(`${user['store'] ? user['store']['name'] : 'None'}`);
  const [phoneNumber, setPhoneNumber] = useState(
    user['profile']['phoneNumber'] ? user['profile']['phoneNumber'] : '입력해주세요'
  );
  const [address, setAddress] = useState(`${user['profile'] ? user['profile']['address'] : 'None'}`);
  const [editClick, setEditClick] = useState(false);

  const submitProfileInput = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('phoneNumber', phoneNumber);
    formData.append('store', store);
    formData.append('address', address);
    onProfile(formData, setEditClick);
  };

  return (
    <div className="p-6 space-y-4 mw-md:p-2 mw-md:mb-5">
      {editClick ? (
        // Show input fields when in edit mode
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex items-center justify-between">
            <label className="text-gray-700 mw-md:text-[0.75rem]">First Name</label>
            <input
              className="border border-gray-300 rounded p-2 mw-md:text-[0.75rem]"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-700 mw-md:text-[0.75rem]">Last Name</label>
            <input
              className="border border-gray-300 rounded p-2 mw-md:text-[0.75rem]"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-700 mw-md:text-[0.75rem]">Phone</label>
            <input
              className="border border-gray-300 rounded p-2 mw-md:text-[0.75rem]"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-700 mw-md:text-[0.75rem]">Store</label>
            <input
              className="border border-gray-300 rounded p-2 mw-md:text-[0.75rem]"
              type="text"
              value={store}
              onChange={(e) => setStore(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-gray-700 mw-md:text-[0.75rem]">Address</label>
            <input
              className="border border-gray-300 rounded p-2 mw-md:text-[0.75rem]"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
            onClick={(e) => submitProfileInput(e)}
          >
            Submit
          </button>
        </form>
      ) : (
        // Display non-editable information when not in edit mode
        <>
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-700 mw-md:text-[0.85rem]">First Name</span>
            <span className="text-gray-900 mw-md:text-[0.75rem]">{firstName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-700 mw-md:text-[0.85rem]">Last Name</span>
            <span className="text-gray-900 mw-md:text-[0.75rem]">{lastName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-700 mw-md:text-[0.85rem]">Phone</span>
            <span className="text-gray-900 mw-md:text-[0.75rem]">{phoneNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-700 mw-md:text-[0.85rem]">Store</span>
            <span className="text-gray-900 mw-md:text-[0.75rem]">{store}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-700 mw-md:text-[0.85rem]">Address</span>
            <span className="text-gray-900 mw-md:text-[0.75rem]">{address}</span>
          </div>
        </>
      )}
      <button
        className={`w-full bg-green-500 hover:bg-green-600 text-white text-xl mw-md:text-sm font-bold py-2 px-4 rounded shadow-lg focus:outline-none focus:shadow-outline ${
          editClick ? 'hidden' : ''
        }`}
        onClick={() => setEditClick(!editClick)}
      >
        Edit
      </button>
    </div>
  );
};

export default React.memo(ProfileInput);
