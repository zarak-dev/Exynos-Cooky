import React from "react";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { type Cookie } from "../../../utils/mockData";
import { type RootState } from "../../../store";
import { addCookieToBox } from "../../../store/slices/cartSlice";
import HomeCarousel from "../../../components/HomeCarousel";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const { items: cookies } = useSelector((state: RootState) => state.inventory);
  const { items: cartItems, boxSize } = useSelector(
    (state: RootState) => state.cart,
  );

  const featuredCookies = cookies.slice(0, 6);

  const handleAddToCart = (cookie: Cookie) => {
    if (cartItems.length >= boxSize) {
      messageApi.error(
        `Your ${boxSize}-Pack is full! Clear items or upgrade your box size.`,
      );
      return;
    }

    dispatch(addCookieToBox(cookie));
    messageApi.success(`Added ${cookie.name} to your box! 🍪`);
  };

  return (
    <>
      {contextHolder}
      <HomeCarousel cookies={featuredCookies} onAdd={handleAddToCart} />
    </>
  );
};

export default Home;