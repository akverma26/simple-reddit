import Post from "./Post";

import { Flex, Box } from "@chakra-ui/core";
import { firestore } from "firebase";
import { useState, useEffect } from "react";
import Head from "next/head";

const PostContainer = () => {
    const [snapShots, getSnapShots] = useState([]);
    const [lastDocRef, changeLastDocRef] = useState(null);
    const [tag, changeTag] = useState(null);

    const getData = async (_tag = null) => {
        let collRef = firestore().collection("posts");

        if (_tag) {
            collRef = collRef.where("tags", "array-contains", _tag);
            changeTag(_tag);
        } else {
            changeTag(null);
        }

        collRef = collRef.orderBy("timestamp", "desc").limit(10);
        const _snapShots = await collRef.get();

        const _lastDocRef = _snapShots.docs[_snapShots.docs.length - 1];
        changeLastDocRef(_lastDocRef);

        let snapShotsData = [];
        _snapShots.forEach((snapShot) => {
            let dataObj = snapShot.data();
            dataObj.id = snapShot.id;
            snapShotsData.push(dataObj);
        });

        getSnapShots(snapShotsData);
    };

    const loadMore = async () => {
        let collRef = firestore().collection("posts");

        if (tag) {
            collRef = collRef.where("tags", "array-contains", tag);
            changeTag(tag);
        } else {
            changeTag(null);
        }

        collRef = collRef
            .orderBy("timestamp", "desc")
            .startAfter(lastDocRef)
            .limit(10);

        const _snapShots = await collRef.get();

        const _lastDocRef = _snapShots.docs[_snapShots.docs.length - 1];
        changeLastDocRef(_lastDocRef);

        let snapShotsData = [];
        _snapShots.forEach((snapShot) => {
            let dataObj = snapShot.data();
            dataObj.id = snapShot.id;
            snapShotsData.push(dataObj);
        });

        if (snapShotsData.length == 0) {
            document.getElementById("loadMoreButton").style.display = "none";
        }

        getSnapShots(snapShots.concat(snapShotsData));
    };

    useEffect(() => {
        if (!snapShots.length) getData();
    });

    return (
        <Flex m="auto" minW="500px" flexDir="column">
            <Head>
                <script src="https://kit.fontawesome.com/a076d05399.js"></script>
            </Head>
            {snapShots.map((snapShot) => {
                return (
                    <Post snapShot={snapShot} renderTagQuery={getData}></Post>
                );
            })}
            <Box
                onClick={loadMore}
                w="full"
                textAlign="center"
                color="rgb(100, 100, 180)"
                fontSize="12px"
                cursor="pointer"
                marginBottom="60px"
                id="loadMoreButton"
            >
                Click here to load more...
            </Box>
        </Flex>
    );
};

export default PostContainer;
