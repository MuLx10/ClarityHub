import clarityHubLogo from "../assets/timeless.png";
import { useGlobalState, truncate } from "../store";
import { connectWallet } from "../utils/Wallet";

const Header = () => {
  const [connectedAccount] = useGlobalState("connectedAccount");
  return (
    <nav className="w-4/5 flex md:justify-center justify-between items-center py-4 mx-auto">
      <div className="md:flex-[0.5] flex-initial justify-center ">
        <div className="flex align-center items-center">
        <img
          className="w-12 h-12 cursor-pointer"
          src={clarityHubLogo}
          alt="Clarity Logo"
        />
        <h1 className="text-white text-3xl m-3">
            Clarity<b>Hub</b>
          </h1>
        </div>
          
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
        bg-[#003B73] hover:bg-[#60A3D9] md:text-s p-3
          rounded-full cursor-pointer"
          >
            {truncate(connectedAccount, 4, 4, 11)}
          </button>
        </>
      ) : (
        <button
          className="shadow-xl shadow-black text-white
        bg-[#003B73] hover:bg-[#60A3D9] md:text-xs p-2
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
