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
          border="2px solid #FFD369"
          borderRadius="12"
          boxSize={{ base: 24, lg: 24, xl: 32 }}
          p="6"
          bgColor="gray.700"
        >
          <Image src={imageSRC} />
        </Box>
      </a>
    </>
  );
}
