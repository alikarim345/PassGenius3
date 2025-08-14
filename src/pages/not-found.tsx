import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-600">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/">
            <Button className="w-full bg-primary-600 hover:bg-primary-700">
              <Home className="w-4 h-4 mr-2" />
              Go Back Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}