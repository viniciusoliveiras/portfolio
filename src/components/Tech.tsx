import { Box, Image } from '@chakra-ui/react';

interface TechsProps {
  imageSRC: string;
  techName: string;
}

export function Tech({ imageSRC, techName }: TechsProps) {
  return (
    <>
      <a data-tip={techName}>
        <Box
          border='2px solid #FF6464'
          borderRadius='12'
          boxSize={{ xs: 24, lg: 32, xl: 40 }}
          p='6'
          bgColor='white'
        >
          <Image src={imageSRC} />
        </Box>
      </a>
    </>
  );
}
