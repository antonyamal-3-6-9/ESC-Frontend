import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { API } from "../API/api";

const stripePromise = loadStripe("your_stripe_publishable_key");

const CheckoutButton = () => {
    const [amount, setAmount] = useState("");
    const userWallet = "USER_WALLET_ADDRESS"; // Replace with actual wallet address

    const handleCheckout = async () => {
        const response = await API.post("/wallet/create-checkout-session", {
            amount: amount,
            wallet: userWallet,
        });

        if (response.data.id) {
            const stripe = await stripePromise;
            stripe?.redirectToCheckout({ sessionId: response.data.id });
        } else {
            console.error("Error:", response.data.error);
        }
    };

    return (
        <div>
            <input
                type="number"
                placeholder="Enter USD amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handleCheckout}>Buy SwapCoin</button>
        </div>
    );
};

export default CheckoutButton;
