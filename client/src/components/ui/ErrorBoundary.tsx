import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./Button";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Hook external logger here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-byahero-light p-6 text-center">
          <h1 className="text-xl font-bold text-byahero-navy">Something went wrong</h1>
          <p className="text-sm text-byahero-muted">Please retry. If issue persists, refresh the app.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
