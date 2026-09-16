import React, { useState, useMemo, useCallback } from "react";
import { Table, message, Button, Flex, Typography, Switch, Popconfirm, Tag, Pagination, Empty, Spin } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAvailabilityRequest,
  deleteProductRequest,
  addProductRequest,
  updateProductRequest,
} from "@src/store/slices/inventorySlice";
import type { RootState } from "@src/store";
import type { Product } from "@src/types/product";
import { DEFAULT_COOKIE_IMAGE } from "@src/constants";
import { StyledInput } from "@src/components/StyledInput";
import { getInventoryColumns } from "./columns";
import { AddEditCookieModal } from "./components/AddEditCookieModal";
import StyledPageHeader from "@src/components/PageHeader";
import { Wrapper } from "@src/components/Wrapper";
import { useMediaQuery } from "@src/hooks/useMediaQuery";
import {
  MobileInventoryCard,
  MobileCookieThumb,
  MobileActionsRow,
  StatusTag,
  ResponsiveToolbar,
  InventoryCardWrapper,
} from "./styles";

const { Text } = Typography;

const AdminInventory: React.FC = () => {
  const inventory = useSelector((state: RootState) => state.inventory.items);
  const loading = useSelector((state: RootState) => state.inventory.loading);
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCookie, setEditingCookie] = useState<Product | null>(null);
  const [mobilePage, setMobilePage] = useState(1);
  const mobilePageSize = 6;

  const handleAvailabilityChange = useCallback(
    (id: number, checked: boolean) => {
      dispatch(toggleAvailabilityRequest({ id, isAvailable: checked }));
      const item = inventory.find((cookie) => cookie.id === id);
      message[checked ? "success" : "warning"](
        checked
          ? `"${item?.name}" is now active on the storefront!`
          : `"${item?.name}" marked as Sold Out.`,
      );
    },
    [dispatch, inventory],
  );

  const handleDelete = useCallback(
    (id: number) => {
      dispatch(deleteProductRequest(id));
      message.success("Cookie removed from inventory.");
    },
    [dispatch],
  );

  const handleOpenAdd = () => {
    setEditingCookie(null);
    setModalOpen(true);
  };

  const handleOpenEdit = useCallback((cookie: Product) => {
    setEditingCookie(cookie);
    setModalOpen(true);
  }, []);

  const handleModalSubmit = (values: Omit<Product, "id">, id?: number) => {
    if (id) {
      dispatch(updateProductRequest({ id, updates: values }));
      message.success(`Updated "${values.name}" successfully!`);
    } else {
      dispatch(addProductRequest(values));
      message.success(`Added "${values.name}" to inventory!`);
    }
    setModalOpen(false);
  };

  const columns = useMemo(
    () =>
      getInventoryColumns({
        onToggle: handleAvailabilityChange,
        onEdit: handleOpenEdit,
        onDelete: handleDelete,
      }),
    [handleAvailabilityChange, handleOpenEdit, handleDelete],
  );

  const filteredInventory = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return inventory;
    return inventory.filter((item) => item.name.toLowerCase().includes(query));
  }, [inventory, search]);

  // Sliced data for mobile pagination
  const paginatedMobileInventory = useMemo(() => {
    return filteredInventory.slice(
      (mobilePage - 1) * mobilePageSize,
      mobilePage * mobilePageSize,
    );
  }, [filteredInventory, mobilePage]);

  return (
    <>
      <StyledPageHeader
        title="Inventory Management"
        breadcrumbs={[{ title: "Admin" }, { title: "Inventory" }]}
        extra={
          <Button
            shape="round"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenAdd}
          >
            Add Cookie
          </Button>
        }
      />
      <Wrapper>
        <InventoryCardWrapper variant="borderless">
          {/* Responsive Header Toolbar */}
          <ResponsiveToolbar>
            <span className="title-text">Inventory Catalog ({filteredInventory.length})</span>
            <div className="search-input">
              <StyledInput
                allowClear
                value={search}
                placeholder="Search cookies..."
                suffix={<SearchOutlined />}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setMobilePage(1);
                }}
              />
            </div>
          </ResponsiveToolbar>

          {isDesktop ? (
            /* DESKTOP TABLE VIEW */
            <Table
              rowKey="id"
              tableLayout="fixed"
              columns={columns}
              dataSource={filteredInventory}
              loading={loading}
              pagination={{ pageSize: 8, position: ["bottomCenter"] }}
            />
          ) : (
            /* MOBILE RESPONSIVE CARD VIEW */
            <Spin spinning={loading}>
              {filteredInventory.length === 0 ? (
                <Empty description="No matching cookies in inventory" style={{ padding: "32px 0" }} />
              ) : (
                <Flex vertical gap={4}>
                  {paginatedMobileInventory.map((cookie) => (
                    <MobileInventoryCard key={cookie.id}>
                      {/* Cookie Header: Thumbnail, Name, Price */}
                      <Flex align="center" gap={12}>
                        <MobileCookieThumb
                          src={cookie.imageUrl || DEFAULT_COOKIE_IMAGE}
                          alt={cookie.name}
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_COOKIE_IMAGE;
                          }}
                        />
                        <Flex vertical style={{ minWidth: 0, flex: 1 }}>
                          <Text strong style={{ fontSize: 15, color: "#09090b" }} ellipsis>
                            {cookie.name}
                          </Text>
                          <Text strong style={{ fontSize: 14, color: "#00009c", marginTop: 2 }}>
                            Rs. {cookie.price.toLocaleString()}
                          </Text>
                        </Flex>
                      </Flex>

                      {/* Stock & Status Badges */}
                      <Flex align="center" gap={8} wrap="wrap" style={{ marginTop: 10 }}>
                        <StatusTag color={cookie.isAvailable ? "success" : "error"}>
                          {cookie.isAvailable ? "AVAILABLE" : "SOLD OUT"}
                        </StatusTag>
                        {cookie.stock === 0 ? (
                          <Tag color="error">Out of Stock</Tag>
                        ) : cookie.stock <= 5 ? (
                          <Tag color="warning">Low Stock ({cookie.stock})</Tag>
                        ) : (
                          <Tag color="default">{cookie.stock} in stock</Tag>
                        )}
                      </Flex>

                      {/* Touch Actions Bar */}
                      <MobileActionsRow>
                        <Flex align="center" gap={8}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Storefront:
                          </Text>
                          <Switch
                            size="small"
                            checkedChildren="ON"
                            unCheckedChildren="OFF"
                            checked={cookie.isAvailable}
                            onChange={(checked) => handleAvailabilityChange(cookie.id, checked)}
                          />
                        </Flex>
                        <Flex align="center" gap={8}>
                          <Button
                            size="small"
                            shape="round"
                            icon={<EditOutlined />}
                            onClick={() => handleOpenEdit(cookie)}
                          >
                            Edit
                          </Button>
                          <Popconfirm
                            title="Delete this cookie?"
                            description="It will be removed from inventory permanently."
                            okText="Delete"
                            okType="danger"
                            cancelText="Cancel"
                            onConfirm={() => handleDelete(cookie.id)}
                          >
                            <Button size="small" shape="round" danger icon={<DeleteOutlined />} />
                          </Popconfirm>
                        </Flex>
                      </MobileActionsRow>
                    </MobileInventoryCard>
                  ))}

                  {filteredInventory.length > mobilePageSize && (
                    <Flex justify="center" style={{ marginTop: 12, marginBottom: 4 }}>
                      <Pagination
                        simple
                        size="small"
                        current={mobilePage}
                        total={filteredInventory.length}
                        pageSize={mobilePageSize}
                        onChange={(page) => setMobilePage(page)}
                      />
                    </Flex>
                  )}
                </Flex>
              )}
            </Spin>
          )}
        </InventoryCardWrapper>
      </Wrapper>

      <AddEditCookieModal
        open={modalOpen}
        initialValues={editingCookie}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </>
  );
};

export default AdminInventory;
