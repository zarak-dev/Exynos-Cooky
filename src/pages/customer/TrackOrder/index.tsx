import React, { useState } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../../store";
import { Input, Steps, Result, message, Badge, Typography, Space } from "antd"; // 🌟 message is still imported
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
  SearchWrapper,
  SearchButton,
  ResultCard,
  ResultHeader,
  OrderTitle,
  OrderIdText,
  OrderDateText,
  BadgeText,
  DetailsCard,
  DetailRow,
} from "./styles";

const { Text } = Typography;

export const TrackOrder: React.FC = () => {
  const [orderId, setOrderId] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<any>(null);

  // Initialize the hook to get the API and the context element
  const [messageApi, contextHolder] = message.useMessage();

  // Grab live orders from our global Redux store
  const orders = useSelector((state: RootState) => state.orders.orders);

  const handleSearch = () => {
    const trimmedId = orderId.trim();
    if (!trimmedId) {
      messageApi.warning("Please enter an Order ID to track!");
      return;
    }

    // Search for the order in our global Redux state
    const foundOrder = orders.find(
      (o) => o.id.toUpperCase() === trimmedId.toUpperCase(),
    );

    if (foundOrder) {
      setSearchedOrder(foundOrder);
      messageApi.success("Order status retrieved successfully!");
    } else {
      setSearchedOrder(null);
      messageApi.error("Order ID not found. Please check your spelling.");
    }
  };

  // Maps order state status string to Steps index
  const getStepStatusIndex = (status: string) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Baking":
        return 1;
      case "Dispatched":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 0;
    }
  };

  return (
    <TrackContainer>
      {contextHolder}{" "}
      {/*  Renders the hidden context holder so the messages can access the theme */}
      <PageTitle level={1}>TRACK YOUR BAKE</PageTitle>
      <PageSubtitle>
        Enter your unique Order ID to track your custom cookie box live.
      </PageSubtitle>
      {/* SEARCH BAR */}
      <SearchCard variant="borderless">
        <SearchWrapper>
          <Input
            size="large"
            placeholder="Enter your Order ID (e.g., EXNS-12345)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onPressEnter={handleSearch}
          />
          <SearchButton
            size="large"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Search
          </SearchButton>
        </SearchWrapper>
      </SearchCard>
      {/* TRACKING RESULTS */}
      {searchedOrder ? (
        <ResultCard variant="borderless">
          <ResultHeader>
            <Space>
              <OrderTitle level={5}>
                Order: <OrderIdText>{searchedOrder.id}</OrderIdText>
              </OrderTitle>
              <OrderDateText>
                Placed:{" "}
                {searchedOrder.timestamp
                  ? new Date(searchedOrder.timestamp).toLocaleString()
                  : "Just now"}
              </OrderDateText>
            </Space>
            <Badge
              status="processing"
              text={<BadgeText strong>{searchedOrder.status}</BadgeText>}
            />
          </ResultHeader>

          {/* STEP PROGRESS */}
          <Steps
            current={getStepStatusIndex(searchedOrder.status)}
            items={[
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
            ]}
          />

          <DetailsCard type="inner" title="Order details">
            <DetailRow>
              <Text strong>Customer:</Text> {searchedOrder.customerName}
            </DetailRow>
            <DetailRow>
              <Text strong>Box Size:</Text> {searchedOrder.boxSize}
            </DetailRow>
            <DetailRow>
              <Text strong>Cookies Selected:</Text> {searchedOrder.contents}
            </DetailRow>
            <DetailRow $isLast>
              <Text strong>Total to be Paid:</Text> Rs. {searchedOrder.totalPrice}
            </DetailRow>
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
