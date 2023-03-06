import { useEffect, useState } from "react";
// import { getAllNFTs, isWallectConnected } from './Wallet'
import Alert from "./components/Alert";
import Artworks from "./components/Artworks";
import CreateNFT from "./components/CreateNFT";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Loading from "./components/Loading";
import ShowNFT from "./components/ShowNFT";
// import Transactions from './components/Transactions'
// import UpdateNFT from './components/UpdateNFT'
import {
  AppConfig,
  UserSession,
  showConnect,
  openContractCall,
} from "@stacks/connect";
import { setGlobalState } from "./store";

const App = () => {
  useEffect(async () => {}, []);

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
