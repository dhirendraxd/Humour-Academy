import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { FadeIn } from '@/components/FadeIn';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <PageLayout showFooter={false}>
                    <div className="min-h-[80vh] flex items-center justify-center px-6">
                        <FadeIn>
                            <div className="text-center space-y-8 max-w-2xl mx-auto">
                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                                            <AlertTriangle className="w-12 h-12 text-red-600" />
                                        </div>
                                    </div>
                                    <h1 className="text-4xl font-bold text-foreground">Something Went Wrong</h1>
                                    <p className="text-xl text-muted-foreground max-w-md mx-auto">
                                        We encountered an unexpected error. Don't worry, our team has been notified.
                                    </p>
                                    {process.env.NODE_ENV === 'development' && this.state.error && (
                                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                                            <p className="font-mono text-sm text-red-800 break-all">
                                                {this.state.error.toString()}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                    <Button
                                        onClick={this.handleReload}
                                        variant="secondary"
                                        className="rounded-full px-8 h-12 text-sm font-medium"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Reload Page
                                    </Button>
                                    <Button
                                        onClick={this.handleReset}
                                        className="rounded-full px-8 h-12 text-sm font-medium bg-foreground text-background hover:bg-foreground/90"
                                    >
                                        <Home className="w-4 h-4 mr-2" />
                                        Go Home
                                    </Button>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </PageLayout>
            );
        }

        return this.props.children;
    }
}
