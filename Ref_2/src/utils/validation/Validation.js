import * as yup from 'yup';

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
    password: yup.string().required('password is requird')
})