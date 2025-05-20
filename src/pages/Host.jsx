import { Box, Button, Flex, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import door from "../assets/3pics/door.png"
import bed from "../assets/3pics/bed.png"
import sofa from "../assets/3pics/sofa.png"


const Host = () => {

    return (
        <Flex flexDirection={{ base: "column", md: "row" }} p={5} maxW="100%" mx="auto" minHeight="80vh" justifyContent={"space-evenly"} alignItems={'center'} borderRadius={10}>
            <Heading fontSize={"30px"} maxW={{base:"80%",md:"40%"}} lineHeight={"2"}>It's easy to get started on Nomad Nest.
                Let's start nesting...
            </Heading>

            <VStack align={"start"} maxW={{base:"80%",md:"40%"}}>
                <HStack>
                    <Box>
                        <Heading>Tell us about your place</Heading>
                        <Text>Share some basic info, such as where it is and how many guests can stay.</Text></Box>
                    <Image w={"20%"} src={door} alt='doorImage' />
                </HStack>

                <hr style={{  border: "1px solid lightgray", width: "100%" }} />

                <HStack justifyContent="space-between" width="100%">
                    <Box flex="1">
                        <Heading>Make it stand out</Heading>
                        <Text>Add photo plus a title and description - we'll help you out.</Text>
                    </Box>
                    <Image w={"20%"} src={sofa} alt='sofaImage' />
                </HStack>

                <hr style={{  border: "1px solid lightgray", width: "100%" }} />

                <HStack><Box>
                    <Heading>Finish up and publish</Heading>
                    <Text>Choose a starting price, verify a few details, then publish your listing.</Text></Box>
                <Image w={"20%"} src={bed} alt='bedImage' />
                </HStack>

                <Link to={"/add-property"}>
                    <Button>Lets start..!!</Button></Link>
            </VStack>

        </Flex>
    )
}

export default Host
