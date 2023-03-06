import Identicon from "react-identicons";
import { setGlobalState, useGlobalState, truncate } from "../store";
import {
  getConversations,
  loginWithCometChat,
  signUpWithCometChat,
} from "../utils/CometChat";
import ChatList from "./ChatList";
import { useState } from "react";
import { getItemsForSale } from "../utils/Wallet";

const Hero = () => {
  const [connectedAccount] = useGlobalState("connectedAccount");
  const [currentUser] = useGlobalState("currentUser");
  const [recentOpened] = useGlobalState("recentOpened");
  const [conversations, setConversations] = useState([]);

  const onCreatedNFT = () => {
    setGlobalState("modal", "scale-100");
  };

  const onLaunchRecent = () => {
    if (currentUser?.uid.toLowerCase() != connectedAccount.toLowerCase())
      return alert("Please login to receive chats from buyers!");

    getConversations().then((convs) => {
      setConversations(convs);
      setGlobalState("recentOpened", true);
    });
  };

  return (
    <div
      className="flex flex-col md:flex-row w-4/5 justify-between 
      items-center mx-auto py-10"
    >
      <div className="md:w-3/6 w-full">
        <div>
          <h1 className="text-white text-5xl font-bold">
            Buy and Sell <br /> Products & Services <br />
            {/* <span className="text-gradient">NFTs</span> Collections */}
          </h1>
          <p className="text-gray-500 font-semibold text-sm mt-3">
            Sell and purchase anything and everything around.
          </p>
        </div>

        <div className="flex flex-row mt-5">
          {connectedAccount ? (
            <>
              <button
                className="shadow-xl shadow-black text-white
                bg-[#e32970] hover:bg-[#bd255f]
                rounded-full cursor-pointer p-2"
                onClick={onCreatedNFT}
              >
                Create Listing
              </button>
              <>
                {currentUser?.uid.toLowerCase() ==
                connectedAccount.toLowerCase() ? (
                  <button
                    className="text-white border border-gray-500 
                    hover:border-[#e32970] hover:bg-[#bd255f] cursor-pointer 
                    rounded-full p-2 mx-3"
                    onClick={onLaunchRecent}
                  >
                    Recent Chats
                  </button>
                ) : (
                  <>
                    <button
                      className="text-white border border-gray-500 
                    hover:border-[#e32970] hover:bg-[#bd255f] cursor-pointer 
                    rounded-full p-2 mx-3"
                      onClick={() => loginWithCometChat(connectedAccount)}
                    >
                      Login for Chat
                    </button>
                    <button
                      className="text-white border border-gray-500 
                    hover:border-[#e32970] hover:bg-[#bd255f] cursor-pointer 
                    rounded-full p-2 mx-3"
                      onClick={() =>
                        signUpWithCometChat(connectedAccount, connectedAccount)
                      }
                    >
                      Signup for Chat
                    </button>
                  </>
                )}
              </>
            </>
          ) : null}
        </div>

        <div className="w-3/4 flex justify-between items-center mt-5">
          <div>
            <p className="text-white font-bold">1231k</p>
            <small className="text-gray-300">User</small>
          </div>
          <div>
            <p className="text-white font-bold">152k</p>
            <small className="text-gray-300">Product</small>
          </div>
          <div>
            <p className="text-white font-bold">200k</p>
            <small className="text-gray-300">Transactions</small>
          </div>
        </div>
      </div>

      <div
        className="shadow-xl shadow-black md:w-2/5 w-full 
      mt-10 md:mt-0 rounded-md overflow-hidden bg-gray-800"
      >
        <img
          src="https://images.cointelegraph.com/images/1434_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS91cGxvYWRzLzIwMjEtMDYvNGE4NmNmOWQtODM2Mi00YmVhLThiMzctZDEyODAxNjUxZTE1LmpwZWc=.jpg"
          alt="NFT Art"
          className="h-60 w-full object-cover"
        />
        <div className="flex justify-start items-center p-3">
          <Identicon
            string={
              connectedAccount
                ? connectedAccount.toLowerCase()
                : "Connect Your Wallet"
            }
            size={50}
            className="h-10 w-10 object-contain rounded-full mr-3"
          />
          <div>
            <p className="text-white font-semibold">
              {connectedAccount
                ? truncate(connectedAccount, 4, 4, 11)
                : "Connect Your Wallet"}
            </p>
            <small className="text-pink-800 font-bold">@you</small>
          </div>
        </div>
      </div>

      {recentOpened ? <ChatList users={conversations} /> : null}
    </div>
  );
};

export default Hero;
