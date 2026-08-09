import { Breadcrumb, Typography } from "antd";
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
  extra?: React.ReactNode;
  children?: React.ReactNode;
}

const StyledPageHeader = ({
  title,
  breadcrumbs = [],
  extra,
  children,
}: StyledPageHeaderProps) => {
  return (
    <>
      <div style={{ background: "white" }}>
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
    </>
  );
};

export default StyledPageHeader;
