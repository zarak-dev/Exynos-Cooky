import React, { useState } from "react";
import {
  Col,
  message,
  Row,
  Select,
  Tag,
  Tooltip,
  Button,
  Flex,
  Modal,
  Typography,
} from "antd";
import { SearchOutlined, DownCircleTwoTone } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { type Cookie } from "../../../utils/mockData";
import { type RootState } from "../../../store";
import { addCookieToBox, setBoxSize } from "../../../store/slices/cartSlice";
import { StyledInput } from "../../../components/StyledInput";
import { StyledTitle } from "../../../components/StyledTitle";
import { BOX_SIZES } from "../../../constants/pricing";
import {
  CoverImage,
  CardHeader,
  StyledButton,
  ExploreSection,
  NoResults,
  StyledMeta,
} from "../Home/styles";
import {
  MainContent,
  LoadMoreWrapper,
  EqualCard,
  CardFooter,
  ModalImage,
} from "./styles";

const { Text } = Typography;
const PAGE_SIZE = 6;

const FILTER_OPTIONS = [
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const BuyCooky: React.FC = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price-low" | "price-high" | undefined>(
    undefined,
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedCookie, setSelectedCookie] = useState<Cookie | null>(null);

  const { items: cookies } = useSelector((state: RootState) => state.inventory);
  const { items: cartItems, boxSize } = useSelector(
    (state: RootState) => state.cart,
  );

  const filteredCookies = cookies
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortBy === "price-low"
        ? a.price - b.price
        : sortBy === "price-high"
          ? b.price - a.price
          : 0,
    );

  const visibleCookies = filteredCookies.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCookies.length;

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
    <MainContent>
      {contextHolder}

      <ExploreSection>
        <StyledTitle level={1}>Our Beloved Cookies</StyledTitle>
        <StyledInput
          placeholder="Search a cookie"
          allowClear
          value={search}
          suffix={<SearchOutlined />}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
        />
      </ExploreSection>

      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        <Flex gap={8} align="center">
          <Select
            value={sortBy}
            placeholder="Sort by Price"
            onChange={(value) => {
              setSortBy(value);
              setVisibleCount(PAGE_SIZE);
            }}
            options={FILTER_OPTIONS}
          />
          {sortBy && (
            <Button
              onClick={() => {
                setSortBy(undefined);
                setVisibleCount(PAGE_SIZE);
              }}
            >
              Clear
            </Button>
          )}
        </Flex>
        <Tooltip title="Select Your Box Size">
          <Select
            value={boxSize}
            onChange={(value) => dispatch(setBoxSize(value))}
            options={BOX_SIZES.map((size) => ({
              value: size,
              label: `${size}-Pack`,
            }))}
          />
        </Tooltip>
      </Flex>

      {visibleCookies.length ? (
        <>
          <Row gutter={[24, 24]}>
            {visibleCookies.map((cookie) => (
              <Col xs={24} sm={12} md={8} key={cookie.id}>
                <EqualCard
                  hoverable
                  $isAvailable={cookie.isAvailable}
                  cover={
                    <CoverImage
                      src={cookie.imageUrl}
                      alt={cookie.name}
                      preview={false}
                    />
                  }
                  onClick={() => setSelectedCookie(cookie)}
                >
                  <CardHeader>
                    <StyledTitle level={4}>{cookie.name}</StyledTitle>
                    <Tag
                      color={cookie.isAvailable ? "blue" : "red"}
                      variant="solid"
                    >
                      {cookie.isAvailable ? `Rs. ${cookie.price}` : "Sold Out"}
                    </Tag>
                  </CardHeader>
                  <StyledMeta description={cookie.description} />
                  <CardFooter>
                    <StyledButton
                      type="primary"
                      shape="round"
                      disabled={!cookie.isAvailable}
                      danger={!cookie.isAvailable}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(cookie);
                      }}
                    >
                      {cookie.isAvailable ? "Add to Box" : "Unavailable"}
                    </StyledButton>
                  </CardFooter>
                </EqualCard>
              </Col>
            ))}
          </Row>

          {hasMore && (
            <LoadMoreWrapper>
              <Button
                type="default"
                shape="round"
                size="large"
                icon={<DownCircleTwoTone twoToneColor="#00009c" />}
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              >
                Load More
              </Button>
            </LoadMoreWrapper>
          )}
        </>
      ) : (
        <NoResults>No delicious cookies match your search! 🍪</NoResults>
      )}

      <Modal
        open={!!selectedCookie}
        onCancel={() => setSelectedCookie(null)}
        footer={null}
        width={420}
        closable={false}
        centered
      >
        {selectedCookie && (
          <Flex vertical gap={12}>
            <ModalImage
              src={selectedCookie.imageUrl}
              alt={selectedCookie.name}
              preview={false}
            />
            <Flex justify="space-between" align="center">
              <StyledTitle level={4}>{selectedCookie.name}</StyledTitle>
              <Tag
                color={selectedCookie.isAvailable ? "blue" : "red"}
                variant="solid"
              >
                {selectedCookie.isAvailable
                  ? `Rs. ${selectedCookie.price}`
                  : "Sold Out"}
              </Tag>
            </Flex>
            <Text type="secondary">{selectedCookie.description}</Text>
            <StyledButton
              type="primary"
              shape="round"
              disabled={!selectedCookie.isAvailable}
              danger={!selectedCookie.isAvailable}
              onClick={() => {
                handleAddToCart(selectedCookie);
                setSelectedCookie(null);
              }}
            >
              {selectedCookie.isAvailable ? "Add to Box" : "Unavailable"}
            </StyledButton>
          </Flex>
        )}
      </Modal>
    </MainContent>
  );
};

export default BuyCooky;
