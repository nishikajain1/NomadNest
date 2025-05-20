import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Flex, Text, Button, Image, Heading, Input, HStack } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, differenceInDays } from "date-fns";
import QRCode from "../assets/QR-Code.png";
import { IoIosArrowBack } from "react-icons/io";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { SlDiamond } from "react-icons/sl";

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { propertyId, checkIn, checkOut, guest, nights, pricePerNight, propertyImage, propertyTitle, propertyDescription } =
        location.state || {};

        console.log(location.state, "location state")

    if (!propertyId || !checkIn || !checkOut || !guest || !nights || !pricePerNight) {
        return (
            <Flex height="100vh" justifyContent="center" alignItems="center">
                <Text fontSize="lg" color="red.500">
                    Error: Missing details. Please go back and select all required information.
                </Text>
            </Flex>
        );
    }

    const [user, setUser] = useState("");
    const [selectedCheckIn, setSelectedCheckIn] = useState(new Date(checkIn));
    const [selectedCheckOut, setSelectedCheckOut] = useState(new Date(checkOut));
    const [isEditingDates, setIsEditingDates] = useState(false);
    const [isEditingGuests, setIsEditingGuests] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(guest);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [upiOption, setUpiOption] = useState("");
    const [upiID, setUpiID] = useState("");
    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: ""
    });
    const [showQRCode, setShowQRCode] = useState(false);

    const updatedNights = differenceInDays(selectedCheckOut, selectedCheckIn);

    const formattedCheckIn = selectedCheckIn ? format(selectedCheckIn, "dd-MMM") : "";
    const formattedCheckOut = selectedCheckOut ? format(selectedCheckOut, "dd-MMM") : "";

    const totalPrice = updatedNights * pricePerNight;
    const serviceFee = 5000;
    const grandTotal = totalPrice + serviceFee;
    const [hostName, setHostName] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleCardInputChange = (e) => {
        setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
    };

    const handlePaymentSubmit = () => {
        let paymentInfo = {};

        if (paymentMethod === "upi") {
            paymentInfo = upiOption === "upi-id"
                ? { method: "UPI ID", upiID }
                : { method: "UPI QR Code" };
        } else {
            paymentInfo = { method: "Credit/Debit Card", ...cardDetails };
        }

        alert(`Payment Successful using ${paymentInfo.method}.`);
    };

    useEffect(() => {
        const fetchHostName = async () => {
            if (!propertyId) return; // Prevent fetching if propertyId is missing

            try {
                const propertyRef = doc(db, "properties", propertyId);
                const propertySnap = await getDoc(propertyRef);

                if (propertySnap.exists()) {
                    setHostName(propertySnap.data().hostName || "Unknown Host");
                    console.log("Host Name:", propertySnap.data().hostName);
                } else {
                    console.log("No such property found in Firestore!");
                }
            } catch (error) {
                console.error("Error fetching host name:", error);
            }
        };

        fetchHostName();
    }, [propertyId]);

    return (
        <Box p={5} maxW={{ base: "90%", md: "80%" }} mx="auto" >
            <Flex align={"center"} mb={8} >                
                <IoIosArrowBack cursor="pointer"
                    onClick={() => navigate(`/property/${propertyId}`)} size={"25px"}/>
                <Heading ml={3} fontSize={"3xl"}>Confirm and Pay</Heading>
            </Flex>

            <Flex flexDirection={{ base: "column-reverse", md: "row" }} justifyContent="space-between" >
                
                <Box flex="1" maxW={{base:"100%", md:"50%" }}>
                    <HStack border={"1px solid"} borderColor={"gray.300"} p={6} borderRadius={10} justifyContent={"space-evenly"} >                        
                            <Box>
                                <Heading mb={2}>This is a rare find.</Heading>
                            <Text>{hostName}'s place is usually booked</Text>
                            </Box>
                            <SlDiamond size={"30px"} color="#F44336" />                        
                    </HStack>

                    <hr style={{ marginTop: "30px" }} />

                    <Box  pt={6} borderRadius={10}  justifyContent={"space-evenly"}>
                        <Heading>Your Trip</Heading>

                        <Box mt={3}>
                            <Flex justify="space-between" align="center" my={4}>
                                <Text fontWeight="bold">Dates:</Text>
                                <HStack>
                                <Text justifyContent={"flex-end"}>{formattedCheckIn} - {formattedCheckOut}</Text>
                                <Button size="sm" onClick={() => setIsEditingDates(!isEditingDates)}>Edit</Button>
                                </HStack>
                            </Flex>

                            {isEditingDates && (
                                <Flex justify="space-between" align="center" my={4}>
                                <Box>
                                    <Text p={1}>Select Check-in Date:</Text>
                                    <Box p={1} color={"gray"}>
                                    <DatePicker
                                        selected={selectedCheckIn}
                                        onChange={(date) => setSelectedCheckIn(date)}
                                        dateFormat="dd-MMM-yyyy"
                                        minDate={new Date()}
                                        /></Box>
                                    <Text p={1}>Select Check-out Date:</Text>
                                    <Box p={1} color={"gray"}>
                                    <DatePicker
                                        selected={selectedCheckOut}
                                        onChange={(date) => setSelectedCheckOut(date)}
                                        dateFormat="dd-MMM-yyyy"
                                        minDate={selectedCheckIn}
                                        /></Box>
                                    <br />                                    
                                </Box>
                                    <Button mt={2} onClick={() => setIsEditingDates(false)}>Save</Button>
                                </Flex>
                            )}
                        </Box>

                        {/* <hr style={{ margin: "20px 0" }} /> */}

                        <Box>
                            <Flex justify="space-between" align="center" my={4}>
                                <Text fontWeight="bold">Guests:</Text>
                                {isEditingGuests ? (
                                    <Box>
                                        <select value={selectedGuest} onChange={(e) => setSelectedGuest(e.target.value)}>
                                            {[...Array(10).keys()].map(i => (
                                                <option key={i} value={i + 1}>{i + 1} guest</option>
                                            ))}
                                        </select>
                                        <Button size="sm" onClick={() => setIsEditingGuests(false)} ml={2}>
                                            Done
                                        </Button>
                                    </Box>
                                ) : (
                                    <Flex align="center">
                                        <Text>{selectedGuest} guest{selectedGuest > 1 ? "s" : ""}</Text>
                                        <Button size="sm" ml={2} onClick={() => setIsEditingGuests(true)}>
                                            Edit
                                        </Button>
                                    </Flex>
                                )}
                            </Flex>
                        </Box>
                    </Box>
                    <hr style={{ marginTop: "30px" }} />

                    {/* Payment Method Selection */}
                    <Heading pt={6} pb={6}>Pay with</Heading>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ border: "2px solid gray", width: "100%", height: "60px", borderRadius: "5px", padding: "10px" }}
                    >
                        <option value="">Select payment method</option>
                        <option value="upi">UPI</option>
                        <option value="credit-card">Credit Card</option>
                        <option value="debit-card">Debit Card</option>
                    </select>

                    {/* UPI Payment Options */}
                    {paymentMethod === "upi" && (
                        <Box mt={3}>
                            <Text fontWeight="bold">Choose UPI Payment Method:</Text>
                            <Flex mt={2}>
                                <Button onClick={() => setUpiOption("upi-id")} mr={2}>
                                    Pay using UPI ID
                                </Button>
                                <Button onClick={() => { setUpiOption("qr-code"); setShowQRCode(true); }}>
                                    Pay using QR Code
                                </Button>
                            </Flex>

                            {upiOption === "upi-id" && (
                                <Input mt={3} placeholder="Enter your UPI ID (e.g., yourname@upi)" value={upiID} onChange={(e) => setUpiID(e.target.value)} />
                            )}

                            {upiOption === "qr-code" && showQRCode && (
                                <Box
                                    position="fixed"
                                    top="50%"
                                    left="50%"
                                    transform="translate(-50%, -50%)"
                                    bg="white"
                                    p={5}
                                    borderRadius={10}
                                    boxShadow="lg"
                                    zIndex={1000}
                                >
                                    <Text fontWeight="bold" textAlign="center" mb={3}>Scan to Pay</Text>
                                    <Image src={QRCode} alt="UPI QR Code" maxW={"400px"}/>
                                    <Button
                                        mt={3}
                                        colorScheme="red"
                                        display="block"
                                        mx="auto"
                                        onClick={() => setShowQRCode(false)}
                                    >
                                        Close
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Credit/Debit Card Form */}
                    {
                        (paymentMethod === "credit-card" || paymentMethod === "debit-card") && (
                            <Box mt={3}>
                                <Input
                                    placeholder="Card Number"
                                    name="cardNumber"
                                    value={cardDetails.cardNumber}
                                    onChange={handleCardInputChange}
                                    mt={2}
                                />
                                <Flex gap={2} mt={2}>
                                    <Input
                                        placeholder="Expiration Date (MM/YY)"
                                        name="expiryDate"
                                        value={cardDetails.expiryDate}
                                        onChange={handleCardInputChange}
                                    />
                                    <Input
                                        placeholder="CVV"
                                        name="cvv"
                                        value={cardDetails.cvv}
                                        onChange={handleCardInputChange}
                                    />
                                </Flex>
                                <Input
                                    placeholder="Cardholder Name"
                                    name="cardholderName"
                                    value={cardDetails.cardholderName}
                                    onChange={handleCardInputChange}
                                    mt={2}
                                />
                            </Box>
                        )
                    }
                    <hr style={{ marginTop: "30px" }} />
                    {/* Cancellation Policy */}
                    <Box>
                        <Heading pt={6} pb={6}>Cancellation policy</Heading>
                        <Text color="gray.600">
                            <span style={{fontWeight: "bold"}}>Free cancellation before 5 days of check-in.</span> Get a full refund if you change your mind.
                        </Text>
                    </Box>
                    <hr style={{ marginTop: "30px" }} />
                    <Box>
                        <Heading pt={6} pb={6}>Ground rules</Heading>
                        <Text>We ask every guest to remember a few simple things about what makes a great guest.
                            <br />
                            <br />
                            · Follow the house rules
                            <br />
                            · Treat your Host’s home like your own</Text>
                    </Box>
                    <hr style={{ marginTop: "30px" }} />

                    <Text pt={6} pb={6} fontSize={"xs"}>By selecting the button below, I agree to the Host's House Rules, Ground rules for guests, Airbnb's Rebooking and Refund Policy and that Airbnb can charge my payment method if I’m responsible for damage.</Text>

                    <Button
                        width={{base:"100%", md:"50%"}}
                        height={"60px"}
                        fontSize={"xl"}
                        bg="#F44336"
                        color="white"
                        _hover={{ bg: "#D32F2F" }}
                        onClick={handlePaymentSubmit}
                    >
                        Confirm and Pay
                    </Button>
                </Box>



                {/* Right Section */}
                <Box mb={10} flex="1" border={"1px solid"}  maxW={{base:"100%", md:"40%"}} borderColor={"gray.300"} p={6} borderRadius={10} justifyContent={"space-evenly"} maxH={"-webkit-fit-content"} >
                    {/* Property Image */}
                    <HStack flexDirection={{ base: "column", md: "row" }}>
                    <Image mb={5} src={propertyImage} alt={propertyTitle} boxSize={"250px"} borderRadius="10px" />
                    
                    <Box>
                        <Text fontSize="lg" fontWeight="bold">{propertyTitle}</Text>
                        <Text fontSize="sm" color="gray.500" mb={2}>{propertyDescription}</Text>
                    </Box>
                    </HStack>

                    <hr style={{ margin: "20px 0" }} />

                    {/* Price details */}
                    <Box>
                        <Heading pb={6}>Your Total</Heading>
                        <Flex justify="space-between">
                            <Text>₹{pricePerNight} x {updatedNights} nights</Text>
                            <Text fontWeight="bold">₹{totalPrice}</Text>
                        </Flex>

                        <Flex justify="space-between" mt={2}>
                            <Text>Service Fee</Text>
                            <Text fontWeight="bold">₹{serviceFee}</Text>
                        </Flex>

                        <hr style={{ marginTop: "20px", marginBottom: "20px" }} />

                        <Flex justify="space-between">
                            <Text fontWeight="bold">Total (INR)</Text>
                            <Text fontWeight="bold">₹{grandTotal}</Text>
                        </Flex>
                    </Box>

                    
                </Box>
            </Flex>
        </Box>
    );
};

export default PaymentPage;


















