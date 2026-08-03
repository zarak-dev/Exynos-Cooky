import React from "react";
import { Button, Result, Typography } from "antd";
import {
  CenteredContainer,
  SuccessCard,
  SuccessTitle,
  TrackingBox,
  TrackingLabel,
  TrackingNumber,
  TrackingSubtext,
  BrandButton,
} from "../styles";

const { Paragraph } = Typography;

interface OrderConfirmedProps {
  orderId: string;
  onTrack: () => void;
  onBackToShop: () => void;
}

export const OrderConfirmed: React.FC<OrderConfirmedProps> = ({
  orderId,
  onTrack,
  onBackToShop,
}) => (
  <CenteredContainer>
    <SuccessCard variant="borderless">
      <Result
        status="success"
        title={<SuccessTitle level={3}>Order Confirmed!</SuccessTitle>}
        subTitle={
          <>
            <Paragraph>
              Your cookie box is being prepared and will head your way shortly.
            </Paragraph>
            <TrackingBox vertical align="center">
              <TrackingLabel type="secondary">TRACKING NUMBER</TrackingLabel>
              <TrackingNumber copyable>{orderId}</TrackingNumber>
              <TrackingSubtext type="secondary">
                Use this to track your order live.
              </TrackingSubtext>
            </TrackingBox>
          </>
        }
        extra={[
          <BrandButton
            type="primary"
            key="track"
            size="large"
            onClick={onTrack}
          >
            Track My Order
          </BrandButton>,
          <Button key="home" size="large" onClick={onBackToShop}>
            Back to Shop
          </Button>,
        ]}
      />
    </SuccessCard>
  </CenteredContainer>
);
