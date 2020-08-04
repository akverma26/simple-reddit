import { Input, useToast } from "@chakra-ui/core";
import { auth, firestore } from "firebase";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useRouter } from "next/router";

const SignUpForm = () => {
    const router = useRouter();
    const toast = useToast();

    const signup = (event) => {
        event.preventDefault();
        const signupForm = document.querySelector("#signupForm");

        // First check if the phone number is already used or not
        firestore()
            .collection("emailPhone")
            .doc(signupForm["phoneNumber"].value)
            .get()
            .then((snapShots) => {
                if (snapShots.exists) {
                    throw Error(
                        "This phone number is in use with another account"
                    );
                } else {
                    // If phone number is not used allow to signup
                    return auth().createUserWithEmailAndPassword(
                        signupForm["email"].value,
                        signupForm["password"].value
                    );
                }
            })
            .then((userCredentials) => {
                // After successful signup link phone with email address
                return firestore()
                    .collection("emailPhone")
                    .doc(signupForm["phoneNumber"].value)
                    .set({ email: userCredentials.user.email });
            })
            .then(() => {
                toast({
                    title: "Success",
                    description: "Account created successfully.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-right",
                });
                router.push("/");
            })
            .catch((err) => {
                toast({
                    title: "Error.",
                    description: err.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-right",
                });
            });
    };

    const validatePhone = (e) => {
        if (e.target.value && isValidPhoneNumber(e.target.value)) {
            e.target.setCustomValidity("");
        } else {
            e.target.setCustomValidity("Invalid Phone");
        }
    };

    const validateEmail = (e) => {
        if (
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value)
        ) {
            e.target.setCustomValidity("");
        } else {
            e.target.setCustomValidity("Invalid Email");
        }
    };

    return (
        <form
            id="signupForm"
            onSubmit={signup}
            style={{
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                padding: "100px 40px",
                paddingTop: "80px",
                color: "#666",
                background: "rgb(245, 245, 245)",
                borderRadius: "5px",
                minWidth: "500px",
                boxShadow: "0 0 16px rgba(0, 0, 0, 0.05)",
                fontFamily: "MainRegular",
            }}
        >
            <Input
                id="phoneNumber"
                className="tel"
                type="tel"
                placeholder="Enter your Phone Number"
                border="none"
                borderBottom="1px solid rgb(200, 200, 200)"
                padding="20px"
                fontFamily="MainRegular"
                background="transparent"
                color="#333"
                outline="none"
                isRequired={true}
                onChange={validatePhone}
                _focus={{
                    outline: "none",
                    borderBottom: "1px solid rgb(150, 150, 150)",
                }}
                _placeholder={{ color: "rgb(80, 80, 80)" }}
            ></Input>

            <Input
                id="email"
                mt="40px"
                className="email"
                type="email"
                placeholder="Enter your Email Address"
                border="none"
                borderBottom="1px solid rgb(200, 200, 200)"
                padding="20px"
                fontFamily="MainRegular"
                background="transparent"
                color="#333"
                outline="none"
                isRequired={true}
                onChange={validateEmail}
                _focus={{
                    outline: "none",
                    borderBottom: "1px solid rgb(150, 150, 150)",
                }}
                _placeholder={{ color: "rgb(80, 80, 80)" }}
            ></Input>

            <Input
                id="password"
                mt="40px"
                className="password"
                type="password"
                placeholder="Create Password"
                border="none"
                borderBottom="1px solid rgb(200, 200, 200)"
                padding="20px"
                fontFamily="MainRegular"
                background="transparent"
                color="#333"
                outline="none"
                isRequired={true}
                _focus={{
                    outline: "none",
                    borderBottom: "1px solid rgb(150, 150, 150)",
                }}
                _placeholder={{ color: "rgb(80, 80, 80)" }}
            ></Input>

            <Input
                id="re-password"
                mt="40px"
                className="repassword"
                type="password"
                placeholder="Re-Enter the Password"
                border="none"
                borderBottom="1px solid rgb(200, 200, 200)"
                padding="20px"
                fontFamily="MainRegular"
                background="transparent"
                color="#333"
                outline="none"
                isRequired={true}
                _focus={{
                    outline: "none",
                    borderBottom: "1px solid rgb(150, 150, 150)",
                }}
                _placeholder={{ color: "rgb(80, 80, 80)" }}
            ></Input>

            <Input
                mt="60px"
                type="submit"
                border="none"
                outline="none"
                background="rgba(0, 100, 0, 0.8)"
                color="white"
                height="50px"
                _hover={{
                    outline: "none",
                    filter: "brightness(150%)",
                }}
                cursor="pointer"
                value="Signup"
                size="lg"
            ></Input>
        </form>
    );
};

export default SignUpForm;
