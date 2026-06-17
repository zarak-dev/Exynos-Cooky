import React from 'react';
import { Row, Col, Card, Rate } from 'antd'; 
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { COOKIE_MOCK_DATA, type Cookie } from '../utils/mockData';
import { useSearch } from '../context/searchContext';
import { addCookieToBox } from '../store/cartSlice';
import {
  HomeContainer,
  StyledCard,
  CardHeader,
  CookieTitle,
  PriceTag,
  StyledButton,
  OutOfStockBadge,
  ExploreSection,
  SearchWrapper,
  SearchBarInput,
  SearchBarButton,
  MenuTabs,
  NoResults
} from './home.styles';

const Home: React.FC = () => {
  const dispatch = useDispatch();
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

  const renderCookieGrid = (cookies: Cookie[], isTopRatedView: boolean) => {
    if (cookies.length === 0) {
      return <NoResults>No delicious cookies match your explore query! 🍪</NoResults>;
    }

    return (
      <Row gutter={[24, 24]}>
        {cookies.map((cookie: Cookie, {/*index: number*/}) => (
          <Col xs={24} sm={12} md={8} key={cookie.id}>
            <StyledCard $isAvailable={cookie.isAvailable} hoverable cover={<img alt={cookie.name} src={cookie.imageUrl} />}>
              <CardHeader>
                <CookieTitle>{cookie.name}</CookieTitle>
                {cookie.isAvailable ? <PriceTag>Rs. {cookie.price}</PriceTag> : <OutOfStockBadge>Sold Out</OutOfStockBadge>}
              </CardHeader>
              
              {/* CONDITIONAL STAR RATINGS FOR TOP RATED ENTRIES */}
            {isTopRatedView && (cookie.id === 2 || cookie.id === 3 || cookie.id === 4) && (
              <div style={{ marginBottom: '12px', marginTop: '-4px' }}>
                <Rate 
                  disabled 
                  allowHalf 
                  defaultValue={cookie.id === 2 ? 5 : cookie.id === 3 ? 5 : 4.5} 
                  style={{ color: '#00009c', fontSize: '#0.95rem' }} 
                />
                <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>
                  ({cookie.id === 2 ? '120+' : cookie.id === 3 ? '98' : '84'})
                </span>
              </div>
            )}

              <Card.Meta description={cookie.description} style={{ marginBottom: '16px', minHeight: '60px' }} />
              <StyledButton 
                type="primary" 
                disabled={!cookie.isAvailable}
                onClick={() => dispatch(addCookieToBox(cookie))}
              >
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
          { 
            key: '1', 
            label: '🌟 Top Rated', 
            children: renderCookieGrid(topRatedList, true) // Pass true to show stars
          },
          { 
            key: '2', 
            label: '🍪 All Menu', 
            children: renderCookieGrid(allMenuList, false) // Pass false to hide stars
          }
        ]}
      />
    </HomeContainer>
  );
};

export default Home;