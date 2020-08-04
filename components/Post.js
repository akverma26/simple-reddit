import {
    Flex,
    Button,
    Box,
    Text,
    Icon,
    Tag,
    Stack,
    useToast,
} from "@chakra-ui/core";
import { auth, firestore } from "firebase";
import WalkthroughPopover from "./PopOver";

const sendEmail = async (postID, to) => {
    const privateDetailsSnapshots = await firestore()
        .collection(`posts/${postID}/private`)
        .get();

    const publicDetailsSnapshot = await firestore()
        .collection("posts")
        .doc(postID)
        .get();
    const privateDetails = privateDetailsSnapshots.docs[0].data();
    const publicDetails = publicDetailsSnapshot.data();

    const text = `
        Complete details about ${publicDetails.linkedinURL}\n\n
        City: ${publicDetails.place}\n
        Email: ${privateDetails.email}\n
        Phone No: ${privateDetails.phoneNumber}\n\n\n
        Thank you.
    `;

    const html = `
        <p><strong>Complete details about ${publicDetails.linkedinURL}</strong></p>
        <p><strong>City:</strong> ${publicDetails.place}</p>
        <p><strong>Email:</strong> ${privateDetails.email}</p>
        <p><strong>Phone No:</strong> ${privateDetails.phoneNumber}</p>
        Thank you.
    `;

    const popUpContext = window.open(
        `/send-email/?to=${to}&text=${text}&html=${html}`,
        "popup",
        "width=600, height=600"
    );

    setTimeout(() => {
        popUpContext.close();
    }, 5000);

    // router.push(``);
};

const Post = (props) => {
    const toast = useToast();

    const renderTagQuery = (e) => {
        props.renderTagQuery(e.target.innerHTML);
    };

    const sendEmail = async (postID, to) => {
        const privateDetailsSnapshots = await firestore()
            .collection(`posts/${postID}/private`)
            .get();

        const publicDetailsSnapshot = await firestore()
            .collection("posts")
            .doc(postID)
            .get();
        const privateDetails = privateDetailsSnapshots.docs[0].data();
        const publicDetails = publicDetailsSnapshot.data();

        const text = `
            Complete details about ${publicDetails.linkedinURL}\n\n
            City: ${publicDetails.place}\n
            Email: ${privateDetails.email}\n
            Phone No: ${privateDetails.phoneNumber}\n\n\n
            Thank you.
        `;

        const html = `
            <p><strong>Complete details about ${publicDetails.linkedinURL}</strong></p>
            <p><strong>City:</strong> ${publicDetails.place}</p>
            <p><strong>Email:</strong> ${privateDetails.email}</p>
            <p><strong>Phone No:</strong> ${privateDetails.phoneNumber}</p>
            Thank you.
        `;

        const popUpContext = window.open(
            `/send-email/?to=${to}&text=${text}&html=${html}`,
            "popup",
            "width=600, height=600"
        );

        setTimeout(() => {
            popUpContext.close();
            toast({
                title: "Success",
                description:
                    "Details have been sent to your email. Check your mail.",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom-right",
            });
        }, 5000);

        // router.push(``);
    };

    const formatTime = (timestamp) => {
        const hoursDiff = (Date.now() - timestamp.toDate().getTime()) / 3600000;
        if (hoursDiff * 60 < 1) {
            return `${Math.round(hoursDiff * 3600)} secs ago`;
        } else if (hoursDiff < 1) {
            return `${Math.round(hoursDiff * 60)} mins ago`;
        } else if (hoursDiff < 24) {
            return `${Math.round(hoursDiff)} hours ago`;
        } else if (hoursDiff < 48) {
            return `Yesterday`;
        } else {
            const months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "June",
                "July",
                "Aug",
                "Sept",
                "Oct",
                "Nov",
                "Dec",
            ];
            return `${timestamp.toDate().getFullYear()}, ${
                months[timestamp.toDate().getMonth()]
            } ${timestamp.toDate().getDate()}`;
        }
    };

    const viewDetails = (e) => {
        if (auth().currentUser) {
            const postID = e.target.id;
            const to = auth().currentUser.email;
            sendEmail(postID, to);
        }
    };

    return (
        <Flex
            flexDirection="column"
            w="100%"
            boxShadow="0 0 16px rgba(0, 0, 0, 0.05)"
            background="rgb(245,245,245)"
            borderRadius="5px"
            marginBottom="60px"
        >
            <Flex
                alignItems="center"
                justifyContent="space-between"
                w="100%"
                borderBottom="2px solid rgb(230, 230, 230)"
                p="20px"
            >
                <Text as="span" fontSize="10px" fontFamily="MainLight">
                    Posted by{" "}
                    <b style={{ fontSize: "14px" }}>
                        {props.snapShot.postedBy}
                    </b>
                </Text>
                <Text as="span" ml="5px" fontSize="10px" fontFamily="MainLight">
                    <Icon name="time" mr="5px"></Icon>
                    {formatTime(props.snapShot.timestamp)}
                </Text>
            </Flex>
            <Box
                p="20px"
                color="rgb(100, 100, 100)"
                borderBottom="2px solid rgb(230, 230, 230)"
            >
                <Text mt="5px">
                    <i
                        className="fab fa-linkedin"
                        style={{
                            fontSize: "20px",
                            marginRight: "10px",
                            color: "rgb(120, 120, 120)",
                        }}
                    ></i>{" "}
                    {props.snapShot.linkedinURL}
                </Text>
                <Text mt="20px">
                    <i
                        className="fas fa-map-marked-alt"
                        style={{
                            fontSize: "20px",
                            marginRight: "10px",
                            color: "rgb(120, 120, 120)",
                        }}
                    ></i>{" "}
                    {props.snapShot.place}
                </Text>
                <WalkthroughPopover postID={props.snapShot.id}>
                    <Button
                        mt="20px"
                        bg="rgba(80, 180, 80, 0.8)"
                        fontWeight="300"
                        color="white"
                        transition="0.3s"
                        id={props.snapShot.id}
                        onClick={viewDetails}
                        _hover={{
                            transform: "translate(3px, 3px) scale(1.05)",
                        }}
                        _active={{
                            outline: "none",
                            border: "none",
                        }}
                        _focus={{
                            outline: "none",
                            border: "none",
                        }}
                    >
                        View Details
                    </Button>
                </WalkthroughPopover>
            </Box>
            <Stack spacing={4} padding="20px" isInline>
                {props.snapShot.tags.map((tag) => {
                    return (
                        <Tag
                            bg="rgb(238,238,238)"
                            color="rgb(100,100,100)"
                            fontFamily="MainLight"
                            fontSize="12px"
                            size="sm"
                            cursor="pointer"
                            transition="0.3s"
                            _hover={{ bg: "rgb(200,200,220)" }}
                            onClick={renderTagQuery}
                        >
                            {tag}
                        </Tag>
                    );
                })}
            </Stack>
        </Flex>
    );
};

export default Post;
export { sendEmail };
