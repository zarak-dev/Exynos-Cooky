import { Breadcrumb, Flex, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;

export interface BreadcrumbItem {
  title: string;
  href?: string;
  to?: string; // For React Router
}

export interface StyledPageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  extra?: any;
  children?: any;
}

const StyledPageHeader = ({
  title,
  breadcrumbs = [],
  extra,
  children,
}: StyledPageHeaderProps) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      wrap="wrap"
      style={{ marginBottom: 24, gap: 16 }}
    >
      <div>
        <Breadcrumb
          style={{ marginBottom: 8 }}
          items={breadcrumbs.map((item) => ({
            title: item.to ? (
              <Link to={item.to}>{item.title}</Link>
            ) : item.href ? (
              <a href={item.href}>{item.title}</a>
            ) : (
              item.title
            ),
          }))}
        />
        <Title level={2} style={{ margin: 0 }}>
          {title}
        </Title>
        {children}
      </div>
      {extra && <div>{extra}</div>}
    </Flex>
  );
};

export default StyledPageHeader;
