import React, { useEffect, useState, useMemo } from "react";
import { Switch, Flex, Button, message, Typography, Tag, Space, Row, Col } from "antd";
import { EditOutlined } from "@ant-design/icons";
import {
  ShoppingBag,
  User as UserIcon,
  Mail,
  LogOut,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type RootState } from "@src/store";
import { logoutUser } from "@src/store/slices/authSlice";
import { fetchOrdersRequest } from "@src/store/slices/orderSlice";
import {
  fetchAddressesRequest,
  addAddressRequest,
  deleteAddressRequest,
  setDefaultAddressRequest,
  updateProfileRequest,
} from "@src/store/slices/profileSlice";
import type { AddressInput } from "@src/types/address";
import {
  ProfileContainer,
  ProfileHeroCard,
  HeroFlex,
  HeroIdentity,
  HeroAvatar,
  HeroStats,
  StatPill,
  SidebarTabs,
  ContentWrapper,
  SectionContainer,
  SignOutWrapper,
  SignOutLink,
  HeaderRow,
} from "./styles";
import { StyledCard } from "@src/components/StyledCard";
import { StyledTitle } from "@src/components/StyledTitle";
import { EditContactModal } from "./components/EditContactModal";
import { AddAddressModal } from "./components/AddAddressModal";
import { ProfileOrdersCard } from "./components/ProfileOrdersCard";
import { ProfileAddressesCard } from "./components/ProfileAddressesCard";
import { useMediaQuery } from "@src/hooks/useMediaQuery";

const { Text, Title, Paragraph } = Typography;

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

  // Always fetch fresh orders and addresses when user profile mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAddressesRequest(user.id));
    }
    if (user?.email || user?.id) {
      dispatch(fetchOrdersRequest({ userEmail: user?.email, userId: user?.id }));
    }
  }, [user?.id, user?.email, dispatch]);

  // Robust matching on user ID or email (case-insensitive)
  const customerOrders = useMemo(() => {
    if (!user) return [];
    return orders
      .filter((order) => {
        const matchesId = Boolean(user.id && order.userId && order.userId === user.id);
        const matchesEmail = Boolean(
          user.email &&
            order.customerEmail &&
            order.customerEmail.toLowerCase().trim() === user.email.toLowerCase().trim(),
        );
        return matchesId || matchesEmail;
      })
      .sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return timeB - timeA;
      });
  }, [orders, user]);

  const initials =
    (user?.name || "Customer")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "EC";

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

  if (!isLoggedIn) {
    return null;
  }

  return (
    <ProfileContainer>
      {/* AESTHETIC HERO PROFILE BANNER */}
      <ProfileHeroCard>
        <HeroFlex>
          <HeroIdentity>
            <HeroAvatar>{initials}</HeroAvatar>
            <div>
              <Flex align="center" gap={10} wrap="wrap" style={{ marginBottom: 4 }}>
                <Title level={3} style={{ color: "#ffffff", margin: 0, fontWeight: 800 }}>
                  {user?.name || "Valued Member"}
                </Title>
                <Tag
                  color="gold"
                  style={{
                    borderRadius: 9999,
                    fontWeight: 700,
                    padding: "2px 10px",
                    border: "none",
                  }}
                >
                  Cookie Club Member 🍪
                </Tag>
              </Flex>
              <Paragraph style={{ color: "rgba(255, 255, 255, 0.85)", margin: 0, fontSize: 14 }}>
                {user?.email}
              </Paragraph>
            </div>
          </HeroIdentity>

          <HeroStats>
            <StatPill>
              <span className="stat-label">Orders</span>
              <span className="stat-value">{customerOrders.length}</span>
            </StatPill>
            <StatPill>
              <span className="stat-label">Addresses</span>
              <span className="stat-value">{addresses.length}</span>
            </StatPill>
            <StatPill>
              <span className="stat-label">Status</span>
              <span className="stat-value" style={{ fontSize: 14, color: "#86efac" }}>
                Active
              </span>
            </StatPill>
          </HeroStats>
        </HeroFlex>
      </ProfileHeroCard>

      {/* MODERN TABS INTERFACE */}
      <SidebarTabs
        defaultActiveKey="orders"
        tabPosition={isDesktop ? "top" : "top"}
        items={[
          {
            key: "orders",
            label: (
              <Space size={8}>
                <ShoppingBag size={16} />
                <span>Orders ({customerOrders.length})</span>
              </Space>
            ),
            children: <ProfileOrdersCard orders={customerOrders} />,
          },
          {
            key: "profile",
            label: (
              <Space size={8}>
                <UserIcon size={16} />
                <span>Contact & Security</span>
              </Space>
            ),
            children: (
              <ContentWrapper>
                {/* Contact Section */}
                <SectionContainer>
                  <HeaderRow>
                    <div>
                      <StyledTitle level={5} style={{ margin: 0, color: "#00009c" }}>
                        Contact Details
                      </StyledTitle>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        Your personal contact information used for fresh batch updates and deliveries
                      </Text>
                    </div>
                    <Button
                      icon={<EditOutlined />}
                      shape="round"
                      onClick={() => setIsContactModalOpen(true)}
                    >
                      Edit Details
                    </Button>
                  </HeaderRow>

                  <StyledCard>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={8}>
                        <Flex vertical gap={4}>
                          <Text type="secondary" style={{ fontSize: 12 }}>FULL NAME</Text>
                          <Text strong style={{ fontSize: 14 }}>{user?.name || "Not provided"}</Text>
                        </Flex>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Flex vertical gap={4}>
                          <Text type="secondary" style={{ fontSize: 12 }}>EMAIL ADDRESS</Text>
                          <Text strong style={{ fontSize: 14 }}>{user?.email}</Text>
                        </Flex>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Flex vertical gap={4}>
                          <Text type="secondary" style={{ fontSize: 12 }}>PHONE NUMBER</Text>
                          <Text strong style={{ fontSize: 14 }}>{user?.phone || "Not provided"}</Text>
                        </Flex>
                      </Col>
                    </Row>
                  </StyledCard>
                </SectionContainer>

                {/* Delivery Addresses Section */}
                <ProfileAddressesCard
                  addresses={addresses}
                  onOpenAddModal={() => setIsAddressModalOpen(true)}
                  onSetDefault={handleSetDefaultAddress}
                  onDelete={handleDeleteAddress}
                />

                {/* Marketing Preferences Section */}
                <SectionContainer>
                  <HeaderRow>
                    <div>
                      <StyledTitle level={5} style={{ margin: 0, color: "#00009c" }}>
                        Marketing & Exclusive Drops
                      </StyledTitle>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        Get notified when limited-edition seasonal batches come out of the oven
                      </Text>
                    </div>
                  </HeaderRow>

                  <StyledCard>
                    <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
                      <Flex align="center" gap={12}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 8,
                            background: "#eef2ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#00009c",
                          }}
                        >
                          <Mail size={18} />
                        </div>
                        <div>
                          <Text strong style={{ display: "block" }}>
                            Fresh Batch & Secret Recipe Drops
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Receive VIP early access notifications to weekly limited batch releases
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
                  <Button
                    size="large"
                    danger
                    icon={<LogOut size={16} />}
                    onClick={handleLogout}
                    shape="round"
                  >
                    Sign Out
                  </Button>

                  <SignOutLink onClick={handleLogout}>
                    Sign out of current browser session
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
