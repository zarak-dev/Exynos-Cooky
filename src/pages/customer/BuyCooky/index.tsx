import React, { useState, useMemo, useCallback } from "react";
import {
  Col,
  message,
  Row,
  Select,
  Tooltip,
  Button,
  Tag,
  Typography,
  Segmented,
  Empty,
} from "antd";
import {
  SearchOutlined,
  DownCircleTwoTone,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { Cookie } from "../../../types/product";
import { type RootState } from "../../../store";
import { setBoxSize } from "../../../store/slices/cartSlice";
import { StyledInput } from "../../../components/StyledInput";
import { StyledTitle } from "../../../components/StyledTitle";
import { BOX_SIZES } from "../../../constants/pricing";
import { useDebounce } from "../../../hooks/useDebounce";
import { AIBoxBuilderModal } from "../../../components/customer/AIBoxBuilderModal";
import { CookieDetailModal } from "./components/CookieDetailModal";
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
  FilterBar,
  FilterGroup,
} from "./styles";
import { addCookieWithFeedback } from "../../../utils/cartActions";

const { Text } = Typography;
const PAGE_SIZE = 12;

const FILTER_OPTIONS = [
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const CATEGORY_OPTIONS = [
  { label: "All Cookies", value: "all" },
  { label: "Chocolate", value: "chocolate" },
  { label: "Caramel", value: "caramel" },
  { label: "Nutty", value: "nutty" },
  { label: "Lava Core", value: "lava" },
  { label: "Fruit & Berry", value: "fruit" },
  { label: "Velvet", value: "velvet" },
  { label: "Specialty", value: "specialty" },
  { label: "Classic", value: "classic" },
];

const BuyCooky: React.FC = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"price-low" | "price-high" | undefined>(
    undefined,
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedCookie, setSelectedCookie] = useState<Cookie | null>(null);
  const [isAiBoxModalOpen, setIsAiBoxModalOpen] = useState(false);

  const { items: cookies } = useSelector((state: RootState) => state.inventory);
  const { items: cartItems, boxSize } = useSelector(
    (state: RootState) => state.cart,
  );

  const filteredCookies = useMemo(() => {
    return cookies
      .filter((cookie) => {
        const matchesSearch =
          debouncedSearch === "" ||
          cookie.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          cookie.description.toLowerCase().includes(debouncedSearch.toLowerCase());

        const matchesCategory =
          selectedCategory === "all" ||
          (cookie.category &&
            (cookie.category.toLowerCase() === selectedCategory.toLowerCase() ||
              (selectedCategory === "velvet" && cookie.category.includes("velvet")) ||
              (selectedCategory === "fruit" && cookie.category.includes("fruit"))));

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) =>
        sortBy === "price-low"
          ? a.price - b.price
          : sortBy === "price-high"
            ? b.price - a.price
            : 0,
      );
  }, [cookies, debouncedSearch, selectedCategory, sortBy]);

  const visibleCookies = useMemo(
    () => filteredCookies.slice(0, visibleCount),
    [filteredCookies, visibleCount],
  );
  const hasMore = visibleCount < filteredCookies.length;

  const handleAddToCart = useCallback(
    (cookie: Cookie) => {
      addCookieWithFeedback(
        cookie,
        cartItems.length,
        boxSize,
        dispatch,
        messageApi,
      );
    },
    [cartItems.length, boxSize, dispatch, messageApi],
  );

  return (
    <MainContent>
      {contextHolder}

      <ExploreSection>
        <StyledTitle level={1}>Our Beloved Cookies</StyledTitle>
        <StyledInput
          placeholder="Search cookies by flavor, chocolate, caramel..."
          allowClear
          size="large"
          value={search}
          suffix={<SearchOutlined />}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
        />
      </ExploreSection>

      {/* Flavor Category Navigation */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24, overflowX: "auto" }}>
        <Segmented
          options={CATEGORY_OPTIONS}
          value={selectedCategory}
          onChange={(val) => {
            setSelectedCategory(val as string);
            setVisibleCount(PAGE_SIZE);
          }}
          size="large"
          style={{ padding: 4 }}
        />
      </div>

      <FilterBar>
        <FilterGroup>
          <Select
            value={sortBy}
            placeholder="Sort by Price"
            onChange={(value) => {
              setSortBy(value);
              setVisibleCount(PAGE_SIZE);
            }}
            options={FILTER_OPTIONS}
            style={{ minWidth: 150 }}
          />
          {sortBy && (
            <Button
              onClick={() => {
                setSortBy(undefined);
                setVisibleCount(PAGE_SIZE);
              }}
            >
              Clear Sort
            </Button>
          )}

          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            onClick={() => setIsAiBoxModalOpen(true)}
            style={{
              background: "linear-gradient(135deg, #00009c 0%, #722ed1 100%)",
              border: "none",
              fontWeight: 600,
            }}
          >
            AI Box Builder
          </Button>
        </FilterGroup>

        <Tooltip title="Select Your Box Size">
          <Select
            value={boxSize}
            onChange={(value) => dispatch(setBoxSize(value))}
            options={BOX_SIZES.map((size) => ({
              value: size,
              label: `${size}-Pack Box`,
            }))}
            style={{ minWidth: 125 }}
          />
        </Tooltip>
      </FilterBar>

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
                      loading="lazy"
                    />
                  }
                >
                  <CardHeader justify="space-between" align="center">
                    <StyledTitle level={4}>{cookie.name}</StyledTitle>
                    <Tag
                      color={cookie.isAvailable ? "blue" : "red"}
                      variant="solid"
                    >
                      {cookie.isAvailable ? `Rs. ${cookie.price}` : "Sold Out"}
                    </Tag>
                  </CardHeader>
                  <StyledMeta description={cookie.description} />
                  <CardFooter justify="space-between" align="center">
                    <StyledButton
                      shape="round"
                      onClick={() => setSelectedCookie(cookie)}
                    >
                      View
                    </StyledButton>
                    <StyledButton
                      type="primary"
                      shape="round"
                      disabled={!cookie.isAvailable}
                      onClick={() => handleAddToCart(cookie)}
                    >
                      {cookie.isAvailable ? "Add" : "Sold Out"}
                    </StyledButton>
                  </CardFooter>
                </EqualCard>
              </Col>
            ))}
          </Row>

          {hasMore && (
            <LoadMoreWrapper justify="center" align="center">
              <Button
                shape="round"
                size="large"
                icon={<DownCircleTwoTone />}
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              >
                Load More
              </Button>
            </LoadMoreWrapper>
          )}
        </>
      ) : (
        <NoResults>
          <Empty
            description={
              <div>
                <Text strong style={{ fontSize: 16, display: "block" }}>
                  No cookies matched your search!
                </Text>
                <Text type="secondary">
                  Try searching for another flavor or clearing the category filter.
                </Text>
              </div>
            }
          >
            <Button
              type="primary"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setSortBy(undefined);
              }}
            >
              Reset All Filters
            </Button>
          </Empty>
        </NoResults>
      )}

      {/* Cookie Detail Modal */}
      <CookieDetailModal
        cookie={selectedCookie}
        onClose={() => setSelectedCookie(null)}
        onAddToCart={handleAddToCart}
      />

      {/* AI Box Builder Modal */}
      <AIBoxBuilderModal
        open={isAiBoxModalOpen}
        onCancel={() => setIsAiBoxModalOpen(false)}
      />
    </MainContent>
  );
};

export default BuyCooky;
