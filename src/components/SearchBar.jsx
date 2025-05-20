import React, { useState } from "react";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

const SearchBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [destination, setDestination] = useState("");
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    const handleSearch = () => {
        console.log("Searching with:", { destination, checkInDate, checkOutDate, adults, children });
        setIsOpen(false); // Close modal after search
    };

    return (
        <Box>
            {/* Default search bar (Mobile view) */}
            <Flex
                display={{ base: "flex", md: "none" }}
                align="center"
                justify="center"
                p={3}
                bg="gray.100"
                borderRadius="50px"
                cursor="pointer"
                onClick={() => setIsOpen(true)}
            >
                <LuSearch />
                <Text ml={2}>Start your search</Text>
            </Flex>

            {/* Full Search Bar (Desktop View) */}
            <Flex
                display={{ base: "none", md: "flex" }}
                gap={4}
                p={3}
                height="80px"
                borderRadius="60px"
                border="1px solid"
                borderColor="gray.100"
                boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px;"
            >
                <Input placeholder="Search destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
                <Input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
                <Input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
                <Input type="number" placeholder="Adults" value={adults} min="1" onChange={(e) => setAdults(Number(e.target.value))} />
                <Input type="number" placeholder="Children" value={children} min="0" onChange={(e) => setChildren(Number(e.target.value))} />
                <Button bg="#F44336" borderRadius="50px" color="white" onClick={handleSearch}>
                    <LuSearch /> Search
                </Button>
            </Flex>

            {/* Custom Modal */}
            {isOpen && (
                <Box
                    position="fixed"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    bg="rgba(0, 0, 0, 0.4)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex="1000"
                >
                    <Box bg="white" p={6} borderRadius="10px" width="90%" maxWidth="400px">
                        <Text fontSize="lg" fontWeight="bold">Search</Text>

                        <Input placeholder="Search destination" value={destination} onChange={(e) => setDestination(e.target.value)} mt={3}  />

                        <Input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} mt={3} />

                        <Input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} mt={3} />

                        <Input type="number" placeholder="Adults" value={adults} min="1" onChange={(e) => setAdults(Number(e.target.value))} mt={3} />

                        <Input type="number" placeholder="Children" value={children} min="0" onChange={(e) => setChildren(Number(e.target.value))} mt={3} />

                        <Flex mt={4} justify="space-between">
                            <Button onClick={() => setIsOpen(false)}>Close</Button>
                            <Button bg="#F44336" color="white" onClick={handleSearch}>Search</Button>
                        </Flex>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default SearchBar;
