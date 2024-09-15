import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const HomePage: React.FC = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Wellcome</CardTitle>
                <CardDescription>This is the documents page content.</CardDescription>
            </CardHeader>
            <CardContent>
                <p></p>
            </CardContent>
        </Card>
    )
}

export default HomePage