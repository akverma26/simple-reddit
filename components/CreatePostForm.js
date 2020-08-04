import { Input, useToast } from "@chakra-ui/core";
import { isValidPhoneNumber } from "react-phone-number-input";
import { auth, firestore } from "firebase";
import * as firebase from "firebase/app";
import { useRouter } from "next/router";
import TagEditor from "react-tageditor/lib/TagEditor";
import ReCAPTCHA from "react-google-recaptcha";

import privateInfo from "../private";

let tags = [];

const CreatePostForm = () => {
    const router = useRouter();
    const toast = useToast();

    const createPost = (e) => {
        e.preventDefault();
        if (tags.length < 1) {
            toast({
                title: "Input Error.",
                description: "Please add atleast one tag.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-right",
            });
            return;
        }
        const createPostForm = document.getElementById("createPostForm");
        const phoneNumber = createPostForm["phoneNumber"].value;
        const linkedinURL = createPostForm["linkedinURL"].value;
        const email = createPostForm["email"].value;
        const place = createPostForm["place"].value;
        const docRef = firestore().collection("posts").doc();

        docRef
            .set({
                postedBy: auth().currentUser.email,
                linkedinURL,
                place,
                tags,
                timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
            })
            .then(() => {
                return docRef.collection("private").add({
                    email,
                    phoneNumber,
                });
            })
            .then(() => {
                toast({
                    title: "Post successfully created.",
                    description: "",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-right",
                });
                router.push("/");
            })
            .catch((err) => {
                toast({
                    title: "Something went wrong.",
                    description: err.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-right",
                });
            });
    };

    const validateLikedinURL = (e) => {
        if (/^https:\/\/www.linkedin.com/.test(e.target.value)) {
            e.target.setCustomValidity("");
        } else {
            e.target.setCustomValidity("Invalid Linkedin URL");
        }
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

    const tagsChanged = (tagChanged, _allTags, action) => {
        tags = _allTags;
    };

    const onCaptchChanges = (value) => {
        if (value) {
            document
                .getElementById("submit-button")
                .setAttribute("aria-disabled", false);
            document.getElementById("submit-button").disabled = false;
        }
    };
    return (
        <form
            id="createPostForm"
            onSubmit={createPost}
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
                id="linkedinURL"
                type="url"
                placeholder="Enter Linkedin URL"
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
                onChange={validateLikedinURL}
            ></Input>

            <Input
                id="phoneNumber"
                mt="40px"
                type="tel"
                placeholder="Enter Phone Number"
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
                onChange={validatePhone}
            ></Input>

            <Input
                id="email"
                mt="40px"
                type="email"
                placeholder="Enter Email Address"
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
                onChange={validateEmail}
            ></Input>

            <Input
                id="place"
                mt="40px"
                type="text"
                placeholder="Enter City"
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

            <TagEditor
                tags={[]}
                delimiters={[32]}
                placeholder="Add Tags (at least one) and separate them by spaces"
                onChange={tagsChanged}
            ></TagEditor>

            <ReCAPTCHA
                sitekey={privateInfo.googReCaptcha.sitekey}
                onChange={onCaptchChanges}
                style={{
                    marginTop: "60px",
                    width: "100%",
                }}
            ></ReCAPTCHA>

            <Input
                mt="60px"
                type="submit"
                border="none"
                outline="none"
                background="rgba(0, 0, 100, 0.8)"
                color="white"
                height="50px"
                id="submit-button"
                _hover={{
                    outline: "none",
                    filter: "brightness(150%)",
                }}
                cursor="pointer"
                value="Create Post"
                size="lg"
                isDisabled={true}
            ></Input>
        </form>
    );
};

export default CreatePostForm;
