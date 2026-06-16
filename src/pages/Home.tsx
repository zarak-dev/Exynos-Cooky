// src/pages/Home.tsx
import React from 'react';
import { Row, Col, Card, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons'; // Import search icon
import { COOKIE_MOCK_DATA, type Cookie } from '../utils/mockData';
import { useSearch } from '../context/searchContext'; // Import shared state hook
import {
  HomeContainer,
  StyledCard,
  CardHeader,
  CookieTitle,
  PriceTag,
  StyledButton,
  OutOfStockBadge,
  ExploreSection,
  SearchWrapper,      // Add this
  SearchBarInput,     // Add this
  SearchBarButton,    // Add this
  MenuTabs,
  NoResults
} from './home.styles';

const Home: React.FC = () => {
  // Use global context instead of local state
  const { searchQuery, setSearchQuery } = useSearch();

  const getFilteredCookies = (showOnlyTopRated: boolean) => {
    const filtered = COOKIE_MOCK_DATA.filter((cookie: Cookie) => {
      const matchesSearch = 
        cookie.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cookie.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    if (showOnlyTopRated) {
      return filtered.slice(0, 3);
    }
    return filtered;
  };

  const topRatedList = getFilteredCookies(true);
  const allMenuList = getFilteredCookies(false);

  const renderCookieGrid = (cookies: Cookie[]) => {
    if (cookies.length === 0) {
      return <NoResults>No delicious cookies match your explore query! 🍪</NoResults>;
    }

    return (
      <Row gutter={[24, 24]}>
        {cookies.map((cookie: Cookie) => (
          <Col xs={24} sm={12} md={8} key={cookie.id}>
            <StyledCard $isAvailable={cookie.isAvailable} hoverable cover={<img alt={cookie.name} src={cookie.imageUrl} />}>
              <CardHeader>
                <CookieTitle>{cookie.name}</CookieTitle>
                {cookie.isAvailable ? <PriceTag>Rs. {cookie.price}</PriceTag> : <OutOfStockBadge>Sold Out</OutOfStockBadge>}
              </CardHeader>
              <Card.Meta description={cookie.description} style={{ marginBottom: '16px', minHeight: '60px' }} />
              <StyledButton type="primary" disabled={!cookie.isAvailable}>
                {cookie.isAvailable ? 'Add to Box' : 'Unavailable'}
              </StyledButton>
            </StyledCard>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <HomeContainer>

       <ExploreSection>
        <h1 style={{ color: '#00009c', fontWeight: 800, fontSize: '2rem', textTransform: 'uppercase', marginBottom: '16px' }}>
          Explore Our Menu
        </h1>
        
        {/* Bulletproof Custom Input Group */}
        <SearchWrapper>
          <SearchBarInput
            placeholder="Search flavor profiles (e.g., Chocolate, Velvet, Sugar...)"
            allowClear
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchBarButton type="primary">
            <SearchOutlined style={{ fontSize: '1.3rem', color: '#ffffff' }} />
          </SearchBarButton>
        </SearchWrapper>
      </ExploreSection>
          

      <MenuTabs
        defaultActiveKey="1"
        centered
        items={[
          { key: '1', label: '🌟 Top Rated', children: renderCookieGrid(topRatedList) },
          { key: '2', label: '🍪 All Menu', children: renderCookieGrid(allMenuList) }
        ]}
      />
    </HomeContainer>
  );
};

export default Home;