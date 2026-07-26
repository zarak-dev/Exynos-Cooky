import React from "react";
import { Radio, List, Avatar, Button, Image } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setCartOpen,
  setBoxSize,
  removeCookieFromBox,
  type BoxSize,
} from "../../../store/slices/cartSlice";
import { selectCartData } from "../../../store/selectors";

import {
  StyledDrawer,
  DrawerHeaderTitle,
  SectionLabel,
  BoxTierWrapper,
  SlotGrid,
  CookieSlot,
  EmptySlotText,
  ItemNameText,
  DrawerFooter,
  TotalRow,
  TotalText,
  ActionButton,
} from "./styles";

export const CartDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCartOpen, items, boxSize } = useSelector(selectCartData);

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
    <StyledDrawer
      title={<DrawerHeaderTitle level={4}>Your Cookie Box</DrawerHeaderTitle>}
      placement="right"
      size={400}
      onClose={() => dispatch(setCartOpen(false))}
      open={isCartOpen}
    >
      <SectionLabel $noMarginTop>Select Box Size</SectionLabel>
      <BoxTierWrapper>
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
      </BoxTierWrapper>

      <SectionLabel>
        Box Progress ({items.length} / {boxSize} Slots Filled)
      </SectionLabel>

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
              <EmptySlotText>+</EmptySlotText>
            )}
          </CookieSlot>
        ))}
      </SlotGrid>

      <SectionLabel>Itemized Breakdown</SectionLabel>
      <List
        itemLayout="horizontal"
        dataSource={items}
        locale={{ emptyText: "Your customized baking box is currently empty." }}
        renderItem={(item: any, index) => (
          <List.Item
            actions={[
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => dispatch(removeCookieFromBox(index))}
              />,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.imageUrl} shape="square" size={40} />}
              title={<ItemNameText>{item.name}</ItemNameText>}
              description={`Rs. ${item.price}`}
            />
          </List.Item>
        )}
      />

      <DrawerFooter vertical>
        <TotalRow justify="space-between">
          <TotalText>TOTAL PRICE:</TotalText>
          <TotalText>Rs. {totalCost}</TotalText>
        </TotalRow>
        <ActionButton
          type="primary"
          disabled={items.length === 0}
          onClick={handleReviewCart}
        >
          Review Box & Checkout
        </ActionButton>
      </DrawerFooter>
    </StyledDrawer>
  );
};
