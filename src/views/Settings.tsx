import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const Settings: React.FC = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>This is the settings page content.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Welcome to the Settings page. Here you can adjust your preferences and account settings.</p>
            </CardContent>
        </Card>
    )
}

export default Settings