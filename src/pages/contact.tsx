import React from 'react';
import { Tag } from 'antd';
import {
  CareersContainer,
  HeroSection,
  HeroTitle,
  HeroSubtitle,
  SectionTitle,
  ValueGrid,
  ValueCard,
  JobCollapse,
  ApplyButton,
  JobMeta
} from './careers.styles';

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const OPEN_POSITIONS: JobOpening[] = [
  {
    id: '1',
    title: 'Head Baker / Pastry Chef',
    department: 'Kitchen Operations',
    location: 'Islamabad, PK',
    type: 'Full-time',
    description: 'We are seeking an experienced Head Baker to oversee our daily cookie production, ensure premium quality replication standards, manage kitchen staff, and refine baking schedules.'
  },
  {
    id: '2',
    title: 'Shift Lead',
    department: 'Store Operations',
    location: 'Islamabad, PK',
    type: 'Full-time',
    description: 'Lead frontline execution, maintain a clean storefront, handle inventory control, and deliver exceptional service experiences matching the Exynos Cooky standard.'
  },
  {
    id: '3',
    title: 'Brand Ambassador / Counter Staff',
    department: 'Customer Experience',
    location: 'Islamabad, PK',
    type: 'Part-time',
    description: 'Be the face of Exynos Cooky! Greet customers, package boxes perfectly, box fresh creations, and manage our point-of-sale terminal layout.'
  }
];

const Contact: React.FC = () => {
  return (
    <CareersContainer>
      <HeroSection>
        <HeroTitle>Join the Cookie Crew</HeroTitle>
        <HeroSubtitle>
          Help us bake happiness and bring premium sweet replicas to food lovers. Discover your next opportunity below.
        </HeroSubtitle>
      </HeroSection>

      <SectionTitle>Our Core Ingredients</SectionTitle>
      <ValueGrid>
        <ValueCard title="Quality Obsessed" bordered={false}>
          Every single cookie requires meticulous precision. We don't compromise on the perfect frost swirl or bake consistency.
        </ValueCard>
        <ValueCard title="Energetic Culture" bordered={false}>
          Our kitchens run fast and our energy is contagious. We collaborate tightly and back each other up on every shift.
        </ValueCard>
        <ValueCard title="Sweet Growth" bordered={false}>
          We promote heavily from within. Starting as a baker opens clear developmental channels to management roles.
        </ValueCard>
      </ValueGrid>

      <SectionTitle>Open Positions</SectionTitle>
      <JobCollapse 
        accordion 
        expandIconPosition="end"
        items={OPEN_POSITIONS.map(job => ({
          key: job.id,
          label: (
            <div>
              <div style={{ color: '#00009c' }}>{job.title}</div>
              <JobMeta>
                <Tag color="blue">{job.department}</Tag>
                <Tag color="default">{job.location}</Tag>
                <Tag color="purple">{job.type}</Tag>
              </JobMeta>
            </div>
          ),
          children: (
            <div>
              <p style={{ color: '#555', lineHeight: '1.6', margin: 0 }}>
                {job.description}
              </p>
              <ApplyButton type="primary">
                Apply For Position
              </ApplyButton>
            </div>
          )
        }))}
      />
    </CareersContainer>
  );
};

export default Contact;