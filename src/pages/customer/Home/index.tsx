import React from 'react';
import { Row, Col, Rate } from 'antd'; 
import { useDispatch, useSelector } from 'react-redux';
import { type Cookie } from '../../../utils/mockData';
import { useSearch } from '../../../context/searchContext';
import { type RootState } from '../../../store';
import { addCookieToBox } from '../../../store/slices/cartSlice';
import {
  HomeContainer,
  StyledCard,
  CoverImage,
  CardHeader,
  CookieTitle,
  PriceTag,
  StyledButton,
  OutOfStockBadge,
  ExploreSection,
  ExploreTitle,
  SearchWrapper,
  SearchBarInput,
  SearchBarButton,
  StyledSearchIcon,
  MenuTabs,
  NoResults,
  RatingWrapper,
  ReviewCountText,
  StyledCardMeta
} from './styles';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { searchQuery, setSearchQuery } = useSearch();
  const cookies = useSelector((state: RootState) => state.inventory.items);
  
  const getFilteredCookies = (showOnlyTopRated: boolean) => {
    const filtered = cookies.filter((cookie: Cookie) => {
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
        {cookies.map((cookie: Cookie) => (
          <Col xs={24} sm={12} md={8} key={cookie.id}>
            <StyledCard 
              $isAvailable={cookie.isAvailable} 
              hoverable 
              cover={<CoverImage alt={cookie.name} src={cookie.imageUrl} preview={false} />}
            >
              <CardHeader>
                <CookieTitle level={3}>{cookie.name}</CookieTitle>
                {cookie.isAvailable ? (
                  <PriceTag>Rs. {cookie.price}</PriceTag>
                ) : (
                  <OutOfStockBadge>Sold Out</OutOfStockBadge>
                )}
              </CardHeader>
              
              {/* CONDITIONAL STAR RATINGS FOR TOP RATED ENTRIES */}
              {isTopRatedView && (cookie.id === 2 || cookie.id === 3 || cookie.id === 4) && (
                <RatingWrapper align="center">
                  <Rate 
                    disabled 
                    allowHalf 
                    defaultValue={cookie.id === 2 ? 5 : cookie.id === 3 ? 5 : 4.5} 
                  />
                  <ReviewCountText>
                    ({cookie.id === 2 ? '120+' : cookie.id === 3 ? '98' : '84'})
                  </ReviewCountText>
                </RatingWrapper>
              )}

              <StyledCardMeta description={cookie.description} />
              
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
        <ExploreTitle level={1}>
          Explore Our Menu
        </ExploreTitle>
        <SearchWrapper>
          <SearchBarInput
            placeholder="Search flavor profiles (e.g., Chocolate, Velvet, Sugar...)"
            allowClear
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchBarButton type="primary">
            <StyledSearchIcon />
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
            children: renderCookieGrid(topRatedList, true) 
          },
          { 
            key: '2', 
            label: '🍪 All Menu', 
            children: renderCookieGrid(allMenuList, false) 
          }
        ]}
      />
    </HomeContainer>
  );
};

export default Home;