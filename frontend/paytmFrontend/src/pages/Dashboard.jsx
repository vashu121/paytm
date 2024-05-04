import { Appbar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { useEffect, useState } from "react";
import axios from "axios";

export const Dashboard = () => {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    console.error('Authentication token not found in local storage');
                    return;
                }

                const response = await axios.get('https://paytm-4.onrender.com/api/v1/account/balance',{
                    headers:{
                        Authorization: `Bearer ${token}`,
                    }
                });
                const data=response.data.balance
                setBalance(data.toFixed(2));
                
            } catch (error) {
                console.error('Error balance:', error);
            }
        };
        fetchBalance();
    }, []);

    return (
        <div>
            <Appbar />
            <div className="m-8">
                <Balance value={balance} />
                <Users />
            </div>
        </div>
    );
};
