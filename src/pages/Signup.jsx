import { Box, Button, Flex, Heading, Input, Text } from '@chakra-ui/react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import "../styles/styles.css"

const Signup = () => {
    const [fullName, setFullname] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async () => {
        setError("");
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: fullName,
            });

            console.log("User signed up:", user);
            navigate("/");
        } catch (error) {
            console.error("Error signing up:", error.message);
        }
    }

    return (
        <Flex minHeight="80vh" flexDirection="column">
            <Box maxW={{ base: "90%", md: "50%" }} mx={"auto"} mt={"100px"} p={5} border={"1px solid"} borderColor={"gray.300"} borderRadius={8}>
            <Heading>Sign Up</Heading>
            {error && <Text>{error}</Text>}
            <Input placeholder='Enter name' mb={3} value={fullName} onChange={(e) =>setFullname(e.target.value)}/>
            <Input placeholder='Enter email' mb={3} value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder='Enter password' type='password' mb={3} value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button onClick={handleSignUp}>Sign Up</Button>
            <Text>Already have an account ? <Button varient="link" onClick={() => navigate("/login")}>Login</Button></Text>
        </Box>
        </Flex>
    )
}

export default Signup
