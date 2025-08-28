import {useEffect, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useAppContext} from "@/context/AppContext.jsx";

const OauthCallback = () => {
    const navigate = useNavigate();
    const {provider} = useParams
}