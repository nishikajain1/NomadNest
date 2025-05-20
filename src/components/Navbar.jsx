import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Flex, Text, Image, VStack } from "@chakra-ui/react";
import { handleGoogleSignIn, handleSignOut } from "../firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import NomadNestLogo from "../assets/Logo/NomadLogo.png";
import "../styles/styles.css";
import { FaRegUser } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = () => {
    const [user, setUser] = useState("");
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
    //         if (currentUser) {
    //             await currentUser.reload(); 
    //             setUser(auth.currentUser);
    //         } else {
    //             setUser(null);
    //         }
    //     });
    //     return () => unsubscribe();
    // }, []);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <Box p={2} position="relative">
            <Flex justify="space-between" align="center">
                <Link to="/" onClick={() => setFilteredProperties(properties)}><Image width="120px" marginLeft="20px" p={2} src={NomadNestLogo} alt="NomadNestLogo" /></Link>

                {/* Hamburger Icon */}
                <Box
                    display={{ base: "flex", md: "none" }}
                    onClick={() => setMenuOpen(!menuOpen)}
                    bg="transparent"
                    fontSize="24px"
                    cursor="pointer"
                    p={2}
                    _hover={{ bg: "gray.100", borderRadius: "md" }}
                >
                    <RxHamburgerMenu />
                </Box>

                {/* Desktop Menu */}
                <Flex gap={5} align="center" display={{ base: "none", md: "flex" }}>
                    {!user ? (
                        <>
                            <Button onClick={() => navigate("/login")}>Login</Button>
                            <Button onClick={() => handleGoogleSignIn(navigate)}>Sign in with Google</Button>
                        </>
                    ) : (
                        <>
                            <Link to="/host">
                                <Button bg="transparent" color="black">Add Property</Button>
                            </Link>

                            <Flex fontSize="sm" borderRadius={8} p="9px" border="1px solid" borderColor="gray.200"
                                _hover={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }} fontWeight="medium"
                                align="center" gap={2}>
                                <FaRegUser />
                                <Text>{user?.displayName}</Text>
                            </Flex>

                            <Button onClick={handleSignOut} bg="transparent" color="black">Sign Out</Button>
                        </>
                    )}
                </Flex>
            </Flex>

            {/* Mobile Menu */}
            {menuOpen && (
                <Box ref={menuRef} position="absolute" top="50px" right="0" bg="white" boxShadow="md" p={4} borderRadius="md" width="200px" zIndex="100">
                    <VStack align="start" spacing={3}>
                        {!user ? (
                            <>
                                <Button color="gray.500" width="100%" onClick={() => navigate("/login")}>Login</Button>
                                <Button color="gray.500" width="100%" onClick={() => handleGoogleSignIn(navigate)}>Sign in with Google</Button>
                            </>
                        ) : (
                            <>
                                <Link to="/host" >
                                        <Button w={"169px"} bg="transparent" color="black">Add Property</Button>
                                </Link>
                                <Flex fontSize="sm" borderRadius={8} p="9px" mt={3} mb={3} w={"100%"} border="1px solid" borderColor="gray.200"
                                    _hover={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }} fontWeight="medium"
                                    align="center" gap={2} justifyContent={"center"}>
                                        <FaRegUser color="black" />
                                        <Text color="black">{user?.displayName}</Text>
                                </Flex>
                                    <Button width="100%" onClick={handleSignOut} bg="transparent" color="black">Sign Out</Button>
                            </>
                        )}
                    </VStack>
                </Box>
            )}
        </Box>
    );
};

export default Navbar;
