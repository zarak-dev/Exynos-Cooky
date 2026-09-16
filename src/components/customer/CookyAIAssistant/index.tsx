import React, { useState, useRef, useEffect, useCallback } from "react";
import { Drawer, Button, Flex, Typography, message } from "antd";
import { ThunderboltOutlined, ClearOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store";
import {
  askAIRequest,
  clearAIConversation,
  setAIAssistantOpen,
} from "../../../store/slices/aiSlice";
import { addCookieWithFeedback } from "../../../utils/cartActions";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { FloatingActionButtons } from "./components/FloatingActionButtons";
import { ChatMessagesList } from "./components/ChatMessagesList";
import { ChatInputBar } from "./components/ChatInputBar";

const { Text } = Typography;

const SUGGESTED_QUESTIONS = [
  "What sweet chocolate options do you have? 🍫",
  "Recommend 2 caramel & nutty options 🥜",
  "Give me something velvety or fruity 🍓",
  "Show me your bestselling lava cookies! 🤤",
];

export const CookyAIAssistant: React.FC = () => {
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();

  const { isAIAssistantOpen, messages, loading } = useSelector(
    (state: RootState) => state.ai,
  );
  const cookies = useSelector((state: RootState) => state.inventory.items);
  const { items: cartItems, boxSize } = useSelector(
    (state: RootState) => state.cart,
  );
  const isMobile = useMediaQuery("(max-width: 480px)");

  const rafIdRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (rafIdRef.current !== null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const el = messagesContainerRef.current;
      if (!el) return;
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      isNearBottomRef.current = distanceFromBottom < 80;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const scrollToBottom = useCallback((force = false) => {
    if (force || isNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (isAIAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAIAssistantOpen, scrollToBottom]);

  const handleSendMessage = useCallback(
    (textToSend?: string) => {
      const text = textToSend || inputText;
      if (!text.trim() || loading) return;

      dispatch(askAIRequest({ prompt: text.trim() }));
      setInputText("");
      isNearBottomRef.current = true;
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    },
    [inputText, loading, dispatch],
  );

  const handleAddCookie = useCallback(
    (productId: number) => {
      const targetCookie = cookies.find((c) => c.id === productId);
      if (!targetCookie) {
        messageApi.error("Cookie not found in current kitchen inventory");
        return;
      }
      addCookieWithFeedback(
        targetCookie,
        cartItems.length,
        boxSize,
        dispatch,
        messageApi,
      );
    },
    [cookies, cartItems.length, boxSize, dispatch, messageApi],
  );

  return (
    <>
      {contextHolder}

      {/* Floating Action Buttons (WhatsApp + AI Assistant) */}
      <FloatingActionButtons
        onOpenAssistant={() => dispatch(setAIAssistantOpen(true))}
      />

      {/* AI Assistant Drawer */}
      <Drawer
        title={
          <Flex align="center" justify="space-between" style={{ width: "100%" }}>
            <Flex align="center" gap={10}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #00009c 0%, #722ed1 100%)",
                  color: "#ffd666",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                <ThunderboltOutlined />
              </div>
              <div>
                <Text strong style={{ fontSize: 16, display: "block" }}>
                  Cooky AI Assistant
                </Text>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  Artisan Sommelier • Powered by Grok
                </Text>
              </div>
            </Flex>
            <Button
              type="text"
              size="small"
              icon={<ClearOutlined />}
              onClick={() => dispatch(clearAIConversation())}
              title="Clear conversation"
            >
              Clear
            </Button>
          </Flex>
        }
        placement="right"
        size={isMobile ? "large" : "default"}
        onClose={() => dispatch(setAIAssistantOpen(false))}
        open={isAIAssistantOpen}
        styles={{
          wrapper: {
            width: isMobile ? "100%" : 420,
            maxWidth: "100vw",
          },
          body: {
            display: "flex",
            flexDirection: "column",
            padding: "16px",
            backgroundColor: "#f9faff",
          },
        }}
      >
        {/* Messages List & Recommendations */}
        <ChatMessagesList
          messages={messages}
          loading={loading}
          containerRef={messagesContainerRef}
          endRef={messagesEndRef}
          onScroll={handleScroll}
          onAddCookie={handleAddCookie}
          cookies={cookies}
        />

        {/* Input Bar & Suggestion Chips */}
        <ChatInputBar
          inputText={inputText}
          setInputText={setInputText}
          loading={loading}
          onSend={handleSendMessage}
          suggestedQuestions={SUGGESTED_QUESTIONS}
          messagesCount={messages.length}
        />
      </Drawer>
    </>
  );
};

export default CookyAIAssistant;
