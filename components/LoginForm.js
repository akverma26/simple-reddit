import { Input, useToast } from "@chakra-ui/core";
import "firebase/auth";
import "firebase/firestore";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useRouter } from "next/router";

import { sendEmail } from "../components/Post";
import { firestore, auth } from "firebase";

const LoginForm = () => {
    const router = useRouter();
    const toast = useToast();

    const afterLogin = () => {
        toast({
            title: "Login success.",
            description: `You are successfully logged in as ${
                auth().currentUser.email
            }`,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "bottom-right",
        });

        if (router.query.post) {
            sendEmail(router.query.post, auth().currentUser.email);
        }
        router.push("/");
    };

    const login = (e) => {
        e.preventDefault();
        const loginForm = document.getElementById("loginForm");
        const credential = loginForm["credential"].value;
        const password = loginForm["password"].value;
        let email = "";
        if (credential && isValidPhoneNumber(credential)) {
            firestore()
                .collection("emailPhone")
                .doc(credential)
                .get()
                .then((snapShot) => {
                    if (snapShot.exists) {
                        email = snapShot.data().email;
                        auth()
                            .signInWithEmailAndPassword(email, password)
                            .then((user) => {
                                afterLogin();
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
                    } else {
                        throw Error("Phone number not registered.");
                    }
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
        } else {
            email = credential;
            auth()
                .signInWithEmailAndPassword(email, password)
                .then((user) => {
                    afterLogin();
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
        }
    };

    const validateCredential = (e) => {
        if (
            (e.target.value && isValidPhoneNumber(e.target.value)) ||
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value)
        ) {
            e.target.setCustomValidity("");
        } else {
            e.target.setCustomValidity("Invalid Phone or Email");
        }
    };

    return (
        <form
            id="loginForm"
            onSubmit={login}
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
                id="credential"
                className="email"
                placeholder="Enter your Phone Number or Email Address"
                border="none"
                borderBottom="1px solid rgb(200, 200, 200)"
                padding="20px"
                fontFamily="MainRegular"
                background="transparent"
                color="#333"
                outline="none"
                isRequired={true}
                onChange={validateCredential}
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
                placeholder="Enter your Password"
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
                fontFamily="MainRegular"
                color="#333"
                outline="none"
                background="rgba(0, 0, 100, 0.8)"
                color="white"
                height="50px"
                _hover={{
                    outline: "none",
                    filter: "brightness(150%)",
                }}
                cursor="pointer"
                value="Login"
                size="lg"
            ></Input>
        </form>
    );
};

export default LoginForm;
