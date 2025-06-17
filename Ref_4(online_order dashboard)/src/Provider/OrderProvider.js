import React, { createContext, useEffect, useState } from "react";
import { app, storage, db, auth } from "../config/Firebase";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { CAlert } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCheckCircle, cilWarning } from "@coreui/icons";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDocs, collection, query, orderBy, limit, setDoc, doc, getDoc, getFirestore, deleteDoc, updateDoc, where, onSnapshot, startAfter } from "firebase/firestore";
import { Category } from "@mui/icons-material";
import { setInLocalStorage } from "../utils/LocalStorageUtills";
export const OnlineContext = createContext(null);

export const OnlineContextProvider = (props) => {
  const [auths, setauths] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [getmeal, setmeal] = useState([]);
  const [allcategorie, setcategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [foodprod, setfoodProducts] = useState([]);
  const [location, setlocation] = useState([]);
  const [summary, setSummary] = useState([]);
  const [Schedule, setSchedule] = useState([]);
  const [orders, setOrders] = useState([]);
  const [places, setPlaces] = useState([]);

  //store Mealsdemo

  const signup = async (data) => {
    const { email, password } = data;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        setInLocalStorage("useruid", user.uid);
        setauths(true);
        return user; // Return the user object if needed
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      window.alert(error.message);
    }
  };

  const checkuser = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setauths(true);
      } else {
        setauths(false);
      }
    });
  };

  const storecateImage = async (file, category) => {
    try {
      // Check if the category already exists
      const categoryRef = collection(db, "Mealsdemo");
      const q = query(categoryRef, where("Name", "==", category));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Category already exists

        setAlert({
          show: true,
          message: "A category with this name already exists",
          type: "danger",
          visible: true,
        });
        // Hide alert after 3 seconds
        setTimeout(() => {
          setAlert({ show: false });
        }, 3000);

        return;
      }

      let downloadUrl = null;

      // Proceed with image upload if file is provided
      if (file) {
        const fileName = Date.now().toString() + ".jpg";
        const response = await fetch(file);
        const blob = await response.blob();
        const imageRef = ref(storage, "mealsdemo/" + fileName);

        await uploadBytes(imageRef, blob);

        downloadUrl = await getDownloadURL(imageRef);
      }

      await Addcategory(downloadUrl, category);
      getAllcategory();
      setAlert({
        show: true,
        message: "Category added successfully",
        type: "success",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    } catch (error) {
      console.error("Error adding category: ", error);
      setAlert({
        show: true,
        message: "Error adding category",
        type: "danger",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    }
  };

  // places
  const AddPlaces = async (category, city, country, nearby, pincode, state, town, placeName) => {
    // Reference to the 'Places' collection
    const PlacesRef = collection(db, "Places");

    // Query to get the document with the highest Id
    const q = query(PlacesRef, orderBy("Id", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    // Generate a new document ID within the 'Places' collection
    const newDocRef = doc(PlacesRef);

    // Prepare the new data to be added
    const newPlaceData = {
      city: city,
      country: country,
      nearby: nearby,
      pincode: pincode,
      state: state,
      town: town,
      placename: placeName,
    };

    // Log the newPlaceData to debug the issue

    // Check if any fields are undefined
    for (const key in newPlaceData) {
      if (newPlaceData[key] === undefined) {
        console.error(`${key} is undefined`);
        return;
      }
    }

    // Set the new document in Firestore
    await setDoc(newDocRef, newPlaceData);

    setAlert({
      show: true,
      message: "Places Added successfully",
      type: "success",
      visible: true,
    });
    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false });
    }, 3000);
  };
  const deletePlace = async (id) => {
    try {
      // Delete the document from Firestore
      await deleteDoc(doc(db, "Places", id));

      // Set success alert
      setAlert({
        show: true,
        message: "Place deleted successfully",
        type: "success",
        visible: true,
      });

      // Hide alert after 3 seconds
      setTimeout(() => setAlert({ show: false }), 3000);

      // Call the function to refresh the places list
      getAllPlaces();
    } catch (error) {
      console.error("Error deleting place:", error);
      setAlert({
        show: true,
        message: "Error deleting place",
        type: "danger",
        visible: true,
      });

      // Hide alert after 3 seconds
      setTimeout(() => setAlert({ show: false }), 3000);
    }
  };

  const getAllPlaces = async () => {
    // Define the query to get all places from the "Places" collection
    const q = query(collection(db, "Places"));

    // Set up a real-time listener for the query
    const unsubscribe = onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
      const places = [];

      // Iterate through the document changes
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified" || change.type === "removed") {
          // Handle added, modified, or removed documents if needed
        }
      });

      // Collect all documents data into the places array, including the document ID
      snapshot.docs.forEach((doc) => {
        places.push({ id: doc.id, ...doc.data() });
      });

      // Determine the source of the data
      const source = snapshot.metadata.fromCache ? "local cache" : "server";

      // Update the state with the new places data
      setPlaces(places); // Replace 'setPlaces' with your actual state updater for places
    });

    // Optionally, return the unsubscribe function to stop listening when needed
    return unsubscribe;
  };
  const updatePlace = async (formData, placeId) => {
    const { city, country, nearby, pincode, state, town, placename } = formData;

    // Check if required fields are present
    if (!city.trim() || !country.trim() || !pincode.trim() || !state.trim() || !placename.trim()) {
      setAlert({
        show: true,
        message: "All fields (City, Country, Pincode, State, Place Name) are required and cannot be empty.",
        type: "danger",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => setAlert({ show: false }), 3000);
      return;
    }

    try {
      // Update place details
      await updateDoc(doc(db, "Places", placeId), formData);

      setAlert({
        show: true,
        message: "Place updated successfully",
        type: "success",
        visible: true,
      });

      setTimeout(() => setAlert({ show: false }), 3000);
    } catch (error) {
      console.error("Error updating place:", error);
      setAlert({
        show: true,
        message: "Error updating place",
        type: "danger",
        visible: true,
      });
      setTimeout(() => setAlert({ show: false }), 3000);
    }
  };

  // Save the Meal details
  const Addcategory = async (downloadUrl, category) => {
    // Reference to the 'Mealsdemo' collection
    const onlineOrderRef = collection(db, "Mealsdemo");

    // Query to get the document with the highest Id
    const q = query(onlineOrderRef, orderBy("Id", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    // Determine the current highest Id
    let currentId = 0;
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      currentId = doc.data().Id;
    }

    // Generate a new document ID within the 'Mealsdemo' collection
    const newDocRef = doc(onlineOrderRef);

    // Update the document with new data
    const newCategoryData = {
      Name: category,
      Id: currentId + 1, // Increment the highest Id
    };

    if (downloadUrl) {
      newCategoryData.ImageUrl = downloadUrl;
    }

    await setDoc(newDocRef, newCategoryData);
  };

  // update meal

  const updateImage = async (id, data, file) => {
    try {
      let downloadUrl = file;

      // Check if the file is a new image file or an existing URL
      if (!file.startsWith("http")) {
        const fileName = Date.now().toString() + ".jpg";
        const response = await fetch(file);
        const blob = await response.blob();
        const imageRef = ref(storage, "Mealsdemo/" + fileName);
        await uploadBytes(imageRef, blob);
        downloadUrl = await getDownloadURL(imageRef);
      }

      // Update data with either the new or existing image URL
      updatedata(id, data, downloadUrl);
      setAlert({
        show: true,
        message: "Update Meal successfully",
        type: "success",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    } catch (error) {
      console.error("Error updating image: ", error);
      setAlert({
        show: true,
        message: "Not Updated",
        type: "danger",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    }
  };

  const updatedata = async (id, data, downloadUrl) => {
    const docref = doc(db, "Mealsdemo", id);

    try {
      await updateDoc(docref, {
        Name: {
          en: data.en,
          he: data.he,
          ru: data.ru,
        },
        ImageUrl: downloadUrl,
      });
      setAlert({
        show: true,
        message: "Update successfully",
        type: "success",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    } catch (error) {
      setAlert({
        show: true,
        message: "Update failed",
        type: "danger",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    }

    getAllcategory();
  };

  //function to get all Mealsdemo

  //delete MEal category
  const deletedoc = async (id, imagePath) => {
    try {
      // Reference to the Firestore document
      const mealDocRef = doc(db, "Mealsdemo", id);
      
      // Get the meal document
      const mealDoc = await getDoc(mealDocRef);
      if (!mealDoc.exists()) {
        throw new Error("Meal not found");
      }
  
      const mealData = mealDoc.data();
      const mealName = mealData.Name.en;
  
      // Find category
      const categoryQuery = query(collection(db, "Categorydemo"), where("Category.en", "==", mealName));
      const querySnapshot = await getDocs(categoryQuery);
  
      if (querySnapshot.empty) {
        const imageRef = ref(storage, imagePath);
  
        // Delete the meal document
        await deleteDoc(mealDocRef);
  
        // Delete the image file
        await deleteObject(imageRef);
  
        // Set alert message with meal name
        setAlert({
          show: true,
          message: `Deleted meal "${mealName}" successfully.`,
          type: "success",
          visible: true,
        });
  
        // Hide alert after 3 seconds
        setTimeout(() => {
          setAlert({ show: false });
        }, 3000);
  
        getAllcategory(); // Refresh category list
  
      } else {
        setAlert({
          show: true,
          message: "Cannot delete the meal as it is associated with a category.",
          type: "danger",
          visible: true,
        });
  
        // Hide alert after 3 seconds
        setTimeout(() => {
          setAlert({ show: false });
        }, 3000);
      }
    } catch (error) {
      console.error("Error deleting document or image file:", error);
      setAlert({
        show: true,
        message: "Cannot delete",
        type: "danger",
        visible: true,
      });
  
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    }
  };
  
  

  //products

  const saveproduct = async (file, formData) => {
    try {
      const productName = formData?.dishName;
      const productMeal = formData?.meal;
      const productCategory = formData?.category;

      // Check if the product already exists with the same name, meal, and category
      const productsRef = collection(db, "Productsdemo");
      const q = query(productsRef, where("Name", "==", productName), where("categorydemo", "==", productCategory), where("meal", "==", productMeal));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Product already exists with the same name, category, and meal

        setAlert({
          show: true,
          message: "A product with this name, category, and meal already exists",
          type: "danger",
          visible: true,
        });
        // Hide alert after 3 seconds
        setTimeout(() => {
          setAlert({ show: false });
        }, 3000);

        return;
      }

      let downloadUrl = null;

      // If a file is provided, proceed with uploading the image
      if (file) {
        try {
          const fileName = Date.now().toString() + ".jpg";
          const response = await fetch(file);
          if (!response.ok) throw new Error("File fetch failed");
          const blob = await response.blob();
          const imageRef = ref(storage, "Products/" + fileName);

          await uploadBytes(imageRef, blob);

          downloadUrl = await getDownloadURL(imageRef);
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError);
          setAlert({
            show: true,
            message: "Failed to upload file. Please try again.",
            type: "danger",
            visible: true,
          });
          // Hide alert after 3 seconds
          setTimeout(() => {
            setAlert({ show: false });
          }, 3000);

          return;
        }
      }

      // Save product details
      await saveproductDetail(formData, downloadUrl);
      setAlert({
        show: true,
        message: "Product successfully added",
        type: "success",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    } catch (error) {
      console.error("Error adding product:", error);
      setAlert({
        show: true,
        message: "Error adding product. Please try again.",
        type: "danger",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    }
  };

  const saveproductDetail = async (formData, downloadUrl) => {
    try {
      // Fetch category data
      const q = query(collection(db, "Categorydemo"), where("Name.en", "==", formData.category));
      const querySnapshot = await getDocs(q);

      let categoryData = null;
      querySnapshot.forEach((doc) => {
        categoryData = doc.data(); // Assuming you want the first match
      });

      if (!categoryData) {
        setAlert({
          show: true,
          message: "No matching category found.",
          type: "danger",
          visible: true,
        });
        // Hide alert after 3 seconds
        setTimeout(() => {
          setAlert({ show: false });
        }, 3000);

        return;
      }

      // Extract only ar, he, and en values from category
      const filteredCategoryData = {
        ru: categoryData.Name.ru,
        he: categoryData.Name.he,
        en: categoryData.Name.en,
      };

      // Fetch meal data
      const m = query(collection(db, "Mealsdemo"), where("Name.en", "==", formData.meal));
      const mSnapshot = await getDocs(m);

      let mealData = null;
      mSnapshot.forEach((doc) => {
        mealData = {
          ...doc.data(), // Spread the document data
          id: doc.id, // Add the document id
        };
      });

      if (!mealData) {
        setAlert({
          show: true,
          message: "No matching meal found.",
          type: "danger",
          visible: true,
        });
        // Hide alert after 3 seconds
        setTimeout(() => {
          setAlert({ show: false });
        }, 3000);

        return;
      }

      // Extract Name and id from meal data
      const filteredMealData = {
        Name: mealData.Name.en,
        id: mealData.id,
      };

      // Save product details
      await setDoc(doc(db, "Productsdemo", Date.now().toString()), {
        Name: formData?.dishName,
        category: filteredCategoryData, // Saving only ar, he, and en values
        meal: filteredMealData, // Saving both Name and id
        isAvailable: formData?.isAvailable,
        ImageUrl: downloadUrl, // This can be null if no image is uploaded
        DietaryInfo: formData?.dietaryInfo,
        Description: formData?.description,
        // Assuming Subcategory is part of formData
      });
    } catch (error) {
      console.error("Error saving product details:", error);
      setAlert({
        show: true,
        message: "Error saving product details. Please try again.",
        type: "danger",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    }
  };

  const validateFormData = (formData) => {
    const { dishName, category, isAvailable, dietaryInfo, description, meal } = formData;

    // Check if required fields are present and not empty
    if (!dishName || !dishName.en || !dishName.ru || !dishName.he || !dishName.en.trim() || !dishName.ru.trim() || !dishName.he.trim()) {
      return {
        isValid: false,
        message: "All language inputs (English, Russian, Hebrew) for Dish Name are required and cannot be empty.",
      };
    }

    if (!category || !category.en || !category.ru || !category.he || !category.en.trim() || !category.ru.trim() || !category.he.trim()) {
      return {
        isValid: false,
        message: "All language inputs (English, Russian, Hebrew) for Category are required and cannot be empty.",
      };
    }

    if (!isAvailable || !isAvailable.trim()) {
      return {
        isValid: false,
        message: "Availability field is required and cannot be empty.",
      };
    }

    if (!dietaryInfo || !dietaryInfo.trim()) {
      return {
        isValid: false,
        message: "Dietary Info field is required and cannot be empty.",
      };
    }

    if (!description || !description.trim()) {
      return {
        isValid: false,
        message: "Description field is required and cannot be empty.",
      };
    }

    if (!meal || !meal.id || !meal.Name || !meal.Name.trim()) {
      return {
        isValid: false,
        message: "Meal information (ID and Name) is required and cannot be empty.",
      };
    }

    return { isValid: true };
  };

  const updateProducts = async (file, formData, uproductId) => {
    try {
      const validation = validateFormData(formData);
      if (!validation.isValid) {
        setAlert({
          show: true,
          message: validation.message,
          type: "danger",
          visible: true,
        });
        // Hide alert after 3 seconds
        setTimeout(() => {
          setAlert({ show: false });
        }, 3000);
        return;
      }
      let downloadUrl = file;

      if (!file.startsWith("http")) {
        const fileName = Date.now().toString() + ".jpg";

        const response = await fetch(file);

        const blob = await response.blob();
        const imageRef = ref(storage, "Products/" + fileName);

        await uploadBytes(imageRef, blob);

        downloadUrl = await getDownloadURL(imageRef);
        setAlert({
          show: true,
          message: "Product updated successfully",
          type: "success",
          visible: true,
        });
        // Hide alert after 3 seconds
        setTimeout(() => {
          setAlert({ show: false });
        }, 3000);
      }

      // Update product details with either the new or existing image URL
      updateProductsDetails(formData, downloadUrl, uproductId);
    } catch (error) {
      setAlert({
        show: true,
        message: "Product Not Updated",
        type: "danger",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    }
  };

  const updateProductsDetails = async (formData, downloadUrl, uproductId) => {
    try {
      const productRef = doc(db, `Products/${uproductId}`);
      await updateDoc(productRef, {
        category: formData?.category,
        Description: formData?.description,
        DietaryInfo: formData.dietaryInfo,
        meal: formData?.meal,
        Name: formData.dishName,
        isAvailable: formData.isAvailable,
        ImageUrl: downloadUrl,
      });
      setAlert({
        show: true,
        message: "Product updated successfully",
        type: "success",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    } catch (error) {
      console.error("Error updating product: ", error);
      setAlert({
        show: true,
        message: "Product Not Added",
        type: "danger",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    }
  };

  const deleteProduct = async (id, imagePath) => {
    try {
      // Delete the document from Firestore
      await deleteDoc(doc(db, "Productsdemo", `${id}`));

      // Reference to the image file in Firebase Storage
      const imageRef = ref(storage, imagePath);

      // Delete the image file from Firebase Storage
      await deleteObject(imageRef);

      // Call the function to refresh the categories
      setAlert({
        show: true,
        message: "Product deleted successfully",
        type: "success",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);

      getAllcategory();
    } catch (error) {
      // console.error("Error deleting document or image file:", error);
      setAlert({
        show: true,
        message: "Product is Not Deleted",
        type: "danger",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    }
  };

  // all sub category

  const getAllcategory = async () => {
    try {
      // Create a query to order documents by "Id"
      const q = query(collection(db, "Mealsdemo"), orderBy("Id"));

      // Fetch documents
      const querySnapshots = await getDocs(q);

      // Map documents to an array of categories
      const categories = querySnapshots.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Update state with fetched categories
      setmeal(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getCategories = async () => {
    try {
      const q = query(collection(db, "Categorydemo"));
      const querySnapshots = await getDocs(q);

      const categories = querySnapshots.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setcategories(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const updatesubcatdata = async (id, data) => {
    try {
      // Extract values from the data object
      const { Name, mealsdemo } = data;

      // Check if Name or mealsdemo is undefined
      if (!Name || !mealsdemo) {
        console.error("Name or mealsdemo data is undefined.");
        setAlert({
          show: true,
          message: "Name and mealsdemo data are required.",
          type: "danger",
          visible: true,
        });
        // Hide alert after 3 seconds
        setTimeout(() => {
          setAlert({ show: false });
        }, 3000);
        return;
      }

      // Validate that all required language inputs are provided
      const { en, ru, he } = Name;
      if (!en || !ru || !he) {
        console.error("One or more language inputs are missing.");
        setAlert({
          show: true,
          message: "All language inputs (English, Russian, Hebrew) are required.",
          type: "danger",
          visible: true,
        });
        // Hide alert after 3 seconds
        setTimeout(() => {
          setAlert({ show: false });
        }, 3000);
        return;
      }

      // Reference to the specific document in the "Categorydemo" collection
      const docRef = doc(db, "Categorydemo", id);

      // Update the document with the new values
      await updateDoc(docRef, {
        Name: {
          en: Name.en,
          he: Name.he,
          ru: Name.ru,
        },
        Category: mealsdemo || "", // Ensure this is not null
      });

      // Continue with success alert and fetching categories
      setAlert({
        show: true,
        message: "Category Updated successfully",
        type: "success",
        visible: true,
      });
      setTimeout(() => setAlert({ show: false }), 3000);
      await getCategories();
    } catch (error) {
      console.error("Error updating document:", error);
      setAlert({
        show: true,
        message: "Failed to update category",
        type: "danger",
        visible: true,
      });
      setTimeout(() => setAlert({ show: false }), 3000);
    }
  };

  // delete subcategories
  const deletesubdoc = async (id) => {
    try {
      await deleteDoc(doc(db, "Categorydemo", id));
      getCategories();
      setAlert({
        show: true,
        message: "Category deleted successfully",
        type: "success",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);

      getAllcategory();
    } catch (error) {
      setAlert({
        show: true,
        message: "Failed to delete the category. Please try again later.",
        type: "danger",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    }
  };

  //category

  const savecategories = async (formData) => {
    const category = formData?.meal; // Assuming 'meal' is the category
    const nameData = formData?.Name; // Assuming 'Name' contains language-specific names

    // Check if category or nameData is undefined
    if (!category || !nameData) {
      console.error("Category or Name data is undefined.");
      setAlert({
        show: true,
        message: "Category and Name data are required.",
        type: "danger",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);

      return;
    }

    // Validate that all required language inputs are provided
    const { en, ru, he } = nameData;

    if (!en || !ru || !he) {
      console.error("One or more language inputs are missing.");
      setAlert({
        show: true,
        message: "All language inputs (English, Russian, Hebrew) are required.",
        type: "danger",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);

      return;
    }

    // Reference to the collection
    const qs = query(collection(db, "Mealsdemo"), where("Name.en", "==", category));
    const querySnapshots = await getDocs(qs);

    let categoryData = null;
    querySnapshots.forEach((doc) => {
      categoryData = doc.data(); // Assuming you want the first match
    });

    if (!categoryData) {
      return;
    }

    // Extract only ar, he, and en values from category
    const filteredCategoryData = {
      ru: categoryData.Name.ru,
      he: categoryData.Name.he,
      en: categoryData.Name.en,
    };

    // Query to check if the name already exists within the same category
    const subcategoryRef = collection(db, "Categorydemo");
    const q = query(subcategoryRef, where("Name", "==", en), where("Categorydemo", "==", category));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Name already exists within the same category
      setAlert({
        show: true,
        message: "An entry with this Name already exists in the same Category",
        type: "danger",
        visible: true,
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);

      return;
    }

    // If name doesn't exist within the same category, proceed to save the new entry
    await setDoc(doc(db, "Categorydemo", Date.now().toString()), {
      Name: {
        en,
        ru,
        he,
      },
      Category: filteredCategoryData,
    });
    getCategories();

    setAlert({
      show: true,
      message: "New Category Added successfully",
      type: "success",
      visible: true,
    });
    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false });
    }, 3000);
  };

  const getAllproducts = async () => {
    // Define the query to get all products from the "Productsdemo" collection
    const q = query(collection(db, "Productsdemo"));

    // Set up a real-time listener for the query
    const unsubscribe = onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
      const products = [];

      // Iterate through the document changes
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          // You can add additional handling for added documents if needed
        }
      });

      // Collect all documents data into the products array, including the document ID
      snapshot.docs.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });

      // Determine the source of the data
      const source = snapshot.metadata.fromCache ? "local cache" : "server";

      // Update the state with the new products data
      setfoodProducts(products);
    });

    // Return the unsubscribe function to stop listening for updates when needed
    return unsubscribe;
  };

  const getAllOrder = () => {
    const q = query(collection(db, "Orders")); // Example with ordering by timestamp

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const orders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orders);

        // Process and log order details
        orders.forEach((order) => {
          const location = order.location || {};
          const summary = order.summary || {};
          const schedule = order.schedule || {};

          // Extracting location details
          const city = location.city || "";
          const state = location.state || "";
          const postalCode = location.postcode || "";
          const country = location.country || "";
          const railway = location.railway || "";
          const road = location.road || "";
          const stateDistrict = location.state_district || "";
          const suburb = location.suburb || "";

          // Extracting summary details
          const breakfast = summary.breakfast || [];
          const lunch = summary.lunch || [];
          const dinner = summary.dinner || [];

          // Set the details or use as needed
          setlocation({
            city,
            state,
            country,
            postalCode,
            railway,
            road,
            stateDistrict,
            suburb,
          });

          setSummary({
            breakfast,
            lunch,
            dinner,
          });

          setSchedule({
            staying: schedule.Staying || false,
            tomorrow: schedule.Tomorrow || false,
            week: schedule.Week || false,
          });

          // Log order details for debugging
        });
      },
      (error) => {
        console.error("Error fetching orders:", error);
        // Handle the error appropriately
      }
    );

    // Cleanup listener when no longer needed
    return () => unsubscribe();
  };

  useEffect(() => {
    getAllcategory();
    getCategories();
    getAllproducts();
    getAllOrder();
    checkuser();
  }, []);

  const contextValue = {
    Addcategory,
    getmeal,
    getAllcategory,
    AddPlaces,
    deletedoc,
    updatedata,
    saveproduct,
    updatePlace,
    deletePlace,
    deleteProduct,
    storecateImage,
    updateImage,
    savecategories,
    getAllPlaces,
    allcategorie,
    subcategories,
    foodprod,
    getAllproducts,
    updateProducts,
    deletesubdoc,
    alert,
    setAlert,
    getAllOrder,
    location,
    summary,
    Schedule,
    orders,
    signup,
    checkuser,
    auths,
    setauths,
    places,
    updatesubcatdata,
  };

  return <OnlineContext.Provider value={contextValue}>{props.children}</OnlineContext.Provider>;
};
