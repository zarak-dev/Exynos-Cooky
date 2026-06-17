import React from 'react';
import {
  AboutContainer,
  EditorialHeader,
  StoryTitle,
  StoryDivider,
  NarrativeBlock,
  Paragraph,
  HighlightText,
  CoreGrid,
  FeatureCard
} from './aboutUs.styles';

const AboutUs: React.FC = () => {
  return (
    <AboutContainer>
      <EditorialHeader>
        <StoryTitle>Our Story</StoryTitle>
        <StoryDivider />
      </EditorialHeader>

      <NarrativeBlock>
        <Paragraph>
          Welcome to <HighlightText>Exynos Cooky</HighlightText>, where high-performance engineering meets creative frontend craftsmanship. What started as a vision to build a clean, flawless web interface has evolved into an architectural passion project designed to deliver crisp, digital excellence.
        </Paragraph>
        <Paragraph>
          We believe that software engineering is an art form. Our mission centers around creating structured, intelligent frontend designs that seamlessly manage state, performance, and aesthetic elegance. Every component, line of code, and layout line is deliberately implemented with extreme mathematical precision.
        </Paragraph>
        <Paragraph>
          From routing structures to scalable styling layers, our applications are built from the ground up to reflect modern system architectural principles. We are dedicated to providing user-centric interfaces that remain lightning-fast and highly secure.
        </Paragraph>
      </NarrativeBlock>

     
      <StoryTitle style={{ fontSize: '1.6rem', textAlign: 'center' }}>
        Our Foundations
      </StoryTitle>
      <CoreGrid>
        <FeatureCard title="Precision Architecture" bordered={false}>
          We design modular systems focused on absolute performance, utilizing strictly typed boundaries to prevent structural failures.
        </FeatureCard>

        <FeatureCard title="Intelligent Web Systems" bordered={false}>
          Our engineering approach looks toward the future, integrating data fluidly to enable dynamic, smart application experiences.
        </FeatureCard>

        <FeatureCard title="Sleek Aesthetics" bordered={false}>
          Inspired by structural minimalism, we leverage high-contrast palettes and perfect geometric constraints to prioritize user readability.
        </FeatureCard>

        <FeatureCard title="Uncompromising Quality" bordered={false}>
          From clean Git branch histories to responsive layout scaling, our pipeline ensures code that scales effortlessly over time.
        </FeatureCard>
      </CoreGrid>
    </AboutContainer>
  );
};

export default AboutUs;