import styled from "styled-components";
import {
  Card,
  Button,
  Tabs,
  Typography,
  Flex,
  Image,
  Carousel,
  Tag,
} from "antd";
import Title from "antd/es/typography/Title";
import { StyledTitle } from "../../../components/StyledTitle";

const { Text, Paragraph } = Typography;
const { Meta } = Card;

export const HomeContainer = styled.div`
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 576px) {
    padding: 32px 12px;
  }
`;

export const CoverImage = styled(Image)`
  height: 280px !important;
  object-fit: cover !important;
  padding: 12px !important;
  background: #fafafa !important;

  @media (max-width: 576px) {
    height: 220px !important;
    padding: 8px !important;
  }
`;

export const CardHeader = styled(Flex)`
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;

  .ant-typography {
    margin-bottom: 0 !important;
    flex: 1;
    min-width: 120px;
  }
`;

export const StyledButton = styled(Button)`
  width: 100%;
  height: 45px;
`;

export const ExploreSection = styled.div`
  max-width: 500px;
  margin: 0 auto 40px;
  text-align: center;
`;

export const MenuTabs = styled(Tabs)`
  .ant-tabs-nav-wrap {
    justify-content: center;
  }

  .ant-tabs-tab {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 1.1rem;
    padding: 12px 24px !important;

    &:hover {
      color: #00009c !important;
    }
  }

  .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #00009c !important;
  }

  .ant-tabs-ink-bar {
    background: #00009c !important;
    height: 3px !important;
  }
`;

export const NoResults = styled(Paragraph)`
  &.ant-typography {
    text-align: center;
    padding: 60px 20px;
    font-size: 1.1rem;
    color: #666;
  }
`;

export const RatingWrapper = styled(Flex)`
  margin: -4px 0 12px;
`;

export const ReviewCountText = styled(Text)`
  margin-left: 8px;
  font-size: 0.8rem;
  color: #666;
`;

export const BestSection = styled.div`
  max-width: 1200px;
  margin: 48px auto 0;
  padding: 0 40px 24px;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0 12px 20px;
    margin: 32px auto 0;
  }
`;

export const BestSectionTitle = styled(Title)`
  &.ant-typography {
    text-align: center;
    color: #00009c;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: 15px;
    font-size: 1.4rem;

    @media (max-width: 576px) {
      font-size: 1.25rem;
    }
  }
`;

export const BestCarousel = styled(Carousel)`
  width: 100%;
  max-width: 100%;

  .slick-track {
    display: flex !important;
    align-items: stretch;
  }

  .slick-slide {
    height: auto !important;
    background: transparent;

    > div {
      height: 100%;
    }
  }

  .slick-prev,
  .slick-next {
    color: #00009c;
    font-size: 18px;
    z-index: 1;

    @media (max-width: 768px) {
      display: none !important;
    }
  }
  .slick-prev {
    left: -28px;
  }
  .slick-next {
    right: -28px;
  }

  .slick-dots {
    position: relative;
    bottom: auto;
    margin: 16px 0 0 0;
    padding: 0;
  }

  .slick-dots li button {
    background: #00009c;
    opacity: 0.35;
    border-radius: 4px;
  }

  .slick-dots li.slick-active button {
    opacity: 1;
    background: #00009c;
  }
`;
export const BestCoverImage = styled(Image)`
  height: 160px !important;
  object-fit: cover !important;
  padding: 8px !important;

  @media (max-width: 768px) {
    height: 220px !important;
    padding: 10px !important;
  }
`;

export const BestCardTitle = styled(StyledTitle)`
  &.ant-typography {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 140px;
    margin: 0;

    @media (max-width: 768px) {
      max-width: 100%;
      flex: 1;
      font-size: 1rem !important;
    }
  }
`;
export const BestCardHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;
export const BestCardBody = styled(Flex)`
  flex-direction: column;
  gap: 10px;
  padding-top: 4px;
  flex: 1;
  justify-content: space-between;
`;

export const BestCardSlide = styled.div`
  padding: 0 8px 10px;
  box-sizing: border-box;
  height: 100%;

  .ant-card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .ant-card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 14px;
  }

  @media (max-width: 768px) {
    padding: 0 8px 12px;
    max-width: min(340px, 100%);
    margin: 0 auto;
  }
`;

export const TrendingSection = styled.div`
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
  overflow: hidden;

  @media (max-width: 768px) {
    margin: 36px auto;
    padding: 0 12px;
  }
`;

export const TrendingSectionTitle = styled(Title)`
  &.ant-typography {
    text-align: center;
    color: #00009c;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: 15px;
    font-size: 1.4rem;

    @media (max-width: 576px) {
      font-size: 1.25rem;
    }
  }
`;

