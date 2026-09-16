import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  message,
  Typography,
  Tag,
  Space,
  Divider,
  Alert,
} from "antd";
import {
  ShieldCheck,
  User,
  KeyRound,
  Mail,
  Phone,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@src/store";
import { updateUserProfile } from "@src/store/slices/authSlice";
import { authService } from "@src/services/supabase/authService";
import { profileService } from "@src/services/supabase/profileService";
import StyledPageHeader from "@src/components/PageHeader";
import { Wrapper } from "@src/components/Wrapper";
import styled from "styled-components";

const { Title, Text, Paragraph } = Typography;

const ProfileCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e4e4e7;
  height: 100%;

  .ant-card-head {
    border-bottom: 1px solid #f4f4f5;
    padding: 16px 20px;
    font-weight: 600;
  }

  .ant-card-body {
    padding: 20px;
  }
`;

const AdminAvatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background: linear-gradient(135deg, #09090b 0%, #27272a 100%);
  color: #fafafa;
  font-size: 26px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
`;

const IdentityHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;

  @media (max-width: 576px) {
    flex-direction: column;
    text-align: center;
  }
`;

const StyledSubmitBtn = styled(Button)`
  background: #09090b;
  border-color: #09090b;
  color: #fff;
  font-weight: 600;
  height: 42px;
  border-radius: 8px;

  &:hover,
  &:focus {
    background: #27272a !important;
    border-color: #27272a !important;
    color: #fff !important;
  }
`;

export const AdminProfile: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [profileForm] = Form.useForm<{ name: string; phone: string }>();
  const [passwordForm] = Form.useForm<{
    newPassword: string;
    confirmPassword: string;
  }>();

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user, profileForm]);

  const initials =
    (user?.name || "Admin")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "AD";

  const handleUpdateProfile = async (values: { name: string; phone: string }) => {
    if (!user?.id) {
      message.error("No active user session found.");
      return;
    }
    setSavingProfile(true);
    try {
      const updated = await profileService.updateProfile(user.id, {
        name: values.name.trim(),
        phone: values.phone?.trim(),
      });
      dispatch(updateUserProfile(updated));
      message.success("Admin profile details updated successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      message.error(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }
    if (values.newPassword.length < 6) {
      message.error("Password must be at least 6 characters long.");
      return;
    }

    setSavingPassword(true);
    try {
      await authService.updatePassword(values.newPassword);
      message.success("Admin password changed successfully!");
      passwordForm.resetFields();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to change password";
      message.error(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      <StyledPageHeader
        title="Admin Profile & Security"
        breadcrumbs={[
          { title: "Dashboard", to: "/admin" },
          { title: "Admin Profile" },
        ]}
        extra={
          <Space>
            <Tag
              icon={<ShieldCheck size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />}
              color="success"
              style={{ padding: "4px 10px", fontSize: 13, borderRadius: 6 }}
            >
              Role: System Administrator
            </Tag>
          </Space>
        }
      />

      <Wrapper>
        <Row gutter={[24, 24]}>
          {/* LEFT COLUMN: Identity & Contact Info */}
          <Col xs={24} lg={12}>
            <ProfileCard
              title={
                <Space>
                  <User size={18} />
                  <span>Admin Identity & Details</span>
                </Space>
              }
            >
              <IdentityHeader>
                <AdminAvatar>{initials}</AdminAvatar>
                <div>
                  <Title level={4} style={{ margin: "0 0 4px 0", color: "#09090b" }}>
                    {user?.name || "System Administrator"}
                  </Title>
                  <Space wrap size={[6, 6]}>
                    <Tag color="geekblue" icon={<Mail size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />}>
                      {user?.email || "admin@exynoscooky.com"}
                    </Tag>
                    <Tag color="purple">
                      <Sparkles size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
                      Operations Lead
                    </Tag>
                  </Space>
                </div>
              </IdentityHeader>

              <Divider style={{ margin: "16px 0 24px" }} />

              <Form
                form={profileForm}
                layout="vertical"
                onFinish={handleUpdateProfile}
              >
                <Form.Item
                  name="name"
                  label={<Text strong>Administrator Display Name</Text>}
                  rules={[
                    { required: true, message: "Please enter your name" },
                    { min: 2, message: "Name must be at least 2 characters" },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<User size={16} style={{ color: "#a1a1aa", marginRight: 4 }} />}
                    placeholder="e.g. Mirza Zarak"
                  />
                </Form.Item>

                <Form.Item
                  label={<Text strong>Administrator Email (Primary Identity)</Text>}
                >
                  <Input
                    size="large"
                    disabled
                    value={user?.email || "admin@exynoscooky.com"}
                    prefix={<Mail size={16} style={{ color: "#a1a1aa", marginRight: 4 }} />}
                  />
                  <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 4 }}>
                    Email is linked to Supabase authentication and cannot be changed here.
                  </Text>
                </Form.Item>

                <Form.Item
                  name="phone"
                  label={<Text strong>Emergency / Staff Contact Phone</Text>}
                  rules={[
                    { pattern: /^[0-9+-\s]+$/, message: "Please enter a valid phone number" },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<Phone size={16} style={{ color: "#a1a1aa", marginRight: 4 }} />}
                    placeholder="e.g. +92 300 1234567"
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
                  <StyledSubmitBtn
                    type="primary"
                    htmlType="submit"
                    loading={savingProfile}
                    block
                  >
                    Save Profile Changes
                  </StyledSubmitBtn>
                </Form.Item>
              </Form>
            </ProfileCard>
          </Col>

          {/* RIGHT COLUMN: Password Change & Security */}
          <Col xs={24} lg={12}>
            <Space orientation="vertical" size={24} style={{ width: "100%" }}>
              <ProfileCard
                title={
                  <Space>
                    <KeyRound size={18} />
                    <span>Change Admin Password</span>
                  </Space>
                }
              >
                <Alert
                  type="info"
                  showIcon
                  icon={<Lock size={16} />}
                  message="Secure Account Authentication"
                  description="Setting a new password immediately updates your Supabase authentication record for the admin panel."
                  style={{ marginBottom: 20, borderRadius: 8 }}
                />

                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handleChangePassword}
                >
                  <Form.Item
                    name="newPassword"
                    label={<Text strong>New Password</Text>}
                    rules={[
                      { required: true, message: "Please enter a new password" },
                      { min: 6, message: "Password must be at least 6 characters" },
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      size="large"
                      placeholder="Minimum 6 characters"
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label={<Text strong>Confirm New Password</Text>}
                    dependencies={["newPassword"]}
                    hasFeedback
                    rules={[
                      { required: true, message: "Please confirm your new password" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("newPassword") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("Passwords do not match!"));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      size="large"
                      placeholder="Re-enter new password"
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
                    <StyledSubmitBtn
                      type="primary"
                      htmlType="submit"
                      loading={savingPassword}
                      block
                    >
                      Update Password
                    </StyledSubmitBtn>
                  </Form.Item>
                </Form>
              </ProfileCard>

              <Card
                style={{
                  borderRadius: 12,
                  border: "1px dashed #d4d4d8",
                  background: "#fafafa",
                }}
              >
                <Space align="start" size={14}>
                  <CheckCircle2 size={22} style={{ color: "#16a34a", marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <Text strong style={{ display: "block", marginBottom: 4, color: "#18181b" }}>
                      Administrative Security Best Practices
                    </Text>
                    <Paragraph type="secondary" style={{ fontSize: 13, margin: 0 }}>
                      Always choose a distinct passphrase not used elsewhere. As an administrator, your credentials grant full access to live kitchen queue orders, store inventory, pricing structures, and customer profiles.
                    </Paragraph>
                  </div>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>
      </Wrapper>
    </>
  );
};

export default AdminProfile;
