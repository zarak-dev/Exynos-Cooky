import React, { useState, useMemo, useCallback } from "react";
import { Table, message, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAvailabilityRequest,
  deleteProductRequest,
  addProductRequest,
  updateProductRequest,
} from "../../../store/slices/inventorySlice";
import type { RootState } from "../../../store";
import type { Product } from "../../../types/product";
import { StyledCard } from "../../../components/StyledCard";
import { StyledInput } from "../../../components/StyledInput";
import { getInventoryColumns } from "./columns";
import { AddEditCookieModal } from "./components/AddEditCookieModal";
import StyledPageHeader from "../../../components/PageHeader";
import { Wrapper } from "../../../components/Wrapper";

const AdminInventory: React.FC = () => {
  const inventory = useSelector((state: RootState) => state.inventory.items);
  const loading = useSelector((state: RootState) => state.inventory.loading);
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCookie, setEditingCookie] = useState<Product | null>(null);

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
        <StyledCard
          title="Inventory Details"
          extra={
            <StyledInput
              allowClear
              value={search}
              placeholder="Search cookies..."
              suffix={<SearchOutlined />}
              onChange={(e) => setSearch(e.target.value)}
            />
          }
        >
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredInventory}
            loading={loading}
            pagination={{ pageSize: 8 }}
            scroll={{ x: "max-content" }}
          />
        </StyledCard>
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
