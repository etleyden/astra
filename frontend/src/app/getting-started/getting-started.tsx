"use client";
import {useState} from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import UploadLayout from "@/views/upload/UploadLayout";

enum GettingStartedSteps { UPLOAD, LABEL, GOALS }

export default function GettingStarted() {
    
    return (
        <ProtectedRoute>
            <div className="mt-5">
            <UploadLayout/>
            </div>
        </ProtectedRoute>
    )
}