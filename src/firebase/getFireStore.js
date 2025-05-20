// firestore.js
import { getFirestore, doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore";
import { app } from "./firebaseConfig"; // Ensure Firebase is initialized

// Initialize Firestore
const db = getFirestore(app);

/**
 * Function to add a new user to Firestore
 * @param {string} userId - Unique user ID
 * @param {Object} userData - User details (name, email, etc.)
 */
export async function addUser(userId, userData) {
    try {
        await setDoc(doc(db, "users", userId), userData);
        console.log("User added successfully!");
    } catch (error) {
        console.error("Error adding user:", error);
    }
}

/**
 * Function to get user details from Firestore
 * @param {string} userId - Unique user ID
 * @returns {Object} - User data or null if not found
 */
export async function getUser(userId) {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return userSnap.data();
        } else {
            console.log("No such user found");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}

/**
 * Function to add a new listing to Firestore
 * @param {Object} listingData - Listing details (title, price, location, etc.)
 * @returns {string} - Document ID of the newly created listing
 */
export async function addListing(listingData) {
    try {
        const docRef = await addDoc(collection(db, "listings"), listingData);
        console.log("Listing added with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding listing:", error);
    }
}
