import React, { useState } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../../store";
import { type Order } from "../../../store/slices/orderSlice";
import {
  Input,
  Steps,
  Result,
  message,
  Badge,
  Space,
  Descriptions,
} from "antd";
import {
  SearchOutlined,
  LoadingOutlined,
  SmileOutlined,
  CarOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import {
  TrackContainer,
  PageTitle,
  PageSubtitle,
  SearchCard,
  SearchButton,
  ResultCard,
  ResultHeader,
  OrderTitle,
  OrderIdText,
  OrderDateText,
  BadgeText,
  DetailsCard,
} from "./styles";

const TRACKING_STEPS = [
  {
    title: "Order Placed",
    icon: <SolutionOutlined />,
  },
  {
    title: "Baking",
    icon: <LoadingOutlined />,
  },
  {
    title: "Dispatched",
    icon: <CarOutlined />,
  },
  {
    title: "Delivered",
    icon: <SmileOutlined />,
  },
];

const STEP_INDEX = {
  Pending: 0,
  Baking: 1,
  Dispatched: 2,
  Delivered: 3,
} as const;

export const TrackOrder: React.FC = () => {
  const [orderId, setOrderId] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);

  // Initialize the hook to get the API and the context element
  const [messageApi, contextHolder] = message.useMessage();

  // Grab live orders from our global Redux store
  const orders = useSelector((state: RootState) => state.orders.orders);

  const handleSearch = () => {
    const normalizedOrderId = orderId.trim().toUpperCase();
    if (!normalizedOrderId) {
      messageApi.warning("Please enter an Order ID to track!");
      return;
    }

    // Search for the order in our global Redux state
    const foundOrder = orders.find(
      (o) => o.id.toUpperCase() === normalizedOrderId,
    );

    if (foundOrder) {
      setSearchedOrder(foundOrder);
      messageApi.success("Order status retrieved successfully!");
    } else {
      setSearchedOrder(null);
      messageApi.error("Order ID not found. Please check your spelling.");
    }
  };
  const formattedDate = searchedOrder?.timestamp
    ? new Date(searchedOrder.timestamp).toLocaleString()
    : "Just now";

  return (
    <TrackContainer>
      {contextHolder}
      {/*  Renders the hidden context holder so the messages can access the theme */}
      <PageTitle level={1}>TRACK YOUR BAKE</PageTitle>
      <PageSubtitle>
        Enter your unique Order ID to track your custom cookie box live.
      </PageSubtitle>
      {/* SEARCH BAR */}
      <SearchCard variant="borderless">
        <Space.Compact style={{ width: "100%" }}>
          <Input
            size="large"
            allowClear
            placeholder="Enter your Order ID (e.g., EXNS-12345)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onPressEnter={handleSearch}
          />
          <SearchButton
            disabled={!orderId.trim()}
            size="large"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Search
          </SearchButton>
        </Space.Compact>
      </SearchCard>
      {/* TRACKING RESULTS */}
      {searchedOrder ? (
        <ResultCard variant="borderless">
          <ResultHeader>
            <Space direction="vertical" size={2}>
              <OrderTitle level={5}>
                Order: <OrderIdText>{searchedOrder.id}</OrderIdText>
              </OrderTitle>
              <OrderDateText>Placed: {formattedDate}</OrderDateText>
            </Space>
            <Badge
              status="processing"
              text={<BadgeText strong>{searchedOrder.status}</BadgeText>}
            />
          </ResultHeader>

          {/* STEP PROGRESS */}
          <Steps
            current={STEP_INDEX[searchedOrder.status] ?? 0}
            items={TRACKING_STEPS}
          />

          <DetailsCard type="inner" title="Order details">
            <Descriptions
              bordered
              column={1}
              labelStyle={{ fontWeight: 600 }}
              size="small"
              items={[
                {
                  label: "Customer",
                  children: searchedOrder.customerName,
                },
                {
                  label: "Box Size",
                  children: searchedOrder.boxSize,
                },
                {
                  label: "Cookies Selected",
                  children: searchedOrder.contents,
                },
                {
                  label: "Total to be Paid",
                  children: `Rs. ${searchedOrder.totalPrice}`,
                },
              ]}
            />
          </DetailsCard>
        </ResultCard>
      ) : (
        <Result
          status="info"
          title="No Live Tracking Session"
          subTitle="Place an order to watch its preparation. The kitchen is standing by!"
        />
      )}
    </TrackContainer>
  );
};

export default TrackOrder;
