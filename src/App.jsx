import { useEffect } from "react";
// import { getAllNFTs, isWallectConnected } from './Wallet'
import Alert from "./components/Alert";
import Artworks from "./components/Artworks";
import CreateNFT from "./components/CreateNFT";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Loading from "./components/Loading";
import ShowNFT from "./components/ShowNFT";
// import Transactions from './components/Transactions'
// import { initContract } from "./utils/Wallet";

const App = () => {
  useEffect(() => {}, []);

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-hero">
        <Header />
        <Hero />
      </div>
      <Artworks />
      {/* <Transactions /> */}
      <CreateNFT />
      <ShowNFT />
      {/* <UpdateNFT /> */}
      {/* <Footer /> */}
      <Alert />
      <Loading />
    </div>
  );
};

export default App;
