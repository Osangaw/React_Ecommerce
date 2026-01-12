import React from 'react';
import { PaystackButton } from 'react-paystack';
import { useDispatch } from 'react-redux';
import axios from 'axios';
// import { addOrder } from '../../actions/user.actions'; // Uncomment when you have this action

const PaystackPayment = ({ totalAmount, email, addressId, cartItems }) => {
    const dispatch = useDispatch();
    const publicKey = "pk_test_b3a7dc77e175495b76670834c9308dd2e559c5a9"; // YOUR PUBLIC KEY (Safe to be here)
    const amount = totalAmount * 100; // Paystack works in Kobo

    const componentProps = {
        email,
        amount,
        metadata: {
            name: "Customer Name",
            phone: "08012345678",
        },
        publicKey,
        text: "Pay Now",
        onSuccess: (reference) => {
            alert("Payment Successful! Reference: " + reference.reference);
            // Here you would call dispatch(addOrder(...))
            
            // Temporary direct call for testing
            console.log("Payment success", reference);
        },
        onClose: () => alert("Payment cancelled"),
    };

    return (
        <div style={{ width: '100%' }}>
            <PaystackButton className="paystack-button" {...componentProps} />
            <style>{`
                .paystack-button {
                    cursor: pointer;
                    text-align: center;
                    font-size: 16px;
                    letter-spacing: 0.1rem;
                    text-transform: uppercase;
                    background-color: #6A1B1A;
                    font-weight: bold;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    width: 100%;
                    padding: 15px;
                    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
                }
                .paystack-button:hover {
                    background-color: #8B2323;
                }
            `}</style>
        </div>
    );
};

export default PaystackPayment;