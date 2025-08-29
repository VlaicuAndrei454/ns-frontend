import React, { useState, useContext } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import { UserContext } from "../../context/UserContext";

const Navbar = ({ activeMenu }) => {
  const { currency, updateCurrency } = useContext(UserContext);
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="flex gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      <button
        className="block lg:hidden text-black"
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="text-2xl" />}
      </button>

      <h2 className="text-lg font-medium text-black">NeatSpend</h2>

      {/* Currency selector */}
      <select
        value={currency}
        onChange={(e) => updateCurrency(e.target.value)}
        className="ml-auto bg-transparent border border-gray-300 rounded px-2 py-1 text-sm"
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
        <option value="JPY">JPY</option>
        <option value="RON">RON</option>
      </select>

      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-white">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
