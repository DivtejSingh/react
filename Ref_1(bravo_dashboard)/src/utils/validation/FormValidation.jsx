import * as yup from "yup";

// const emailValidation = yup
//     .string()
//     .test("email", "Invalid email", function (value) {
//         if (!value) return true;
//         return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
//     })
//     .required("Email is required");

const emailValidation = yup
  .string()
  .test("email", "Invalid email", function (value) {
    if (!value) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  })
  .required("Email is required");

export const profileValidation = yup.object({
  // email: emailValidation,
  username: yup.string().required("username is requird"),
  password: yup.string().required("password is requird"),
});

export const createUser = yup.object({
  // authrization_code: yup.string().required("Authentication Code is required"),
  first_name: yup
  .string()
  .required("First Name is required")
  .matches(/^[A-Za-z]+$/, "First Name must contain only letters"),

last_name: yup
  .string()
  .required("Last Name is required")
  .matches(/^[A-Za-z]+$/, "Last Name must contain only letters"),

username: yup
  .string()
  .required("Username is required")
  .matches(/^[A-Za-z]+$/, "Username must contain only letters"),

  phone: yup
  .string()
  .nullable()
  .notRequired()
  .test(
    "min-if-filled",
    "phone must be at least 8 digits.",
    value => !value || value.trim().length >= 8
  )
  .test(
    "max-if-filled",
    "Phone must be at most 11 digits.",
    value => !value || value.trim().length <= 11
  ),
  

  email: yup
  .string()
  .notRequired()
  .trim()
  .test(
    "email-if-filled",
    "Enter a valid email address",
    (value) => {
      if (!value) return true;
      return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,3}$/.test(value); // restrict TLD to 2-4 letters
    }
  )
,

  // password: yup.string().required("Password is required"),
//   dob: yup
//   .date()
//   .transform((value, originalValue) => {
//     return originalValue ? new Date(originalValue) : null;
//   })
//   .typeError("DOB is required")
//   .required("DOB is required")
// ,
  // Age: yup.string().required("Age is required"),
  address: yup.string().required("Address is required"),
  postal_code: yup.string().required("Postal Code is required").min(4),
  gender:yup.string().required("Gender is required")
  // group_id: yup.string().required("Group is required"),
});

export const createAdmin = yup.object({

  // password: yup.string().required("password Code is required"),
  email: yup
  .string()
  .email("Invalid email format")
  .matches(
    /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,3}(?:\.[a-zA-Z]{2,3})*$/,
    "Enter a valid email address"
  )
  .required("Email is required"),

  role_id: yup.string().required("Role is required"),
  first_name: yup
  .string()
  .required("First Name is required")
  .matches(/^[A-Za-z]+$/, "First Name must contain only letters"),

last_name: yup
  .string()
  .required("Last Name is required")
  .matches(/^[A-Za-z]+$/, "Last Name must contain only letters"),

username: yup
  .string()
  .required("Username is required")
  .matches(/^[A-Za-z]+$/, "Username must contain only letters"),
  gender: yup.string().required("Gender is required"),
  phone: yup.string().required("Phone number is required").min(8).max(11),
  address: yup.string().required("Address is required"),
  postal_code: yup.string().required("Postal Code is required").min(5),
  // suburb: yup.string().required("Suburb is required"),
  // state: yup.string().required("State is required"),
  // country: yup.string().required("Country is required"),
  // group_id: yup.string().required("Group is required"),
});

export const createGroup = yup.object({
  group_name: yup.string().required("Group Name is required"),
  group_desc: yup.string().required("Group Description is required"),
});

export const createEvent = yup.object({
  event_title: yup.string().required("Event Title is required"),
  event_end: yup.string().required("Event End Time is required"),
});

export const systemSetting = yup.object({
  admin_level1: yup.string().required("Admin Level 1 is required"),
  admin_level2: yup.string().required("Admin Level 2 is required"),
  user_level1: yup.string().required("User Level 1 is required"),
  user_level2: yup.string().required("User Level 2 is required"),
  user_level3: yup.string().required("User Level 3 is required"),
  // event_desc: yup.string().required("Event Description is required"),
  // event_start: yup.string().required("Event Start Time is required"),
  // event_location: yup.string().required("Event Location is required"),
  // event_cost: yup.string().required("Event Cost is required"),
  // event_doc: yup.string().required("Event Doc is required"),
  // event_notes: yup.string().required("Event Notes is required"),

  // event_group_id: yup.string().required("Event Group Id is required")
  // event_group_id: yup.string().required("Event Group Id is required")
});


export const createParents = yup.object({
  // authrization_code: yup.string().required("Authentication Code is required"),
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  username: yup.string().required("Username is required"),
  phone: yup.string().required("Phone is required").min(8).max(11),
  email: yup.string().required("Email is required"),
  // password: yup.string().required("Password is required"),
  // dob: yup.string().required("DOB is required"),
  // Age: yup.string().required("Age is required"),
  address: yup.string().required("Address is required"),
  // postal_code: yup.string().required("Postal Code is required"),
  // role_id: yup.string().required("Role is required"),
  // group_id: yup.string().required("Group is required"),
});