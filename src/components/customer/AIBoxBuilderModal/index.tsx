import React, { useState } from "react";
import {
  Modal,
  Button,
  Radio,
  Input,
  Typography,
  Card,
  Flex,
  Tag,
  Spin,
  Space,
  Alert,
  message,
} from "antd";
import {
  ThunderboltOutlined,
  CheckCircleOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store";
import {
  buildBoxSuccess,
} from "../../../store/slices/aiSlice";
import {
  setBoxSize,
  clearBox,
  addCookieToBox,
  setCartOpen,
} from "../../../store/slices/cartSlice";
import type { BoxSize } from "../../../types/cart";
import { aiService } from "../../../services/ai/aiService";

const { Text, Paragraph } = Typography;

interface AIBoxBuilderModalProps {
  open: boolean;
  onCancel: () => void;
}

const PRESET_PROMPTS = [
  "Rich dark chocolate and salted caramel, balanced sweetness",
  "Fruity velvet cookies and vanilla cream for a celebration",
  "Nutty textures with biscoff crunch and peanut butter",
];

export const AIBoxBuilderModal: React.FC<AIBoxBuilderModalProps> = ({
  open,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState<BoxSize>(6);
  const [customPrompt, setCustomPrompt] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inventory = useSelector((state: RootState) => state.inventory.items);
  const recommendation = useSelector(
    (state: RootState) => state.ai.activeBoxRecommendation,
  );

  const handleGenerateBox = async () => {
    const preferences = customPrompt.trim() || "A gourmet assortment of our bestselling flavors";
    setLocalLoading(true);
    setErrorMsg(null);

    try {
      const result = await aiService.buildBox({
        boxSize: selectedSize,
        preferences,
      });
      dispatch(buildBoxSuccess(result));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not generate box";
      setErrorMsg(msg);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleApplyToCart = () => {
    if (!recommendation) return;

    // 1. Validate Schema & Box Size
    const allowedSizes = [4, 6, 12];
    if (!allowedSizes.includes(recommendation.boxSize)) {
      message.error("Invalid AI recommendation: Box size must be 4, 6, or 12.");
      return;
    }

    if (!Array.isArray(recommendation.items) || recommendation.items.length === 0) {
      message.error("Invalid AI recommendation: Box contains no items.");
      return;
    }

    // 2. Validate product IDs, quantities, and availability against authoritative inventory
    let totalQuantity = 0;
    const itemsToAdd: Array<{ cookie: typeof inventory[0]; quantity: number }> = [];

    for (const item of recommendation.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        message.error(`Invalid quantity (${item.quantity}) suggested for cookie.`);
        return;
      }

      totalQuantity += item.quantity;

      const targetCookie = inventory.find((c) => c.id === item.productId);
      if (!targetCookie) {
        message.error(`AI suggested a cookie ID (${item.productId}) that does not exist in our kitchen catalog.`);
        return;
      }

      if (!targetCookie.isAvailable) {
        message.error(`"${targetCookie.name}" is currently marked unavailable.`);
        return;
      }

      if (targetCookie.stock < item.quantity) {
        message.error(`Insufficient stock for "${targetCookie.name}". Only ${targetCookie.stock} available, AI requested ${item.quantity}.`);
        return;
      }

      itemsToAdd.push({ cookie: targetCookie, quantity: item.quantity });
    }

    // 3. Validate total count matches box size
    if (totalQuantity !== recommendation.boxSize) {
      message.error(`AI box composition total (${totalQuantity}) does not match required box size (${recommendation.boxSize}).`);
      return;
    }

    // 4. Authoritative cart update using kitchen catalog prices only
    dispatch(setBoxSize(recommendation.boxSize));
    dispatch(clearBox());

    let addedCount = 0;
    for (const { cookie, quantity } of itemsToAdd) {
      for (let i = 0; i < quantity; i++) {
        dispatch(addCookieToBox(cookie));
        addedCount++;
      }
    }

    message.success(
      `Custom ${recommendation.boxSize}-pack with ${addedCount} cookies loaded into your box! 🍪`,
    );
    onCancel();
    dispatch(setCartOpen(true));
  };

  return (
    <Modal
      title={
        <Flex align="center" gap={8}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#00009c",
              color: "#ffd666",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThunderboltOutlined />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700 }}>
            Grok AI Smart Box Builder
          </span>
        </Flex>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
      destroyOnHidden
    >
      <Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Tell our AI sommelier who this box is for or what flavors you desire. We'll
        balance sweetness, textures, and batch availability automatically.
      </Paragraph>

      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: "block", marginBottom: 8 }}>
          1. Select Box Size:
        </Text>
        <Radio.Group
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value={4}>4-Cookie Sampler</Radio.Button>
          <Radio.Button value={6}>6-Cookie Party Box</Radio.Button>
          <Radio.Button value={12}>12-Cookie Grand Feast</Radio.Button>
        </Radio.Group>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: "block", marginBottom: 8 }}>
          2. Flavor Desires or Occasion:
        </Text>
        <Input.TextArea
          rows={3}
          placeholder="e.g. Someone who loves chocolate and caramel but doesn't like very sweet cookies..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
        />
        <div style={{ marginTop: 8 }}>
          <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
            Or pick a favorite profile:
          </Text>
          <Space wrap size={[6, 6]}>
            {PRESET_PROMPTS.map((prompt, idx) => (
              <Tag
                key={idx}
                style={{ cursor: "pointer" }}
                onClick={() => setCustomPrompt(prompt)}
              >
                {prompt}
              </Tag>
            ))}
          </Space>
        </div>
      </div>

      <Button
        type="primary"
        shape="round"
        icon={<ThunderboltOutlined />}
        block
        size="large"
        loading={localLoading}
        onClick={handleGenerateBox}
        style={{ marginBottom: 16 }}
      >
        Compose Custom Box with AI
      </Button>

      {errorMsg && (
        <Alert type="error" message={errorMsg} showIcon style={{ marginBottom: 16 }} />
      )}

      {localLoading && (
        <Flex justify="center" align="center" style={{ padding: 24 }}>
          <Spin size="large" />
          <Text style={{ marginLeft: 12 }}>Consulting bakery catalog...</Text>
        </Flex>
      )}

      {recommendation && !localLoading && (
        <Card
          size="small"
          style={{
            background: "#f9faff",
            borderColor: "#d6e4ff",
            borderRadius: 8,
          }}
        >
          <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
            <Tag color="blue" icon={<GiftOutlined />}>
              {recommendation.theme}
            </Tag>
            <Text type="secondary">{recommendation.boxSize} Cookies Total</Text>
          </Flex>

          <Paragraph style={{ fontSize: 13, marginBottom: 12 }}>
            {recommendation.explanation}
          </Paragraph>

          <Space orientation="vertical" style={{ width: "100%", marginBottom: 16 }} size={6}>
            {recommendation.items.map((item, idx) => (
              <Flex
                key={idx}
                justify="space-between"
                align="center"
                style={{
                  padding: "6px 10px",
                  background: "#ffffff",
                  borderRadius: 6,
                  border: "1px solid #f0f0f0",
                }}
              >
                <div>
                  <Text strong>{item.productName}</Text>
                  {item.reason && (
                    <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
                      {item.reason}
                    </Text>
                  )}
                </div>
                <Tag color="purple">× {item.quantity}</Tag>
              </Flex>
            ))}
          </Space>

          <Button
            type="primary"
            shape="round"
            block
            size="large"
            icon={<CheckCircleOutlined />}
            onClick={handleApplyToCart}
            style={{
              backgroundColor: "#389e0d",
              borderColor: "#389e0d",
            }}
          >
            Fill My Box With These Cookies
          </Button>
        </Card>
      )}
    </Modal>
  );
};
