import timelessLogo from "../assets/timeless.png";
import { useGlobalState, truncate } from "../store";
import { connectWallet } from "../utils/Wallet";

const Header = () => {
  const [connectedAccount] = useGlobalState("connectedAccount");
  return (
    <nav className="w-4/5 flex md:justify-center justify-between items-center py-4 mx-auto">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img
          className="w-16 cursor-pointer"
          src={timelessLogo}
          alt="Timeless Logo"
        />
      </div>

      <ul
        className="md:flex-[0.5] text-white md:flex
        hidden list-none flex-row justify-between 
        items-center flex-initial mr-9"
      >
        <li className="mx-4 cursor-pointer">Market</li>
        <li className="mx-4 cursor-pointer">Transactions</li>
        <li className="mx-4 cursor-pointer">Features</li>
        <li className="mx-4 cursor-pointer">Community</li>
      </ul>

      {connectedAccount ? (
        <>
          <button
            className="shadow-xl shadow-black text-white
        bg-[#e3297077] hover:bg-[#bd255f77] md:text-s p-3
          rounded-full cursor-pointer"
          >
            {truncate(connectedAccount, 4, 4, 11)}
          </button>
        </>
      ) : (
        <button
          className="shadow-xl shadow-black text-white
        bg-[#e32970] hover:bg-[#bd255f] md:text-xs p-2
          rounded-full cursor-pointer"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </nav>
  );
};

export default Header;