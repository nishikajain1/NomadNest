import React, { useState, useEffect } from "react";
import { db , auth} from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { Box, Button, Input, Textarea, VStack, Heading, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css"

const AddProperty = () => {
    const IMGUR_CLIENT_ID = "6fe986d96cc8786";
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [properties, setProperties] = useState([]);
    const [location, setLocation] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [uploadMessage, setUploadMessage] = useState("");
    const navigate = useNavigate();

    console.log(properties, "properties")

    const uploadImageToImgur = async (file) => {
        if (!file) return "";

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("https://api.imgur.com/3/image", {
                method: "POST",
                headers: {
                    Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                return data.data.link;
            } else {
                throw new Error("Image upload failed");
            }
        } catch (error) {
            console.error("Error uploading image to Imgur:", error);
            return "";
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setUploadMessage("Uploading property...Please wait.")
        try {
            const user = auth.currentUser;
            if (!user) {
                setUploadMessage("User not logged in");
                return;
            }
            const userId = user.uid;


            const fileInput = e.target.querySelector('input[type="file"]');
            const file = fileInput.files[0];
            const uploadedImageUrl = await uploadImageToImgur(file);
            setImageUrl(uploadedImageUrl);

            await addDoc(collection(db, "properties"), {
                title,
                description,
                price,
                location,
                checkIn,
                checkOut,
                adults,
                children,
                imageUrl: uploadedImageUrl,
                createdAt: serverTimestamp(),
                userId: user.uid,
                hostName: user.displayName || "Unknown Host",
            });

            setUploadMessage("Property added successfully!");
            setTimeout(()=> setUploadMessage(""),3000);
            navigate("/");
        } catch (error) {
            console.error("Error adding property:", error);
            setUploadMessage("Failed to upload property. Please try again.")
        } finally {
            setLoading(false);
        }
    };

    const fetchProperties = async () => {
        const querySnapshot = await getDocs(collection(db, "properties"));
        const propertyList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProperties(propertyList);
    };

    useEffect(() => {
        fetchProperties();
    }, []);



    return (
        <Box p={5} maxW={{base:"100%", md: "80%"}} mx="auto">
            <Heading size="lg" mb={6} textAlign="center">List a New Property</Heading>
            <VStack as="form" onSubmit={handleSubmit} spacing={4} margin={"auto"} p={5} boxShadow="md" borderRadius="md" maxW={{base:"100%", md: "80%"}}>

                <Box w="full" mb={2}>
                    <Text mb={1}>Property Title</Text>
                    {/* <Input placeholder="Enter property title" value={title} onChange={(e) => setTitle(e.target.value)} required /> */}
                    <select style={{
                        border: "1px solid #E4E4E7",
                        height: "39px",
                        width: "100%",
                        borderRadius: "5px",
                        padding: "5px",
                        fontSize: "14px",
                        color: "gray"
                    }} value={title} onChange={(e) => setTitle(e.target.value)}>
                        <option value="">Enter property title</option>
                        <option value="Rooms">Rooms</option>
                        <option value="Lakefront">Lakefront</option>
                        <option value="Amazing View">Amazing View</option>
                        <option value="Beachfront">Beachfront</option>
                        <option value="Treehouses">Treehouses</option>
                        <option value="Luxe">Luxe</option>
                        <option value="Amazing pools">Amazing pools</option>
                        <option value="Farms">Farms</option>
                    </select>
                </Box>

                <Box w="full" mb={2}>
                    <Text mb={1}>Location</Text>
                    <Input placeholder="Enter location (Address, City, Country)" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </Box>

                <Box w="full" mb={2}>
                    <Text mb={1}>Check-in Date</Text>
                    <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
                </Box>

                <Box w="full" mb={2}>
                    <Text mb={1}>Check-out Date</Text>
                    <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
                </Box>

                <Box w="full" mb={2}>
                    <Text mb={1}>Guests</Text>
                    <Box display="flex" gap={3}>
                        <Box flex="1">
                            <Text fontSize="sm" mb={1}>Adults</Text>
                            <select value={adults} onChange={(e) => setAdults(e.target.value)} required
                                style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}>
                                <option value="">Select Adults</option>
                                {[...Array(10).keys()].map(i => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </Box>

                        <Box flex="1" mb={2}>
                            <Text fontSize="sm" mb={1}>Children</Text>
                            <select value={children} onChange={(e) => setChildren(e.target.value)}
                                style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}>
                                <option value="">Select Children</option>
                                {[...Array(10).keys()].map(i => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                        </Box>
                    </Box>
                </Box>

                <Box w="full" mb={2}>
                    <Text mb={1}>Price Per Night (&#8377;)</Text>
                    <Input type="number" min="0" placeholder="Enter price per night" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </Box>

                <Box w="full" mb={2}>
                    <Text mb={1}>Description</Text>
                    <Textarea placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </Box>

                <Box w="full" mb={2}>
                    <Text mb={1}>
                        Upload Property Image
                        <Text as="span" fontSize="12px" color="gray.500"> (jpg / jpeg / png)</Text>
                    </Text>
                    <Input p={1.5} type="file" accept="image/*" required />
                    {/* {imageUrl && <Image src={imageUrl} alt="Uploaded" boxSize="150px" mt={2} />} */}
                </Box>

                {uploadMessage && (
                    <Text color={loading ? "orange.500" : "green.500"} fontWeight="bold">
                        {uploadMessage}
                    </Text>
                )}
                <Button
                    type="submit"
                    color="white"
                    bgColor="#F44336"
                    borderRadius={8}
                    isLoading={loading}
                    isDisabled={loading}
                    w="full"
                >
                    {loading ? "Uploading..." : "Submit"}
                </Button>

                {/* <Button type="submit" color={"white"} bgColor={"#F44336"} borderRadius={8} isLoading={loading} w="full">Submit</Button> */}
            </VStack>

            <Heading size="lg" mt={10} mb={4} textAlign="left">All Properties</Heading>
            {Array.isArray(properties) && properties.length > 0 ? (
                <SimpleGrid columns={[1, 2, 3, 4]} gap={5}>
                    {properties?.map((property) => (
                        <Box key={property.id} p={4} boxShadow="md" borderRadius="md">
                            {property.imageUrl && (
                                <Image src={property.imageUrl} alt={property.title} height="200px" width="300px" borderRadius="md" />
                            )}
                            <Text fontWeight="bold" mt={2}>{property.title}</Text>
                            <Text>{property.location}</Text>
                            <Text>Check-in: {property.checkIn} | Check-out: {property.checkOut}</Text>
                            <Text>Adults: {property.adults} | Children: {property.children}</Text>
                            <Text color="green.600">&#8377;{property.price} per night</Text>
                        </Box>
                    ))}
                </SimpleGrid>
            ) : (
                <Text>No properties found</Text>
            )}
        </Box>
    );
};


export default AddProperty;
