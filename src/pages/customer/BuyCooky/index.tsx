import React, { useState, useMemo, useCallback } from "react";
import {
  message,
  Select,
  Tooltip,
  Button,
  Segmented,
} from "antd";
import {
  SearchOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { Cookie } from "@src/types/product";
import { type RootState } from "@src/store";
import { setBoxSize } from "@src/store/slices/cartSlice";
import { StyledInput } from "@src/components/StyledInput";
import { StyledTitle } from "@src/components/StyledTitle";
import { BOX_SIZES } from "@src/constants/pricing";
import { useDebounce } from "@src/hooks/useDebounce";
import { AIBoxBuilderModal } from "@src/components/customer/AIBoxBuilderModal";
import { CookieDetailModal } from "./components/CookieDetailModal";
import { CookieCatalogGrid } from "./components/CookieCatalogGrid";
import { ExploreSection } from "@src/pages/customer/Home/styles";
import {
  MainContent,
  FilterBar,
  FilterGroup,
  CategoryNavWrapper,
} from "./styles";
import { addCookieWithFeedback } from "@src/utils/cartActions";

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

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredCookies.length));
  }, [filteredCookies.length]);

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
      <CategoryNavWrapper>
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
      </CategoryNavWrapper>

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

      {/* Catalog Grid & Empty State */}
      <CookieCatalogGrid
        visibleCookies={visibleCookies}
        hasMore={hasMore}
        searchQuery={debouncedSearch}
        onSelectCookie={setSelectedCookie}
        onAddToCart={handleAddToCart}
        onLoadMore={handleLoadMore}
      />

      {/* Detail Modal */}
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
