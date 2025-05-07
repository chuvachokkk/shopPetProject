import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import SmallCard from '../SmallCard/SmallCard';
import { Product } from './OneCardProduct';

const CarouselItem = ({ same }: { same: Product[] }) => {
  const getItemCount = () => {
    if (same.length === 1) return 1;
    if (same.length === 2) return 2;
    return 3; // Если карточек 3 или больше
  };

  const itemCount = getItemCount();

  return (
    <Carousel
      responsive={{
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: itemCount,
        },
      }}
      additionalTransfrom={0}
      centerMode={same.length < 3}
      containerClass='carousel-container'
      itemClass='carousel-item'
      infinite={same.length > 3}
    >
      {same.map((el) => (
        <SmallCard key={el.id} el={el} />
      ))}
    </Carousel>
  );
};

export default CarouselItem;
