import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const NotFound: React.FC = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Not Found</CardTitle>
                <CardDescription>This is the documents page content.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Welcome to the Documents page. Here you can find all your important files and documents.</p>
            </CardContent>
        </Card>
    )
}

export default NotFound