import React from "react";
import { Flex, Button, Typography, Tag, Space, Popconfirm } from "antd";
import {
  EnvironmentOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { Address } from "../../../../types/address";
import { SectionContainer } from "../styles";
import { StyledCard } from "../../../../components/StyledCard";
import { StyledTitle } from "../../../../components/StyledTitle";

const { Text } = Typography;

interface ProfileAddressesCardProps {
  addresses: Address[];
  onOpenAddModal: () => void;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ProfileAddressesCard: React.FC<ProfileAddressesCardProps> = ({
  addresses,
  onOpenAddModal,
  onSetDefault,
  onDelete,
}) => {
  return (
    <SectionContainer>
      <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
        <StyledTitle level={5}>Delivery Addresses</StyledTitle>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          shape="round"
          onClick={onOpenAddModal}
        >
          Add Address
        </Button>
      </Flex>

      {addresses.length === 0 ? (
        <StyledCard>
          <Flex align="center" gap={8}>
            <EnvironmentOutlined />
            <Text type="secondary">
              No delivery addresses saved yet. Add one for rapid checkout!
            </Text>
          </Flex>
        </StyledCard>
      ) : (
        <Flex vertical gap={12} style={{ width: "100%" }}>
          {addresses.map((addr) => (
            <StyledCard key={addr.id} size="small">
              <Flex justify="space-between" align="start">
                <div>
                  <Flex align="center" gap={8} style={{ marginBottom: 4 }}>
                    <Text strong>{addr.recipientName}</Text>
                    {addr.isDefault && (
                      <Tag color="blue" icon={<CheckCircleOutlined />}>
                        DEFAULT
                      </Tag>
                    )}
                  </Flex>
                  <Text style={{ display: "block" }}>{addr.addressLine1}</Text>
                  {addr.addressLine2 && (
                    <Text type="secondary" style={{ display: "block" }}>
                      {addr.addressLine2}
                    </Text>
                  )}
                  <Text type="secondary" style={{ display: "block" }}>
                    {addr.city} {addr.postalCode || ""} • {addr.phone}
                  </Text>
                </div>

                <Space>
                  {!addr.isDefault && (
                    <Button
                      size="small"
                      onClick={() => onSetDefault(addr.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Popconfirm
                    title="Remove this address?"
                    onConfirm={() => onDelete(addr.id)}
                    okText="Remove"
                    cancelText="Cancel"
                    okType="danger"
                  >
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                </Space>
              </Flex>
            </StyledCard>
          ))}
        </Flex>
      )}
    </SectionContainer>
  );
};
