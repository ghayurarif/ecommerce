import type { NextPage } from "next";
import Head from "next/head";
import mongoose from "mongoose";
import cartModel from "../../models/cart";
import type cart from "../../interface/cart";
import type { NextPageContext } from "next/";
import userModel from "../../models/user";
import type user from "../../interface/user";
import Header from "../../components/Header";
import { useState } from "react";
import CartItem from "../../components/CartItem";
import type item from "../../interface/item";
import order from "../../interface/order";
interface Props {
  user: user;
  cart: cart;
}
const Cart: NextPage<Props> = ({ user, cart }) => {
  const [_cart, setCart] = useState(cart);
  async function removeItem(item: { item: item; quantity: number }) {
    const { quantity } = _cart.items.filter(
      (el) => el.item._id === item.item._id
    )[0];
    const { price } = _cart.items.filter(
      (el) => el.item._id === item.item._id
    )[0].item;
    const newItems = _cart.items.filter((el) => el.item._id !== item.item._id);
    const newCart: cart = {
      ..._cart,
      quantity: _cart.quantity - quantity,
      items: newItems,
      total: _cart.total - Math.floor(price) * quantity,
    };
    const res = await fetch("/api/change-cart", {
      method: "POST",
      body: JSON.stringify(newCart),
    });
    const resCart = await res.json();
    setCart(resCart);
  }
  async function placeOrder() {
    const items: item[][] = _cart.items.map((el) => {
      const itemList = [];
      for (let i = 0; i !== el.quantity; i++) {
        itemList.push(el.item);
      }
      return itemList;
    });
    const newItems = items.map((el) => el.map((el) => el));
    console.log(newItems);
  }
  return (
    <>
      <Head>
        <title>Ecommerce</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <Header user={user} cart={_cart} />
      <main className="h-screen mt-15">
        {_cart.items.map((el) => (
          <CartItem
            key={el.item._id}
            item={el.item}
            quantity={el.quantity}
            removeItem={removeItem}
          />
        ))}
        <div className="bg-gray-300 h-[1px] mx-5 mt-5" />
        <div className="mt-5 flex justify-between mx-5">
          <div className="text-xl font-bold">Total:</div>
          <div className="text-xl font-bold">${_cart.total}</div>
        </div>
        <div className="flex justify-end mt-5">
          <button
            className="bg-green-600 text-white rounded-md mx-5 px-4 py-1"
            onClick={placeOrder}
          >
            Place Order
          </button>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { query } = context;
  const { id } = query;
  await mongoose.connect(
    "mongodb://127.0.0.1:6000/ecommerse?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.4.2"
  );
  const cart: cart | null = await cartModel
    .findOne<cart>({ owner: id })
    .populate({
      path: "items",
      populate: {
        path: "item",
        model: "item",
      },
    });
  const user: user[] | null = await userModel.find<user>();
  if (cart === null) {
    const _cart = new cartModel<cart>({
      items: [],
      owner: user[0]._id,
      quantity: 0,
      total: 0,
    });
    return {
      props: {
        cart: JSON.parse(JSON.stringify(_cart)),
        user: JSON.parse(JSON.stringify(user[0])),
      },
    };
  }
  return {
    props: {
      cart: JSON.parse(JSON.stringify(cart)),
      user: JSON.parse(JSON.stringify(user[0])),
    },
  };
}

export default Cart;