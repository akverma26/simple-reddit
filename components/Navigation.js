import { Flex, Button, ButtonGroup, Text } from "@chakra-ui/core";
import Link from "next/link";
import * as firebase from "firebase/app";
import { auth } from "firebase";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Navigation = (props) => {
    const router = useRouter();
    const logout = () => {
        router.push("/", "/", { swallow: true });
        auth().signOut();
    };
    useEffect(() => {});
    return (
        <Flex
            background="#222"
            position="fixed"
            top="0"
            left="0"
            w="full"
            h="55px"
            padding="0 20px"
            color="#e2e2e2"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            zIndex="9999"
            boxShadow="0 8px 16px rgba(0,0,0,0.3)"
        >
            <Link href="/">
                <a>Simple Reddit</a>
            </Link>
            <ButtonGroup>
                {props.signed ? (
                    <React.StrictMode>
                        <Text
                            pos="fixed"
                            bottom="5px"
                            left="5px"
                            color="rgb(100, 100, 100)"
                            borderBottom="1px solid rgb(200, 200, 200)"
                            padding="0 5px"
                            fontSize="12px"
                        >
                            Logged in as{" "}
                            <b style={{ fontSize: "14px" }}>
                                {auth().currentUser
                                    ? auth().currentUser.email
                                    : ""}
                            </b>
                        </Text>
                        <Link href="/create-post">
                            <Button
                                bg="#338"
                                border="1px solid #558"
                                fontWeight="300"
                                p="8px 30px"
                                height="fit-content"
                                _hover={{ filter: "brightness(130%)" }}
                                _active={{
                                    outline: "none",
                                    border: "none",
                                }}
                                _focus={{
                                    outline: "none",
                                    border: "none",
                                }}
                            >
                                Create Post
                            </Button>
                        </Link>
                        <Button
                            bg="#d33"
                            border="1px solid #d55"
                            fontWeight="300"
                            p="8px 30px"
                            ml="20px"
                            height="fit-content"
                            onClick={logout}
                            _hover={{ filter: "brightness(130%)" }}
                            _active={{
                                outline: "none",
                                border: "none",
                            }}
                            _focus={{
                                outline: "none",
                                border: "none",
                            }}
                        >
                            Logout
                        </Button>
                    </React.StrictMode>
                ) : (
                    <React.StrictMode>
                        <Link href="/login">
                            <Button
                                bg="#333"
                                border="1px solid #555"
                                fontWeight="300"
                                p="8px 30px"
                                ml="20px"
                                height="fit-content"
                                _hover={{ filter: "brightness(130%)" }}
                                _active={{
                                    outline: "none",
                                    border: "none",
                                }}
                                _focus={{
                                    outline: "none",
                                    border: "none",
                                }}
                            >
                                Login
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button
                                bg="#383"
                                border="1px solid #585"
                                fontWeight="300"
                                p="8px 30px"
                                ml="20px"
                                height="fit-content"
                                _hover={{ filter: "brightness(130%)" }}
                                _active={{
                                    outline: "none",
                                    border: "none",
                                }}
                                _focus={{
                                    outline: "none",
                                    border: "none",
                                }}
                            >
                                Signup
                            </Button>
                        </Link>
                    </React.StrictMode>
                )}
            </ButtonGroup>
        </Flex>
    );
};

export default Navigation;
