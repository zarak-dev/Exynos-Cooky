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
                Welcome to <HighlightText>Exynos Cooky</HighlightText>, Lorem
                ipsum dolor sit amet consectetur, adipisicing elit. Aliquam
                atque sequi, excepturi rerum sapiente illum maiores culpa ipsa
                tempora nemo nostrum iusto tempore? Iure dignissimos doloremque
                nulla ipsam distinctio! Ipsam. Lorem, ipsum dolor sit amet
                consectetur adipisicing elit. Ab tempore dolore doloremque
                totam, non repellendus animi veniam cupiditate atque quibusdam
                cum eveniet nostrum! Voluptatum, at tenetur omnis aliquam eaque
                praesentium. Lorem ipsum dolor sit amet, consectetur adipisicing
                elit. Voluptatibus itaque, obcaecati magni eaque laudantium
                quaerat accusamus impedit aperiam doloremque magnam, ea
                voluptatum similique assumenda, sed iure qui eligendi quod
                dicta.
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
