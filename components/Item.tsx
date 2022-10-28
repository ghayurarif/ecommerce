import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faShoppingCart,
  faShoppingBag,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import {
  faStar as faStarOutline,
  faHeart as faHeartOutline,
} from "@fortawesome/free-regular-svg-icons";
import type itemType from "../interface/item";
import ItemExtened from "./ItemExtened";
interface Props {
  item: itemType;
}
interface RatingsProp {
  ratings: number;
}
const Ratings: React.FC<RatingsProp> = ({ ratings }) => {
  const item = [];
  for (let i = 1; i !== 6; i++) {
    const classname = i < ratings ? "text-yellow-300" : "text-grey-600";
    item.push(
      <FontAwesomeIcon
        icon={i < ratings ? faStar : faStarOutline}
        key={Math.random()}
        className={classname}
      />
    );
  }
  return <div className="">{item}</div>;
};
const Item: React.FC<Props> = ({ item }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const description = item.description.substring(0, 200);
  function closePopup() {
    setIsOpen(false);
  }
  return (
    <>
      <ItemExtened item={item} isOpen={isOpen} closePopup={closePopup} />
      <div className="max-w-sm rounded overflow-hidden shadow-lg mx-4 my-5 relative z-0">
        <div className="absolute right-1 top-1 px-2 py-1 rounded-full bg-white">
          <FontAwesomeIcon icon={faHeartOutline} className="text-pink-600" />
        </div>
        <img
          className="w-full"
          src={item.image}
          alt="Sunset in the mountains"
        />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{item.title}</div>
          <p className="text-gray-700 text-base">{description + "..."}</p>
        </div>
        <div className="px-6 flex justify-between">
          <span className="text-sm">Price: ${Math.floor(item.price)}</span>
          <div className="flex">
            <Ratings ratings={item.rating} />
          </div>
        </div>
        <div className="flex justify-between px-6 mt-2 mb-5">
          <button className="bg-green-700 py-1 px-2 rounded-md">
            <FontAwesomeIcon icon={faShoppingCart} className="text-white" />
            <span className="text-sm mx-1 text-white">Add</span>
          </button>
          <button
            className="bg-purple-700 py-1 px-2 rounded-md"
            onClick={() => setIsOpen((i) => !i)}
          >
            <FontAwesomeIcon icon={faShoppingBag} className="text-white" />
            <span className="text-sm mx-1 text-white">Buy</span>
          </button>
        </div>
      </div>
    </>
  );
};
export default Item;