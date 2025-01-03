import React from 'react';
import { Html, Head, Preview, Body, Container, Heading, Text, Button } from '@react-email/components';

export const VerificationMail = ({ username, otp }: { username: string; otp: string }) => {
    return (
        <Html>
            <Head />
            <Preview>Verify your email address</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={heading}>Email Verification</Heading>
                    <Text style={paragraph}>Hello {username},</Text>
                    <Text style={paragraph}>Your OTP for email verification is:</Text>
                    <Text style={otpStyle}>{otp}</Text>
                    <Text style={paragraph}>Please enter this OTP in the app to verify your email address.</Text>
                    <Text style={paragraph}>If you did not request this, please ignore this email.</Text>
                </Container>
            </Body>
        </Html>
    );
};

const main = {
    backgroundColor: '#f6f9fc',
    padding: '20px',
};

const container = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
};

const heading = {
    fontSize: '24px',
    marginBottom: '20px',
};

const paragraph = {
    fontSize: '16px',
    marginBottom: '20px',
};

const otpStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
};

export default VerificationMail;
