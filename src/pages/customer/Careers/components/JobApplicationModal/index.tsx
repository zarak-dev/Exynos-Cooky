import React from "react";
import { Modal, Form, Input, Upload, Button, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { FormValues } from "../../../Checkout/types";

interface JobApplicationModalProps {
  open: boolean;
  jobTitle?: string;
  onCancel: () => void;
  onSubmit: (values: FormValues) => void;
}

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }

  return e?.fileList;
};

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  open,
  jobTitle,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.submit();
  };

  return (
    <Modal
      title={`Apply for: ${jobTitle ?? ""}`}
      open={open}
      width={600}
      closable={false}
      destroyOnHidden
      footer={[
        <Button
          key="cancel"
          type="primary"
          ghost
          shape="round"
          onClick={onCancel}
        >
          Cancel
        </Button>,

        <Button
          key="submit"
          type="primary"
          shape="round"
          onClick={handleSubmit}
        >
          Submit Application
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        onFinish={onSubmit}
        style={{ marginTop: "20px" }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[
                {
                  required: true,
                  message: "Please enter your name",
                },
              ]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email",
                },
                {
                  type: "email",
                  message: "Invalid email",
                },
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
                {
                  required: true,
                  message: "Please enter your phone number",
                },
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
          rules={[
            {
              required: true,
              message: "Please upload your CV",
            },
          ]}
        >
          <Upload
            name="cv"
            beforeUpload={() => false}
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
            {
              required: true,
              message: "Please provide a brief pitch",
            },
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Why are you a great fit for this role?"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default JobApplicationModal;
