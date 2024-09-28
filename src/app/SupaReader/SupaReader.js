"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import styles from "./SupaReader.module.css";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const SupaReader = () => {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from("member")
                .select("*");
            if (error) {
                console.log("Error fetching data:", error.message);
            } else {
                setUserData(data);
                console.log("Fetched data:", data);
            }
        };
        fetchData();
        }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
            <h3>Supa Reader : p format</h3>
                {userData.map((user, index) => (
                    <div key={index}>
                        <p>Name: {user.name}</p>
                        <p>Age: {user.age}</p>
                        <p>Phone: {user.phone}</p>
                    </div>
                ))}
            </div>
            <div className={styles.container}>
            <h3>Supa Reader : tb format</h3>
            <table border="1" className={styles.table}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {userData.map((user, index) => (
                        <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.age}</td>
                            <td>{user.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default SupaReader;