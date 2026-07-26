import React, { useState } from "react";
import {
  Tag,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Upload,
  Button,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { OPEN_POSITIONS } from "./constants";
import type { JobOpening } from "./types";
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
  JobMeta,
  JobLabelWrapper,
  JobTitleText,
  JobContentWrapper,
  JobDescriptionText,
} from "./styles";

const Careers: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [form] = Form.useForm();

  const handleOpenModal = (job: JobOpening) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    form.resetFields();
  };

  const onFinishApplication = (values: any) => {
    console.log(
      "Application submitted for:",
      selectedJob?.title,
      "with data:",
      values,
    );

    message.success(
      `Success! Your application for ${selectedJob?.title} has been received.`,
    );

    setIsModalOpen(false);
    setSelectedJob(null);
    form.resetFields();
  };

  // safely bind the Antd Upload component to the Form state
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <CareersContainer>
      <HeroSection>
        <HeroTitle>Join the Cookie Crew</HeroTitle>
        <HeroSubtitle>
          Help us bake happiness and bring premium sweet replicas to food
          lovers. Discover your next opportunity below.
        </HeroSubtitle>
      </HeroSection>

      <SectionTitle>Our Core Ingredients</SectionTitle>
      <ValueGrid>
        <ValueCard title="Quality Obsessed" variant="borderless">
          Every single cookie requires meticulous precision. We don't compromise
          on the perfect frost swirl or bake consistency.
        </ValueCard>
        <ValueCard title="Energetic Culture" variant="borderless">
          Our kitchens run fast and our energy is contagious. We collaborate
          tightly and back each other up on every shift.
        </ValueCard>
        <ValueCard title="Sweet Growth" variant="borderless">
          We promote heavily from within. Starting as a baker opens clear
          developmental channels to management roles.
        </ValueCard>
      </ValueGrid>

      <SectionTitle>Open Positions</SectionTitle>
      <JobCollapse
        accordion
        expandIconPlacement="end"
        items={OPEN_POSITIONS.map((job) => ({
          key: job.id,
          label: (
            <JobLabelWrapper>
              <JobTitleText>{job.title}</JobTitleText>
              <JobMeta>
                <Tag color="blue">{job.department}</Tag>
                <Tag color="default">{job.location}</Tag>
                <Tag color="purple">{job.type}</Tag>
              </JobMeta>
            </JobLabelWrapper>
          ),
          children: (
            <JobContentWrapper>
              <JobDescriptionText>{job.description}</JobDescriptionText>
              <ApplyButton type="primary" onClick={() => handleOpenModal(job)}>
                Apply For Position
              </ApplyButton>
            </JobContentWrapper>
          ),
        }))}
      />

      <Modal
        title={`Apply for: ${selectedJob?.title}`}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinishApplication}
          requiredMark="optional"
          style={{ marginTop: "20px" }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input placeholder="John Doe" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input placeholder="john@example.com" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input placeholder="+92 XXX XXXXXXX" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="portfolio" label="LinkedIn / Portfolio URL">
                <Input placeholder="https://linkedin.com/in/..." />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="resume"
            label="Resume / CV"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Please upload your CV" }]}
          >
            <Upload
              name="cv"
              beforeUpload={() => false} // Prevents auto-uploading to a server immediately
              maxCount={1}
              accept=".pdf,.doc,.docx"
            >
              <Button icon={<UploadOutlined />}>
                Click to Upload (Max 1 File)
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="coverLetter"
            label="Brief Pitch"
            rules={[
              { required: true, message: "Please provide a brief pitch" },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Why are you a great fit for this role?"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <ApplyButton type="primary" htmlType="submit" block>
              Submit Application
            </ApplyButton>
          </Form.Item>
        </Form>
      </Modal>
    </CareersContainer>
  );
};

export default Careers;
