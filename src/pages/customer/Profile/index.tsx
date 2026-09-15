import React, { useEffect, useState } from "react";
import { Switch, Flex, Button, message, Typography } from "antd";
import { EditOutlined, MailOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type RootState } from "../../../store";
import { logoutUser } from "../../../store/slices/authSlice";
import { fetchOrdersRequest } from "../../../store/slices/orderSlice";
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
import { StyledCard } from "../../../components/StyledCard";
import { StyledTitle } from "../../../components/StyledTitle";
import { EditContactModal } from "./components/EditContactModal";
import { AddAddressModal } from "./components/AddAddressModal";
import { ProfileOrdersCard } from "./components/ProfileOrdersCard";
import { ProfileAddressesCard } from "./components/ProfileAddressesCard";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

const { Text } = Typography;

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
    if (user?.id && addresses.length === 0) {
      dispatch(fetchAddressesRequest(user.id));
    }
    if (user?.email && orders.length === 0) {
      dispatch(fetchOrdersRequest({ userEmail: user.email }));
    }
  }, [user?.id, user?.email, addresses.length, orders.length, dispatch]);

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
            children: <ProfileOrdersCard orders={customerOrders} />,
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
                <ProfileAddressesCard
                  addresses={addresses}
                  onOpenAddModal={() => setIsAddressModalOpen(true)}
                  onSetDefault={handleSetDefaultAddress}
                  onDelete={handleDeleteAddress}
                />

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
