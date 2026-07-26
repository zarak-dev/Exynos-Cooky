import React, { useEffect, useMemo } from "react";
import { Switch, Table, Empty, Grid } from "antd"; // 🌟 Added Grid here
import { EnvironmentOutlined, MailOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type RootState } from "../../../store";
import { logoutUser } from "../../../store/slices/authSlice";
import {
  ProfileContainer,
  SidebarTabs,
  ContentWrapper,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  InfoCard,
  InfoRow,
  IconRow,
  LabelText,
  ValueText,
  OutlinedButton,
  SignOutWrapper,
  SignOutLink,
} from "./styles";

const { useBreakpoint } = Grid;

const CustomerProfile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const user = useSelector((state: RootState) => state.auth.user);
  const orders = useSelector((state: RootState) => state.orders.orders);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const customerOrders = useMemo(() => {
    if (!user?.name) return [];
    return orders.filter((o) => o.customerName === user.name);
  }, [orders, user?.name]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  if (!isLoggedIn) {
    return null;
  }

  const renderProfile = () => (
    <ContentWrapper>
      {/* --- CONTACT SECTION --- */}
      <SectionContainer>
        <SectionHeader>
          <SectionTitle level={4}>Contact</SectionTitle>
          <OutlinedButton size="middle">Edit</OutlinedButton>
        </SectionHeader>
        <InfoCard>
          <InfoRow>
            <LabelText>Email</LabelText>
            <ValueText>{user?.email}</ValueText>
          </InfoRow>
        </InfoCard>
      </SectionContainer>

      {/* --- ADDRESSES SECTION --- */}
      <SectionContainer>
        <SectionHeader>
          <SectionTitle level={4}>Addresses</SectionTitle>
          <OutlinedButton size="middle">Add</OutlinedButton>
        </SectionHeader>
        <InfoCard>
          <IconRow>
            <EnvironmentOutlined />
            <LabelText>No addresses added</LabelText>
          </IconRow>
        </InfoCard>
      </SectionContainer>

      {/* --- MARKETING PREFERENCES SECTION --- */}
      <SectionContainer>
        <SectionHeader>
          <SectionTitle level={4}>Marketing preferences</SectionTitle>
        </SectionHeader>
        <InfoCard>
          <InfoRow>
            <IconRow>
              <MailOutlined />
              <ValueText>Email</ValueText>
            </IconRow>
            <Switch defaultChecked={false} />
          </InfoRow>
        </InfoCard>
      </SectionContainer>

      {/* --- SIGN OUT SECTION --- */}
      <SignOutWrapper>
        <OutlinedButton size="large" onClick={handleLogout}>
          Sign out
        </OutlinedButton>
        <SignOutLink onClick={handleLogout}>
          Sign out of all devices
        </SignOutLink>
      </SignOutWrapper>
    </ContentWrapper>
  );

  const renderOrders = () => (
    <ContentWrapper>
      {customerOrders.length > 0 ? (
        <Table
          dataSource={customerOrders}
          rowKey="id"
          pagination={false}
          scroll={{ x: 600 }}
          columns={[
            { title: "Order ID", dataIndex: "id", key: "id" },
            {
              title: "Date",
              dataIndex: "timestamp",
              key: "timestamp",
              render: (val) =>
                val ? new Date(val).toLocaleDateString() : "N/A",
            },
            { title: "Status", dataIndex: "status", key: "status" },
            {
              title: "Total",
              dataIndex: "totalPrice",
              key: "total",
              render: (val) => `Rs. ${val}`,
            },
          ]}
        />
      ) : (
        <Empty
          description={
            <LabelText>You haven't placed any orders yet.</LabelText>
          }
        />
      )}
    </ContentWrapper>
  );

  return (
    <ProfileContainer>
      <SidebarTabs
        tabPosition={screens.md ? "left" : "top"} //
        items={[
          {
            key: "orders",
            label: "Orders",
            children: renderOrders(),
          },
          {
            key: "profile",
            label: "Profile",
            children: renderProfile(),
          },
        ]}
      />
    </ProfileContainer>
  );
};

export default CustomerProfile;
