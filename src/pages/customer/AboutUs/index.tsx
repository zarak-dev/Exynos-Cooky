import React from "react";
import storyIllustration from "../../../assets/images/man-with-cookie.jpg";

import {
  PageWrapper,
  AboutContainer,
  HeroSection,
  LeftColumn,
  RightColumn,
  StoryImage,
  EditorialHeader,
  StoryTitle,
  NarrativeBlock,
  Paragraph,
  HighlightText,
  CoreGrid,
  FeatureCard,
  FoundationsTitle,
} from "./styles";
import { Space } from "antd";

const AboutUs: React.FC = () => {
  return (
    <PageWrapper>
      <AboutContainer>
        {/* Hero Section */}
        <HeroSection>
          <LeftColumn>
            <EditorialHeader>
              <StoryTitle>Spreading Happiness One Cookie at A Time</StoryTitle>
            </EditorialHeader>

            <NarrativeBlock>
              <Paragraph>
                Welcome to <HighlightText>Exynos Cooky</HighlightText>, where
                our passion for baking meets the pursuit of the perfect sweet
                treat. What started as a simple idea in a home kitchen has
                blossomed into a destination for the most delicious,
                melt-in-your-mouth cookies you will ever experience.
              </Paragraph>
              <Paragraph>
                We believe that baking is an art form. Our mission is to create
                moments of pure joy through our carefully crafted, giant
                cookies. Every recipe is meticulously tested, using only the
                finest ingredients—from rich European butter to premium
                chocolate chunks—to ensure every single bite brings a smile to
                your face.
              </Paragraph>
              <Paragraph>
                From our classic chilled sugar to our rotating weekly menu of
                innovative flavors, our cookies are baked fresh daily to
                guarantee that warm, gooey center. We are dedicated to
                delivering not just a dessert, but an unforgettable sweet
                experience right to your door.
              </Paragraph>
            </NarrativeBlock>
          </LeftColumn>

          <RightColumn>
            <StoryImage src={storyIllustration} alt="Exynos Cooky Mascot" />
          </RightColumn>
        </HeroSection>

        {/* Foundations Section */}
        <Space>
          <FoundationsTitle>What Makes Us Special</FoundationsTitle>

          <CoreGrid>
            <FeatureCard title="Gourmet Ingredients" variant="borderless">
              We never compromise on quality. We source only the highest quality
              butter, premium chocolates, and fresh ingredients to craft the
              perfect cookie.
            </FeatureCard>

            <FeatureCard title="Weekly Rotating Menu" variant="borderless">
              Boredom is not in our vocabulary. Our flavor lineup changes every
              single week, bringing you exciting and innovative new cookie
              creations to try.
            </FeatureCard>

            <FeatureCard title="Baked Fresh Daily" variant="borderless">
              Timing is everything. Every cookie is mixed, balled, and baked
              in-house throughout the day to ensure ultimate freshness and that
              perfect warm pull.
            </FeatureCard>

            <FeatureCard title="Signature Packaging" variant="borderless">
              Whether it is a 4-pack or a party box, we perfectly pack our
              signature boxes so your cookies arrive looking as beautiful as
              they taste.
            </FeatureCard>
          </CoreGrid>
        </Space>
      </AboutContainer>
    </PageWrapper>
  );
};

export default AboutUs;
