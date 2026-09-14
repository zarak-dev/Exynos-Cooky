import React, { useEffect, useState } from "react";
import { Switch, Table, Empty, Flex, Button, message, Tag, Space, Popconfirm } from "antd";
import {
  EditOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type RootState } from "../../../store";
import { logoutUser } from "../../../store/slices/authSlice";
import {
  fetchAddressesRequest,
  addAddressRequest,
  deleteAddressRequest,
  setDefaultAddressRequest,
  updateProfileRequest,
} from "../../../store/slices/profileSlice";
import type { AddressInput } from "../../../types/address";
import {
  ProfileContainer,
  SidebarTabs,
  ContentWrapper,
  SectionContainer,
  SignOutWrapper,
  SignOutLink,
  HeaderRow,
} from "./styles";
import Text from "antd/es/typography/Text";
import { StyledCard } from "../../../components/StyledCard";
import { StyledTitle } from "../../../components/StyledTitle";
import { EditContactModal } from "./components/EditContactModal";
import { AddAddressModal } from "./components/AddAddressModal";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

const CustomerProfile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const user = useSelector((state: RootState) => state.auth.user);
  const orders = useSelector((state: RootState) => state.orders.orders);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const addresses = useSelector((state: RootState) => state.profile.addresses);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [marketingEmail, setMarketingEmail] = useState(
    user?.marketingPreferences?.email ?? true,
  );

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAddressesRequest(user.id));
    }
  }, [user?.id, dispatch]);

  const customerOrders = user
    ? orders.filter(
        (order) =>
          order.customerEmail.toLowerCase() === user.email.toLowerCase(),
      )
    : [];

  const handleLogout = () => {
    dispatch(logoutUser());
    message.info("Signed out successfully");
    navigate("/");
  };

  const handleSaveContact = (values: { name: string; phone: string }) => {
    if (!user) return;
    dispatch(
      updateProfileRequest({
        userId: user.id,
        updates: { name: values.name, phone: values.phone },
      }),
    );
    setIsContactModalOpen(false);
    message.success("Contact information updated!");
  };

  const handleAddAddress = (input: AddressInput) => {
    if (!user) return;
    dispatch(addAddressRequest({ address: input, userId: user.id }));
    setIsAddressModalOpen(false);
    message.success("Delivery address added!");
  };

  const handleDeleteAddress = (id: string) => {
    dispatch(deleteAddressRequest(id));
    message.success("Address removed.");
  };

  const handleSetDefaultAddress = (id: string) => {
    if (!user) return;
    dispatch(setDefaultAddressRequest({ id, userId: user.id }));
    message.success("Default delivery address updated.");
  };

  const handleToggleMarketing = (checked: boolean) => {
    setMarketingEmail(checked);
    if (user) {
      dispatch(
        updateProfileRequest({
          userId: user.id,
          updates: {
            marketingPreferences: { email: checked },
          },
        }),
      );
      message.success(
        checked
          ? "Opted into exclusive fresh-batch offers!"
          : "Unsubscribed from marketing communications.",
      );
    }
  };

  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => (
        <Button
          type="link"
          style={{ padding: 0 }}
          onClick={() => navigate(`/track-order`)}
        >
          {id}
        </Button>
      ),
    },
    {
      title: "Date",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString() : "N/A",
    },
    {
      title: "Box",
      dataIndex: "boxSize",
      key: "boxSize",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "Delivered"
            ? "success"
            : status === "Baking"
              ? "processing"
              : status === "Dispatched"
                ? "blue"
                : "warning";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value: number) => <Text strong>Rs. {value}</Text>,
    },
  ];

  if (!isLoggedIn) {
    return null;
  }

  return (
    <ProfileContainer>
      <SidebarTabs
        tabPosition={isDesktop ? "left" : "top"}
        items={[
          {
            key: "orders",
            label: "Orders",
            children: (
              <ContentWrapper>
                <HeaderRow style={{ marginBottom: 16 }}>
                  <StyledTitle level={4}>Your Order History</StyledTitle>
                </HeaderRow>
                {customerOrders.length ? (
                  <Table
                    rowKey="id"
                    columns={orderColumns}
                    dataSource={customerOrders}
                    pagination={{ pageSize: 6 }}
                    scroll={{ x: 600 }}
                  />
                ) : (
                  <Empty description="You haven't placed any orders yet" />
                )}
              </ContentWrapper>
            ),
          },

          {
            key: "profile",
            label: "Profile",
            children: (
              <ContentWrapper>
                {/* Contact Section */}
                <SectionContainer>
                  <HeaderRow>
                    <StyledTitle level={5}>Contact Information</StyledTitle>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => setIsContactModalOpen(true)}
                    >
                      Edit
                    </Button>
                  </HeaderRow>

                  <StyledCard>
                    <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                      <Text strong>Full Name</Text>
                      <Text>{user?.name}</Text>
                    </Flex>
                    <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                      <Text strong>Email</Text>
                      <Text>{user?.email}</Text>
                    </Flex>
                    <Flex justify="space-between" align="center">
                      <Text strong>Phone</Text>
                      <Text>{user?.phone || "Not provided"}</Text>
                    </Flex>
                  </StyledCard>
                </SectionContainer>

                {/* Addresses Section */}
                <SectionContainer>
                  <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
                    <StyledTitle level={5}>Delivery Addresses</StyledTitle>
                    <Button
                      icon={<PlusOutlined />}
                      type="primary"
                      shape="round"
                      onClick={() => setIsAddressModalOpen(true)}
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
                    <Space direction="vertical" style={{ width: "100%" }} size={12}>
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
                              <Text type="secondary" style={{ display: "block" }}>
                                {addr.addressLine1}
                                {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                              </Text>
                              <Text type="secondary" style={{ display: "block" }}>
                                {addr.city} {addr.postalCode || ""} • {addr.phone}
                              </Text>
                            </div>

                            <Space>
                              {!addr.isDefault && (
                                <Button
                                  size="small"
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                >
                                  Set as Default
                                </Button>
                              )}
                              <Popconfirm
                                title="Remove this address?"
                                onConfirm={() => handleDeleteAddress(addr.id)}
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
                    </Space>
                  )}
                </SectionContainer>

                {/* Marketing Preferences Section */}
                <SectionContainer>
                  <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
                    <StyledTitle level={5}>Marketing Preferences</StyledTitle>
                  </Flex>

                  <StyledCard>
                    <Flex justify="space-between" align="center">
                      <Flex align="center" gap={8}>
                        <MailOutlined />
                        <div>
                          <Text strong style={{ display: "block" }}>
                            Fresh Batch & Flavor Drops
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Receive early access to weekly limited batch releases
                          </Text>
                        </div>
                      </Flex>
                      <Switch
                        checked={marketingEmail}
                        onChange={handleToggleMarketing}
                      />
                    </Flex>
                  </StyledCard>
                </SectionContainer>

                {/* Sign Out Section */}
                <SignOutWrapper>
                  <Button size="large" onClick={handleLogout}>
                    Sign out
                  </Button>

                  <SignOutLink onClick={handleLogout}>
                    Sign out of all devices
                  </SignOutLink>
                </SignOutWrapper>
              </ContentWrapper>
            ),
          },
        ]}
      />

      <EditContactModal
        open={isContactModalOpen}
        initialValues={{ name: user?.name || "", phone: user?.phone }}
        onCancel={() => setIsContactModalOpen(false)}
        onSubmit={handleSaveContact}
      />

      <AddAddressModal
        open={isAddressModalOpen}
        onCancel={() => setIsAddressModalOpen(false)}
        onSubmit={handleAddAddress}
      />
    </ProfileContainer>
  );
};

export default CustomerProfile;
