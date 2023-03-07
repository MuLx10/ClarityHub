import {
  useGlobalState,
  setGlobalState,
  setLoadingMsg,
  setAlert,
} from "../store";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { create } from "ipfs-http-client";
import { listNewItem } from "../utils/Wallet";

const auth =
  "Basic " +
  Buffer.from(
    process.env.REACT_APP_INFURIA_PID + ":" + process.env.REACT_APP_INFURIA_API
  ).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const CreateListing = () => {
  const [modal] = useGlobalState("modal");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [imgBase64, setImgBase64] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !description) return;

    setGlobalState("modal", "scale-0");
    setGlobalState("loading", { show: true, msg: "Uploading IPFS data..." });

    try {
      // const created = await client.add(fileUrl);
      // const metadataURI = "url"; //`https://ipfs.io/ipfs/${created.path}`;

      setLoadingMsg("Intializing transaction...");
      // setFileUrl(metadataURI);

      await listNewItem(title, description, price, fileUrl);

      resetForm();
      setAlert("Adding completed...", "green");
    } catch (error) {
      console.log("Error uploading file: ", error);
      setAlert("Adding failed...", "red");
    }
  };

  const changeImage = async (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);

    reader.onload = (readerEvent) => {
      const file = readerEvent.target.result;
      setImgBase64(file);
      setFileUrl(e.target.files[0]);
    };
  };

  const closeModal = () => {
    setGlobalState("modal", "scale-0");
    resetForm();
  };

  const resetForm = () => {
    setFileUrl("");
    setImgBase64(null);
    setTitle("");
    setPrice("");
    setDescription("");
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
        justify-center bg-black bg-opacity-50 transform
        transition-transform duration-300 ${modal}`}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#003B73] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <button
              type="button"
              onClick={closeModal}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          <div className="flex flex-row justify-center items-center rounded-xl mt-5">
            <div className="shrink-0 rounded-xl overflow-hidden w-40">
              <img
                alt="NFT"
                className="h-full w-full object-cover cursor-pointer"
                src={
                  imgBase64 || fileUrl ||
                  "https://www.prakashsales.in/ps_assets/images/goverment-emarketing-page-top-img.svg"
                }
              />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
              <span className="sr-only">Choose photo url</span> 
              {/* <input
                type="file"
                accept="image/png, image/gif, image/jpeg, image/webp"
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#19212c] file:text-gray-400
                  hover:file:bg-[#1d2631]
                  cursor-pointer focus:ring-0 focus:outline-none"
                onChange={changeImage}
                required
              /> */}
              <input
                className="block w-full text-sm
                  text-slate-500 bg-transparent border-0
                  focus:outline-none focus:ring-0"
                type="text"
                name="url"
                placeholder="URL"
                onChange={(e) => setFileUrl(e.target.value)}
                value={fileUrl}
                required
              />
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
              type="text"
              name="title"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
              type="number"
              step={0.01}
              min={0.01}
              name="price"
              placeholder="Price (STX)"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <textarea
              className="block w-full text-sm resize-none
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0 h-20"
              type="text"
              name="description"
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="flex flex-row justify-center items-center
              w-full text-white text-md bg-[#003B73]
              hover:bg-[#60A3D9] py-2 px-5 rounded-full
              drop-shadow-xl border border-transparent
              hover:bg-transparent hover:text-[#003B73]
              hover:border hover:border-[#60A3D9]
              focus:outline-none focus:ring mt-5"
          >
            Add Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
