"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import styles from "./SupaReader.module.css";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const SupaReader = () => {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [phone, setPhone] = useState("");

    const hanleSubmit = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase.from("member").insert([
            {name:name, age:age, phone:phone},
        ])
        if(error) {
            console.log("Error inserting data:", error.message);
        } else {
            console.log("Inserted data:", data);
        }
    }

    return 
}
