import Slider from 'react-slick';
import { Container, Typography, Box } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const images = [
  {
    src: '/Image_1.jpg',
  },
  {
    src: '/Image_2.jpg',
  },
  {
    label: '',
    src: '/Image_3.JPG',
  },
  {
    src: '/Image_4.JPG',
  },
  {
    src: '/Image_5.JPG',
  },
  {
    src: '/Image_6.JPG',
  },
  {
    src: '/Image_7.JPG',
  },
  {
    src: '/Image_8.JPG',
  },
];

export default function HomePage() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,    
  }
  const fontFamily = {fontFamily:'Georgia'}

  return (
    <Container maxWidth="lg" sx={{ mt:20, py: 15,  borderRadius: 5, backgroundColor:'#ffffff'}}>
      <Typography variant="h3" gutterBottom sx={{ mt:-11, fontFamily, textAlign: 'center', color: '#ff6f00' }}>
        "Together, We Can Move Mountains."
      </Typography>

      {/* Carousel */}
      <Box sx={{mt:2, mb: 4 }}>
        <Slider {...settings}>
          {images.map((img, index) => (
            <Box key={index} sx={{ position: 'relative' }}>
              <Box
                component="img"
                src={img.src}
                alt={img.label}
                sx={{
                  width: '100%',
                  height: 500,
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  p: 2,
                  textAlign: 'center',
                }}
              >
                <Typography variant="subtitle1">{img.label}</Typography>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Paragraphs */}
      <Typography variant='h5' sx={fontFamily}>Our Vision</Typography>
      <Typography sx={{mt: 2, textAlign: "center", fontWeight: 700, fontSize:18, fontFamily}}>
        "Towards the Peaceful and Educated Life of Children and Youth in Myanmar."
      </Typography>
      <Typography variant='h5' sx={fontFamily}>Our Mission</Typography>
      <Typography sx={{mt:2, fontFamily}}>
      <ul>
        <li>Strengthened realization of right to education for children and youth in Myanmar, especially for girls, women and persons with disabilities.</li>
        <li>Strengthened realization of rights to safe living environments for children and youth, especially for girls and children with disabilities.</li>
        <li>Strengthened the capacity of leaders regarding the right to education and safe living environment (especially focusing on girls and persons with disabilities)</li>
        <li>Increased capacity and sustainability of the Assemblies of God of Myanmar (AoGMM) to innovatively act and promote rights of children and youth in Myanmar.</li>
      </ul>
      </Typography>
      <Typography variant='h5' sx={fontFamily}>Our Values</Typography>
      <Typography sx={{mt:2, fontFamily}}>
      <ul>
        <li>Right to Education: We value the community can access to education of the poor and children & youth improved.</li>
        <li>Right to Health: We value the well-being of the children, youth and families.</li>
        <li>Gender Equity: We ensure gender equity of everyone, sexual orientation, disability, race, ethnicity, class, age. location and religion.</li>
        <li>Friendly Environment: Safeguarding and saving environment for communities.</li>
      </ul>
      </Typography>
    </Container>
  );
}