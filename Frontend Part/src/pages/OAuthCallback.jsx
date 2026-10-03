import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/axios";

function OAuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    const exchangeStarted = useRef(false);

    useEffect(() => {
        if (exchangeStarted.current) return;

        exchangeStarted.current = true;

        const exchangeCode = async () => {
            const code = searchParams.get("code");

            if (!code) {
                console.error("OAuth code is missing");
                return;
            }

            console.log("OAuth code exists:", !!code);

            try {
                const response = await api.post("/users/google/exchange", {
                    code
                });

                console.log("Google exchange successful:", response.data);

                login({
                  data: response.data.data
            });
                console.log("User after Google login:", response.data.data.user);

                navigate("/");
            } catch (error) {
                console.error("Google OAuth exchange failed:", error);
            }
        };

        exchangeCode();
    }, [searchParams, login, navigate]);

    return (
        <div>
            Signing you in...
        </div>
    );
}

export default OAuthCallback;