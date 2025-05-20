import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Box, Button, Text, Flex, Heading, SimpleGrid, Input, Image, useBreakpointValue } from "@chakra-ui/react";
import { LuSearch, LuBedDouble } from "react-icons/lu";
import { FaSwimmingPool, FaWater } from "react-icons/fa";
import { GiWindow, GiTreehouse } from "react-icons/gi";
import { TbBeach } from "react-icons/tb";
import { MdOutlineEmojiFoodBeverage } from "react-icons/md";
import { PiFarm } from "react-icons/pi";
import { useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import "../styles/styles.css";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [properties, setProperties] = useState([]);
    const [destination, setDestination] = useState("");
    // const [selectedDate, setSelectedDate] = useState("");
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [sortOrder, setSortOrder] = useState("")
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const scrollRef = useRef(null);
    const isMobile = useBreakpointValue({ base: true, md: false });

    

    // const navigate = useNavigate();

    const { category } = useParams();
    console.log("Selected Category:", category);

    // return <div>{category} Properties</div>;

    const filterByCategory = (properties, category) => {
        if (!category) return properties;

        return properties.filter(property =>
            (property.title && property.title.toLowerCase().includes(category.toLowerCase())) ||
            (property.description && property.description.toLowerCase().includes(category.toLowerCase()))
        );
    };

    const filteredByCategory = filterByCategory(filteredProperties.length > 0 ? filteredProperties : properties, category);

    console.log("Selected Category:", category);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);


    const mergedProperties = filteredProperties.length > 0 ? filteredProperties : filteredByCategory;

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "properties"));
                const propertyList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProperties(propertyList);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }            
        };

        fetchProperties();
    }, []);


    const handleSortChange = (event) => {
        const order = event.target.value;
        setSortOrder(order);

        const sortedProperties = [...mergedProperties].sort((a, b) => {
            if (order === "low-to-high") return a.price - b.price;
            if (order === "high-to-low") return b.price - a.price;
            return 0;
        });
        setFilteredProperties(sortedProperties);
    };


    console.log(filteredProperties, "filtered properties")

    const handleSearch = () => {
        console.log("Running search with: ", { destination, checkInDate, checkOutDate, adults, children });

        const checkIn = checkInDate ? new Date(checkInDate) : null;
        const checkOut = checkOutDate ? new Date(checkOutDate) : null;

        let searchResults = properties.filter(property => {
            const location = property.location ? property.location.toLowerCase() : "";
            const matchesLocation = !destination || location.includes(destination.toLowerCase());

            const propertyCheckIn = property.checkIn ? new Date(property.checkIn) : null;
            const propertyCheckOut = property.checkOut ? new Date(property.checkOut) : null;

            const matchesDate =
                (!checkIn || !checkOut) ||
                (propertyCheckIn && propertyCheckOut &&
                    propertyCheckIn <= checkIn &&
                    propertyCheckOut >= checkOut);

            const totalGuests = (adults || 0) + (children || 0);
            const maxGuests = property.maxGuests || Number.MAX_SAFE_INTEGER;
            const matchesGuests = totalGuests === 0 || totalGuests <= maxGuests;

            return matchesLocation && matchesDate && matchesGuests;
        });

        // category filter
        searchResults = filterByCategory(searchResults, category);

        console.log("Filtered Properties: ", searchResults);

        setFilteredProperties(searchResults.length > 0 ? searchResults : properties);

        if (searchResults.length === 0) {
            alert("No property available.");
        }
        // till here

        console.log("Filtered Properties: ", searchResults);

        setFilteredProperties(searchResults.length > 0 ? searchResults : properties);

        if (searchResults.length === 0) {
            alert("No property available.");
        }
        if (!destination && !checkInDate && !checkOutDate && adults === 0 && children === 0) {
            setFilteredProperties(properties);
            return;
        }
        setIsOpen(false)
    };

    const formatDateRange = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return "Dates not available";

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        const options = { day: "numeric", month: "short" };
        return `${checkInDate.toLocaleDateString("en-GB", options)} – ${checkOutDate.toLocaleDateString("en-GB", options)}`;
    };

    console.log(properties, "property in dashboard")

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 150;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };


    return (
        <Box p={5} maxW={{base:"90%", md:"80%"}} mx="auto" >

            {/* SearchBar */}
            <Flex                
                display={{ base: "flex", md: "none" }}
                align="center"
                justify="center"
                p={3}
                bg="white"
                borderRadius="50px"
                cursor="pointer"
                onClick={() => setIsOpen(true)}
                mb={6}
            >
                <LuSearch />
                <Text color={"gray.500"} ml={2}>Start your search</Text>
            </Flex>

            <Flex 
                gap={15}
                display={{ base: "none", md: "flex" }}
                mb={6}
                p={3}
                height="80px"
                marginX={100}
                borderRadius="60px"
                border="1px solid"
                borderColor="gray.100"
                boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px;">



                <Box
                    marginTop={0.5}
                    flex="1" marginLeft={4}>

                    <Text fontSize={"sm"} p="0px 0px 0px 20px">Where</Text>
                    <Input
                        p="0px 0px 0px 20px"
                        border={"none"}
                        _focus={{ border: "none", boxShadow: "none", outline: "none" }}
                        placeholder="Search destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                </Box>

                <Box marginTop={0.5} flex="1">
                    <Text fontSize={"sm"} p="0px 0px 0px 12px">Check-In</Text>
                    <Input
                        color={"gray.400"}
                        border={"none"}
                        _focus={{ border: "none", boxShadow: "none", outline: "none" }}
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                    />
                </Box>
                <Box marginTop={0.5} flex="1">
                    <Text fontSize={"sm"} p="0px 0px 0px 12px">Check-Out</Text>
                    <Input
                        color={"gray.400"}
                        border={"none"}
                        _focus={{ border: "none", boxShadow: "none", outline: "none" }}
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                    />
                </Box>

                <Box marginTop={0.5} flex="1">
                    <Flex gap={2}>
                        <Box>
                            <Text fontSize="smaller" p="0px 0px 0px 12px">Adults</Text>
                            <Input
                                color={"gray.400"}
                                border={"none"}
                                _focus={{ border: "none", boxShadow: "none", outline: "none" }}
                                type="number"
                                value={adults}
                                min="1"
                                onChange={(e) => setAdults(Number(e.target.value))}
                            />
                        </Box>
                        <Box >
                            <Text fontSize="smaller" p="0px 0px 0px 12px">Children</Text>
                            <Input
                                color={"gray.400"}
                                border={"none"}
                                _focus={{ border: "none", boxShadow: "none", outline: "none" }}
                                type="number"
                                value={children}
                                min="0"
                                onChange={(e) => setChildren(Number(e.target.value))}
                            />
                        </Box>
                    </Flex>
                </Box>

                <Box alignSelf="center" >
                    <Button bg="#F44336 " borderRadius="50px" color={"white"} border={"none"} onClick={handleSearch}><LuSearch />Search</Button>
                </Box>
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
                    mb={6}
                    p={3}
                    onClick={() => setIsOpen(false)}
                >
                    <Box bg="white" p={6} borderRadius="10px" width="90%" maxWidth="400px" onClick={(e) => e.stopPropagation()}>
                        <Text fontSize="lg" fontWeight="bold">Search</Text>

                        <Text fontSize={"sm"} mt={3} ml={2} >Where</Text>
                        <Input placeholder="Search destination" value={destination} onChange={(e) => setDestination(e.target.value)} m={1} />

                        <Text fontSize={"sm"} mt={3} ml={2}>Check-In</Text>
                        <Input color={"gray"} type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} m={1} />

                        <Text fontSize={"sm"} mt={3} ml={2}>Check-Out</Text>
                        <Input color={"gray"} type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} m={1} />

                        <Text fontSize="smaller" mt={3} ml={2}>Adults</Text>
                        <Input color={"gray"} type="number" placeholder="Adults" value={adults} min="1" onChange={(e) => setAdults(Number(e.target.value))} m={1} />

                        <Text fontSize="smaller" mt={3} ml={2}>Children</Text>
                        <Input color={"gray"} type="number" placeholder="Children" value={children} min="0" onChange={(e) => setChildren(Number(e.target.value))} m={1} />

                        <Flex mt={4} justify="center">
                            <Button bg="#F44336" color="white" onClick={handleSearch}>Search</Button>
                        </Flex>
                    </Box>
                </Box>
            )}


            <Box as="hr" mb={5} border="1px solid gray.300" />


            {/* Second Nav */}

            {/* <Box>
                <Flex gap={10} color="gray.500" flexDirection="row" m="20px 0px 20px 40px"
                    height={"40px"} justifyContent={"center"}> */}


            <Flex flexDirection={{ base: "column", md: "row" }} alignItems={{ base: "center", md: "center" }} m="20px" justifyContent="space-between" gap={{ base: 2, md: 5 }} >
                <Box position="relative" maxW="100%" overflow="hidden" flex="1" pb={{ base: "8px", md: "0px" }}>
                    {/* Show scroll buttons ONLY on mobile */}
                    {isMobile && (
                        <Box                            
                            position="absolute"
                            left="0px"
                            top="50%"
                            transform="translateY(-50%)"
                            zIndex="10"
                            cursor="pointer"
                            onClick={() => scroll("left")}
                            border={"1px solid"}
                            borderRadius={"50%"}
                            p={1}
                            color="gray"
                        >
                            <IoIosArrowBack size="24px" color="gray" />
                        </Box>
                    )}

                    <Box overflow="hidden">
                        <Flex
                            ref={scrollRef}
                            overflowX="hidden"
                            whiteSpace="nowrap"
                            p={2}
                            pl={35}
                            pr={35}
                            gap={10}
                            color="gray.500"
                            flexDirection="row"
                            height="50px"
                            justifyContent={isMobile ? "flex-start" : "center"} 
                            sx={{
                                "::-webkit-scrollbar": { display: "none" },
                                scrollbarWidth: "none", 
                            }}
                        >
                            {[
                                { path: "/category/Rooms", icon: <LuBedDouble size="20px" />, label: "Rooms" },
                                { path: "/category/Lakefront", icon: <FaWater size="20px" />, label: "Lakefront" },
                                { path: "/category/Amazing View", icon: <GiWindow size="20px" />, label: "Amazing View" },
                                { path: "/category/Beachfront", icon: <TbBeach size="20px" />, label: "Beachfront" },
                                { path: "/category/Treehouses", icon: <GiTreehouse size="20px" />, label: "Treehouses" },
                                { path: "/category/Luxe", icon: <MdOutlineEmojiFoodBeverage size="20px" />, label: "Luxe" },
                                { path: "/category/Amazing Pools", icon: <FaSwimmingPool size="20px" />, label: "Amazing pools" },
                                { path: "/category/Farms", icon: <PiFarm size="20px" />, label: "Farms" },
                            ].map(({ path, icon, label }) => (
                                <Link to={path} key={path}>
                                    <Flex direction="column" align="center" justify="center" _hover={{ color: "black", borderBottom: "2px solid black" }}>
                                        {icon}
                                        <Text fontSize="xs">{label}</Text>
                                    </Flex>
                                </Link>
                            ))}
                        </Flex>
                    </Box>

                    {/* Show scroll buttons ONLY on mobile */}
                    {isMobile && (
                        <Box
                            position="absolute"
                            right="0px"
                            top="50%"
                            transform="translateY(-50%)"
                            zIndex="10"
                            cursor="pointer"
                            onClick={() => scroll("right")}
                            border={"1px solid"}
                            borderRadius={"50%"}
                            p={1}
                            color="gray"
                        >
                            <IoIosArrowForward size="24px" color="gray" />
                        </Box>

                    )}
                </Box>

                {/* Sort Dropdown Section - Aligned in the same row */}
                <Box ml="20px">
                    <select
                        style={{
                            border: "1px solid gray",
                            width: "200px",
                            borderRadius: "5px",
                            padding: "5px",
                            fontSize: "small",
                        }}
                        onChange={handleSortChange}
                        value={sortOrder}
                    >
                        <option value="">Sort by Price</option>
                        <option value="low-to-high"> Low to High</option>
                        <option value="high-to-low"> High to Low</option>
                    </select>
                </Box>
            </Flex>





            {mergedProperties.length > 0 ? (
                <SimpleGrid columns={[1, 2, 3, 4]} gap={5} >
                    {mergedProperties.map((property) => (
                        <Box key={property.id} p={4} borderWidth="1px" borderRadius="md">
                            <Image
                                src={property.imageUrl}
                                alt={property.title}
                                // boxSize="200px"
                                height="200px" width="300px"
                                borderRadius="md"
                            />
                            <Heading size="md">{property.title}</Heading>
                            <Text>{property.location}</Text>
                            <Text style={{ fontSize: "15px", color: "gray" }}>{formatDateRange(property.checkIn, property.checkOut)}</Text>
                            <Text style={{ fontSize: "15px" }}>Price: &#8377;{property.price} <span style={{ fontSize: "small" }}>night</span></Text>
                            <Link to={`/property/${property.id}`}>
                                <Button mt={2}>View Details</Button>
                            </Link>
                        </Box>
                    ))}
                </SimpleGrid>
            ) : (
                <Text>No properties found.</Text>
            )}

        </Box>

    );
};

export default Dashboard;