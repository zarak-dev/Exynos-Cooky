import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { type RootState } from "@src/store";
import {
  type Order,
  trackOrderRequest,
  updateOrderStatusRequest,
  updateOrderStatusSuccess,
} from "@src/store/slices/orderSlice";
import { orderService } from "@src/services/supabase/orderService";
import { whatsappService } from "@src/services/whatsapp/whatsappService";
import {
  Input,
  Steps,
  Result,
  message,
  Badge,
  Space,
  Flex,
  Descriptions,
  Button,
  Popconfirm,
  Spin,
} from "antd";
import {
  SearchOutlined,
  LoadingOutlined,
  SmileOutlined,
  CarOutlined,
  SolutionOutlined,
  DeleteOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import {
  TrackContainer,
  PageTitle,
  PageSubtitle,
  SearchCard,
  SearchWrapper,
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

const STEP_INDEX: Record<string, number> = {
  Pending: 0,
  Confirmed: 0,
  Preparing: 1,
  Baking: 1,
  Dispatched: 2,
  Delivered: 3,
  Cancelled: 0,
};

export const TrackOrder: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialParamId = searchParams.get("id") || "";
  const [orderId, setOrderId] = useState(() => initialParamId);
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  const trackedOrder = useSelector((state: RootState) => state.orders.trackedOrder);
  const loading = useSelector((state: RootState) => state.orders.loading);
  const trackingError = useSelector((state: RootState) => state.orders.error);

  // Directly derive searchedOrder from authoritative Redux store state
  const searchedOrder = trackedOrder;

  // Handle URL param lookup on mount or param change
  useEffect(() => {
    if (initialParamId) {
      dispatch(trackOrderRequest(initialParamId.trim()));
    }
  }, [initialParamId, dispatch]);

  const handleCancelOrder = () => {
    if (!searchedOrder) return;
    dispatch(updateOrderStatusRequest({ id: searchedOrder.id, status: "Cancelled" }));
    messageApi.success("Order cancellation initiated and baking slots restored.");
  };

  const currentStatusRef = useRef(searchedOrder?.status);

  useEffect(() => {
    currentStatusRef.current = searchedOrder?.status;
  }, [searchedOrder?.status]);

  // Realtime subscription for searched order updates (stable lifecycle)
  useEffect(() => {
    if (!searchedOrder?.id) return;

    const unsubscribe = orderService.subscribeToOrderStatus(
      searchedOrder.id,
      (newStatus) => {
        if (newStatus !== currentStatusRef.current) {
          dispatch(
            updateOrderStatusSuccess({
              id: searchedOrder.id,
              status: newStatus as Order["status"],
            }),
          );
          messageApi.info(`Order status updated to "${newStatus}"! 🍪`);
        }
      },
      (err) => {
        console.warn("Realtime order subscription notice:", err);
      },
    );
    return () => unsubscribe();
  }, [searchedOrder?.id, dispatch, messageApi]);

  const handleSearch = () => {
    const normalizedOrderId = orderId.trim().toUpperCase();
    if (!normalizedOrderId) {
      messageApi.warning("Please enter an Order ID to track!");
      return;
    }

    setSearchParams({ id: normalizedOrderId });
    dispatch(trackOrderRequest(normalizedOrderId));
  };

  const isCancellable =
    searchedOrder &&
    (searchedOrder.status === "Pending" || searchedOrder.status === "Confirmed");

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
        <SearchWrapper>
          <Input
            style={{ flex: 1, minWidth: 0, borderRadius: 20 }}
            allowClear
            size="large"
            placeholder="Enter your Order ID (e.g., EXNS-12345)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onPressEnter={handleSearch}
          />
          <Button
            type="primary"
            size="large"
            disabled={!orderId.trim() || loading}
            loading={loading}
            shape="round"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Search
          </Button>
        </SearchWrapper>
      </SearchCard>
      {/* TRACKING RESULTS */}
      <Spin spinning={loading}>
        {searchedOrder ? (
          <ResultCard variant="borderless">
            <ResultHeader>
              <Flex vertical gap={2}>
                <OrderTitle level={5}>
                  Order: <OrderIdText>{searchedOrder.id}</OrderIdText>
                </OrderTitle>
                <OrderDateText>Placed: {formattedDate}</OrderDateText>
              </Flex>

              <Space wrap>
                <Badge
                  status={searchedOrder.status === "Cancelled" ? "error" : "processing"}
                  text={<BadgeText strong>{searchedOrder.status}</BadgeText>}
                />
                <Button
                  icon={<WhatsAppOutlined style={{ color: "#25D366" }} />}
                  size="small"
                  onClick={() => whatsappService.openOrderInquiry(searchedOrder.id)}
                >
                  Order Help
                </Button>
                {searchedOrder.status !== "Cancelled" && (
                  <Popconfirm
                    title="Cancel Order"
                    description="Are you sure you want to cancel this order? This will release reserved oven slots."
                    onConfirm={handleCancelOrder}
                    okText="Yes, Cancel"
                    cancelText="Keep Order"
                    okButtonProps={{ danger: true }}
                    disabled={!isCancellable}
                  >
                    <Button
                      disabled={!isCancellable}
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                    >
                      Cancel Order
                    </Button>
                  </Popconfirm>
                )}
              </Space>
            </ResultHeader>

            {/* STEP PROGRESS */}
            <Steps
              responsive
              current={STEP_INDEX[searchedOrder.status] ?? 0}
              status={searchedOrder.status === "Cancelled" ? "error" : undefined}
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
                    label: "Total",
                    children: `Rs. ${searchedOrder.totalPrice}`,
                  },
                ]}
              />
            </DetailsCard>
          </ResultCard>
        ) : (
          <Result
            status={trackingError ? "warning" : "info"}
            title={trackingError ? "Order Not Found" : "No Live Tracking Session"}
            subTitle={
              trackingError
                ? `We couldn't locate order "${orderId}". Please check your order ID and try again.`
                : "Place an order to watch its preparation. The kitchen is standing by!"
            }
          />
        )}
      </Spin>
    </TrackContainer>
  );
};

export default TrackOrder;
