import React from "react";
import { Table, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toggleItemAvailability } from "../../../store/slices/inventorySlice";
import type { RootState } from "../../../store";
import { InventoryContainer } from "./styles";
import { StyledCard } from "../../../components/StyledCard";
import { StyledTitle } from "../../../components/StyledTitle";
import { getInventoryColumns } from "./columns";
import type { HandleAvailabilityChangeParams } from "./types";

const AdminInventory: React.FC = () => {
  const inventory = useSelector((state: RootState) => state.inventory.items);
  const dispatch = useDispatch();

  const handleAvailabilityChange = ({
    id,
    checked,
  }: HandleAvailabilityChangeParams) => {
    dispatch(toggleItemAvailability({ id, isAvailable: checked }));

    const item = inventory.find((cookie) => cookie.id === id);

    message[checked ? "success" : "warning"](
      checked
        ? `"${item?.name}" is now active on the storefront!`
        : `"${item?.name}" marked as Sold Out.`
    );
  };

  const columns = getInventoryColumns({
    onToggle: (id: number, checked: boolean) =>
      handleAvailabilityChange({ id, checked }),
  });

  return (
    <InventoryContainer>
      <StyledTitle level={1}>INVENTORY MANAGEMENT</StyledTitle>

      <StyledCard>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={inventory}
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
        />
      </StyledCard>
    </InventoryContainer>
  );
};

export default AdminInventory;