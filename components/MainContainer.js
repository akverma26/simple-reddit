import Head from "next/head";
import * as firebase from "firebase/app";
import { auth } from "firebase";
import { useState } from "react";
import { ThemeProvider, CSSReset, Flex } from "@chakra-ui/core";

import Navigation from "./Navigation";
import privateInfo from "./../private";

const firebaseConfig = {
    apiKey: privateInfo.firebase.apiKey,
    authDomain: privateInfo.firebase.authDomain,
    databaseURL: privateInfo.firebase.databaseURL,
    projectId: privateInfo.firebase.projectId,
    storageBucket: privateInfo.firebase.storageBucket,
    messagingSenderId: privateInfo.firebase.messagingSenderId,
    appId: privateInfo.firebase.appId,
    measurementId: privateInfo.firebase.measurementId,
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const MainContainer = (props) => {
    const [signed, changeAuthState] = useState(false);
    auth().onAuthStateChanged((user) => {
        if (user) {
            changeAuthState(true);
        } else {
            changeAuthState(false);
        }
    });

    return (
        <ThemeProvider>
            <Head>
                <title>{props.title ? props.title : "Simple Reddit"}</title>
            </Head>
            <CSSReset />
            <Navigation signed={signed} />
            <Flex mt="100px" w="full">
                {props.children}
            </Flex>
        </ThemeProvider>
    );
};

export default MainContainer;
