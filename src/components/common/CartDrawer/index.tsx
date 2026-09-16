import React from "react";
import { Radio, List, Avatar, Button, Image, Drawer } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setCartOpen,
  setBoxSize,
  removeCookieFromBox,
  type BoxSize,
} from "@src/store/slices/cartSlice";

import { SlotGrid, CookieSlot, DrawerFooter, TotalRow } from "./styles";
import { StyledTitle } from "@src/components/StyledTitle";
import Text from "antd/es/typography/Text";
import { Wrapper } from "@src/components/Wrapper";
import type { Cookie } from "@src/types/product";
import type { RootState } from "@src/store";
import { useMediaQuery } from "@src/hooks/useMediaQuery";

export const CartDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 480px)");
  const { isCartOpen, items, boxSize } = useSelector(
    (state: RootState) => state.cart,
  );
  

  const handleReviewCart = () => {
    //Routes to the Cart for box validation, not Checkout
    dispatch(setCartOpen(false));
    navigate("/cart");
  };

  const visualSlots = Array.from(
    { length: boxSize },
    (_, i) => items[i] || null,
  );
  const totalCost = items.reduce(
    (sum: number, item: { price: number }) => sum + item.price,
    0,
  );

  return (
    <Drawer
      title={<StyledTitle level={4}>Your Cookie Box</StyledTitle>}
      placement="right"
      width={isMobile ? "100%" : 400}
      onClose={() => dispatch(setCartOpen(false))}
      open={isCartOpen}
    >
      <Text>Select Box Size</Text>
      <Wrapper>
        <Radio.Group
          value={boxSize}
          onChange={(e) =>
            dispatch(setBoxSize(Number(e.target.value) as BoxSize))
          }
          buttonStyle="solid"
        >
          <Radio.Button value={4}>4-Pack</Radio.Button>
          <Radio.Button value={6}>6-Pack</Radio.Button>
          <Radio.Button value={12}>12-Pack</Radio.Button>
        </Radio.Group>
      </Wrapper>

      <Text>
        Box Progress ({items.length} / {boxSize} Slots Filled)
      </Text>

      <SlotGrid>
        {visualSlots.map((item, index) => (
          <CookieSlot
            key={index}
            $filled={!!item}
            align="center"
            justify="center"
          >
            {item ? (
              <Image src={item.imageUrl} alt={item.name} preview={false} />
            ) : (
              <Text>+</Text>
            )}
          </CookieSlot>
        ))}
      </SlotGrid>

      <Text>Itemized Breakdown</Text>
      <List
        itemLayout="horizontal"
        dataSource={items}
        locale={{ emptyText: "Your customized baking box is currently empty." }}
        renderItem={(item: Cookie, index) => (
          <List.Item
            actions={[
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                aria-label={`Remove ${item.name} from box`}
                onClick={() => dispatch(removeCookieFromBox(index))}
              />,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.imageUrl} shape="square" size={40} />}
              title={<Text>{item.name}</Text>}
              description={`Rs. ${item.price}`}
            />
          </List.Item>
        )}
      />

      <DrawerFooter vertical>
        <TotalRow justify="space-between">
          <Text>TOTAL PRICE:</Text>
          <Text>Rs. {totalCost}</Text>
        </TotalRow>
        <Button
          type="primary"
          disabled={items.length === 0}
          onClick={handleReviewCart}
        >
          Review Box & Checkout
        </Button>
      </DrawerFooter>
    </Drawer>
  );
};
