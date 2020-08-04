import * as sgMail from "@sendgrid/mail";

import privateInfo from "../private";

function Page({ status }) {
    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                width: "100vw",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "16px",
                letterSpacing: "1px",
                color: "rgb(50, 50, 50)",
                flexDirection: "column",
            }}
        >
            <p>
                <strong>
                    {status
                        ? status
                        : "Details are being send as Email.\nSending email..."}
                </strong>
            </p>
            <p style={{ fontSize: "12px" }}>
                If you don't recieve the mail, click again on "View Details".
            </p>
            <style jsx>
                {`
                    body,
                    html {
                        background: white;
                        font-size: 16px;
                    }
                `}
            </style>
        </div>
    );
}

export const getServerSideProps = async (context) => {
    const to = context.query.to;
    const text = context.query.text;
    const html = context.query.html;

    sgMail.setApiKey(privateInfo.sendGridMail.apiKey);

    const email = {
        to,
        from: privateInfo.sendGridMail.emailFrom,
        subject: "[Don't Reply] Post Details",
        text,
        html,
    };

    let status = "Sending email...";
    status = await sgMail.send(email);
    try {
        status = status[0].statusCode;
    } catch (err) {}

    if (status == 202) {
        status = "Details has been sent. Email sent.";
    } else {
        status = "Something went wrong. Please try again.";
    }

    return {
        props: { status: status },
    };
};

export default Page;
