import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    Button,
    Link,
} from "@chakra-ui/core";
import { auth } from "firebase";

const WalkthroughPopover = (props) => {
    const initialFocusRef = React.useRef();
    return (
        <Popover
            initialFocusRef={initialFocusRef}
            placement="bottom"
            closeOnBlur={false}
        >
            <PopoverTrigger>{props.children}</PopoverTrigger>
            {!auth().currentUser && (
                <PopoverContent
                    zIndex={4}
                    color="rgb(100, 100, 100)"
                    bg="white"
                    boxShadow="0 0 16px rgba(0,0,0,0.1)"
                    borderRadius="8px"
                >
                    <PopoverHeader pt={4} fontWeight="bold" border="0">
                        Login Required
                    </PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                        To view details you need to login first. Click below to
                        login.
                    </PopoverBody>
                    <PopoverFooter
                        border="0"
                        d="flex"
                        alignItems="center"
                        justifyContent="start"
                        pb={4}
                    >
                        <Link href={`/login/?post=${props.postID}`}>
                            <Button
                                bg="rgba(0, 0, 255, 0.7)"
                                color="white"
                                ref={initialFocusRef}
                                _hover={{
                                    bg: "rgba(0, 0, 255, 0.8)",
                                }}
                                _focus={{
                                    outline: "none",
                                }}
                            >
                                Login
                            </Button>
                        </Link>
                    </PopoverFooter>
                </PopoverContent>
            )}
        </Popover>
    );
};

export default WalkthroughPopover;
