// import React, { useRef } from "react";
// import { Box, Flex, IconButton, Text, useBreakpointValue } from "@chakra-ui/react";
// import { Link } from "react-router-dom";
// import { LuBedDouble, LuArrowLeft, LuArrowRight } from "react-icons/lu";
// import { FaWater, FaSwimmingPool } from "react-icons/fa";
// import { GiWindow, GiTreehouse } from "react-icons/gi";
// import { TbBeach } from "react-icons/tb";
// import { MdOutlineEmojiFoodBeverage } from "react-icons/md";
// import { PiFarm } from "react-icons/pi";

// const categories = [
//     { to: "/category/rooms", icon: <LuBedDouble size="20px" />, label: "Rooms" },
//     { to: "/category/lakefront", icon: <FaWater size="20px" />, label: "Lakefront" },
//     { to: "/category/amazingview", icon: <GiWindow size="20px" />, label: "Amazing View" },
//     { to: "/category/beachfront", icon: <TbBeach size="20px" />, label: "Beachfront" },
//     { to: "/category/treehouses", icon: <GiTreehouse size="20px" />, label: "Treehouses" },
//     { to: "/category/luxe", icon: <MdOutlineEmojiFoodBeverage size="20px" />, label: "Luxe" },
//     { to: "/category/poolSideProperty", icon: <FaSwimmingPool size="20px" />, label: "Amazing Pools" },
//     { to: "/category/farms", icon: <PiFarm size="20px" />, label: "Farms" },
// ];

// const CategoryScroll = () => {
//     const scrollRef = useRef(null);
//     const isMobile = useBreakpointValue({ base: true, md: false });

//     const scroll = (direction) => {
//         if (scrollRef.current) {
//             const scrollAmount = 250; // Scroll amount
//             scrollRef.current.scrollBy({
//                 left: direction === "left" ? -scrollAmount : scrollAmount,
//                 behavior: "smooth",
//             });
//         }
//     };

//     return (
//         //  <Flex gap={10} color="gray.500" flexDirection="row" m="20px 0px 20px 40px"
//         //                     height={"40px"} justifyContent={"center"}>


        

//         //                     </Flex>
//         <Box position="relative" mx="40px" my="20px" maxW={"80%"}>
//             {/* Show scroll buttons ONLY on mobile */}
//             {isMobile && (
//                 <IconButton
//                     icon={<LuArrowLeft size="24px" />}
//                     position="absolute"
//                     left="-30px"
//                     top="50%"
//                     transform="translateY(-50%)"
//                     bg="white"
//                     boxShadow="md"
//                     _hover={{ bg: "gray.200" }}
//                     onClick={() => scroll("left")}
//                     aria-label="Scroll left"
//                     zIndex="2"
//                 />
//             )}

//             <Box overflow="hidden">
//                 <Flex
//                     ref={scrollRef}
//                     overflowX={isMobile ? "auto" : "visible"} // Enable scroll ONLY for mobile
//                     whiteSpace="nowrap"
//                     gap={6}
//                     p={2}
//                     justifyContent={isMobile ? "flex-start" : "center"} // Center for large screens
//                     sx={{
//                         "::-webkit-scrollbar": { display: "none" }, // Hide scrollbar
//                         scrollbarWidth: "none",
//                     }}
//                 >
//                     {categories.map(({ to, icon, label }) => (
//                         <Link key={to} to={to}>
//                             <Flex
//                                 direction="column"
//                                 align="center"
//                                 justify="center"
//                                 _hover={{ color: "black", borderBottom: "2px solid black" }}
//                                 color="gray.500"
//                             >
//                                 {icon}
//                                 <Text fontSize="xs">{label}</Text>
//                             </Flex>
//                         </Link>
//                     ))}
//                 </Flex>
//             </Box>

//             {/* Show scroll buttons ONLY on mobile */}
//             {isMobile && (
//                 <IconButton
//                     icon={<LuArrowRight size="24px" />}
//                     position="absolute"
//                     right="-30px"
//                     top="50%"
//                     transform="translateY(-50%)"
//                     bg="white"
//                     boxShadow="md"
//                     _hover={{ bg: "gray.200" }}
//                     onClick={() => scroll("right")}
//                     aria-label="Scroll right"
//                     zIndex="2"
//                 />
//             )}
//         </Box>
//     );
// };

// export default CategoryScroll;
