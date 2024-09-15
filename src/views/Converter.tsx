import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const Converter: React.FC = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>This is the documents page content.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Welcome to the Documents page. Here you can find all your important files and documents.</p>
            </CardContent>
        </Card>
    )
}

export default Converter