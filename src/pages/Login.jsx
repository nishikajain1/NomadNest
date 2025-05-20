import { Box, Button, Flex, Heading, Input, Text } from '@chakra-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import "../styles/styles.css"

const Login = () => {
  const [fullName, setFullname] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
      <Box maxW={{ base: "90%", md: "50%" }} mx={"auto"} mt={"100px"} p={5} border={"1px solid"} borderColor={"gray.300"} borderRadius={8} >
        
        <Heading>Login</Heading>
        {error && <Text>{error}</Text>}
        <Input placeholder='Enter name' mb={3} value={fullName} onChange={(e) =>setFullname(e.target.value)}/>
        <Input placeholder='Enter email' mb={3} value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder='Enter password' type='password' mb={3} value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={handleLogin}>Login</Button>
        <Text>New user ? <Button varient="link" onClick={() => navigate("/signup")}>SignUp</Button></Text>
      </Box>
    </Flex>
  )
}

export default Login
