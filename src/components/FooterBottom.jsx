import { HStack, Text, Box } from '@chakra-ui/react';
import React from 'react';
import "../styles/styles.css"


const FooterBottom = () => {
    return (
        <Box as="footer" mt="auto" width="100%">
            <hr />
            <HStack flexDirection={{ base: "column", md: "row" }} justifyContent="space-between" p={4} fontSize="small" pr={{base: 0,md:12}} pl={{base:0,md:12}}>
                <HStack flexWrap="wrap"
                    spacing={4}
                    sx={{
                        "@media (max-width: 768px)": {
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)"
                        }
                    }} >
                <Text>© 2025 NomadNest, Inc.</Text>
                <Text>· Privacy</Text>
                <Text>· Terms</Text>
                <Text>· Sitemap</Text>
                <Text>· Company details</Text>
                </HStack>
                <HStack gap={5}>
                    <Text>English (IN)</Text>
                    <Text>₹ INR</Text>
                    <Text>Support & resources</Text>
                </HStack>
            </HStack>
        </Box>
    );
};

export default FooterBottom;