export const TrendingStack = styled.div`
  position: relative;
  height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 768px) {
    height: auto;
    flex-direction: column;
    gap: 0;
    width: 100%;
  }
`;
export const TrendingCard = styled(Card)<{
  $pos: "left" | "center" | "right";
  $isActiveMobile?: boolean;
}>`
  position: absolute;
  width: 330px;
  max-width: 100%;
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.35s ease,
    opacity 0.35s ease,
    filter 0.35s ease;

  ${({ $pos }) =>
    $pos === "center" &&
    `
    transform: translateX(0px) scale(1.05);
    z-index: 5;
    opacity: 1;
    filter: none;
    box-shadow: 0 16px 40px rgba(0, 0, 80, 0.18);
  `}

  ${({ $pos }) =>
    $pos === "left" &&
    `
    transform: translateX(-260px) scale(0.88) rotate(-4deg);
    z-index: 2;
    opacity: 0.88;
    filter: brightness(0.96);
    box-shadow: 0 8px 24px rgba(0, 0, 56, 0.12);
  `}

  ${({ $pos }) =>
    $pos === "right" &&
    `
    transform: translateX(260px) scale(0.88) rotate(4deg);
    z-index: 2;
    opacity: 0.88;
    filter: brightness(0.96);
    box-shadow: 0 8px 24px rgba(0, 0, 56, 0.12);
  `}

  &:hover {
    ${({ $pos }) =>
      $pos !== "center" &&
      `
      opacity: 1;
      filter: brightness(1.02);
      transform: translateX(${
        $pos === "left" ? "-260px" : "260px"
      }) scale(0.92) rotate(${$pos === "left" ? "-2deg" : "2deg"});
    `}
  }

  .ant-card-body {
    padding: 14px 16px;
  }
  img {
    height: 190px;
    object-fit: cover;
    width: 100%;
    display: block;
  }

  @media (max-width: 768px) {
    position: static;
    width: 100%;
    max-width: min(340px, 100%);
    margin: 0 auto;
    transform: none !important;
    rotate: none;
    opacity: 1 !important;
    filter: none !important;
    box-shadow: 0 8px 24px rgba(0, 0, 56, 0.1);
    display: ${({ $isActiveMobile }) => ($isActiveMobile ? "block" : "none")} !important;
  }
`;

export const TrendingDots = styled(Flex)`
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
`;

export const TrendingDot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? "28px" : "9px")};
  height: 9px;
  border-radius: 5px;
  background: ${({ $active }) => ($active ? "#00009c" : "#cbd5e1")};
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    background: ${({ $active }) => ($active ? "#00009c" : "#94a3b8")};
  }
`;
export const TrendingCardHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  .ant-typography {
    margin-bottom: 0 !important;
    font-size: 1.05rem !important;
  }
`;

export const TrendingMeta = styled(Meta)`
  margin: 2px 0 6px;

  .ant-card-meta-description {
    font-size: 0.78rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
  }
`;
export const TrendingCardBody = styled(Flex)`
  flex-direction: column;
  gap: 6px;
`;

export const ReviewsSection = styled.div`
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 40px 24px;
  overflow: hidden;

  @media (max-width: 768px) {
    margin: 32px auto;
    padding: 0 12px 20px;
  }
`;

export const ReviewSlide = styled.div`
  padding: 0 8px 10px;
  box-sizing: border-box;
  min-width: 0;
  height: 100%;

  .ant-card {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 768px) {
    padding: 0 8px 12px;
    max-width: 360px;
    margin: 0 auto;
  }
`;
export const ReviewsSectionTitle = styled(Title)`
  &.ant-typography {
    text-align: center;
    color: #00009c;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: 15px;
    font-size: 1.4rem;

    @media (max-width: 576px) {
      font-size: 1.25rem;
    }
  }
`;

export const ReviewCard = styled(Card)`
  border-radius: 14px;
  min-width: 0;
  word-break: break-word;
  height: 100%;
  box-shadow: 0 4px 16px rgba(0, 0, 56, 0.06);

  .ant-card-body {
    padding: 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    flex: 1;
  }
`;

export const ReviewText = styled(Paragraph)`
  &.ant-typography {
    font-size: 0.85rem;
    color: #444;
    margin: 0;
    font-style: italic;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-height: 1.5;
  }
`;

export const ReviewerName = styled(Text)`
  &.ant-typography {
    font-weight: 700;
    font-size: 0.9rem;
    color: #00009c;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    display: block;
  }
`;
export const ReviewEmail = styled(Text)`
  &.ant-typography {
    font-size: 0.75rem;
    color: #888;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    display: block;
  }
`;
export const SectionBadge = styled(Tag)`
  &.ant-tag {
    border-radius: 20px;
    padding: 4px 16px;
    font-size: 0.85rem;
    display: block;
    width: fit-content;
    max-width: calc(100% - 24px);
    white-space: normal;
    text-align: center;
    word-break: break-word;
    margin: 0 auto 12px;
    border: none;
    background: #00009c;
    color: #fff;
    line-height: 1.4;

    @media (max-width: 480px) {
      font-size: 0.78rem;
      padding: 4px 12px;
    }
  }
`;

export const StyledMeta = styled(Meta)`
  flex: 1;
  min-height: 48px;

  .ant-card-meta-description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
