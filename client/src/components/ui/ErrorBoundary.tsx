import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./Button";

type Props = {
  children: ReactNode;
  resetKey?: string;
  compact?: boolean;
};
type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: undefined };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error);
    this.setState({ message: error?.message || "Unknown runtime error" });
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.resetKey && prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, message: undefined });
    }
  }

  render() {
    if (this.state.hasError) {
      const content = (
        <>
          <h1 className="text-xl font-bold text-byahero-navy">Something went wrong</h1>
          <p className="text-sm text-byahero-muted">Please retry. If issue persists, refresh the app.</p>
          {this.state.message ? (
            <p className="max-w-xl break-words rounded-xl bg-black/5 px-4 py-3 font-mono text-xs text-byahero-navy/80">
              {this.state.message}
            </p>
          ) : null}
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </>
      );

      if (this.props.compact) {
        return (
          <div className="glass-card flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-[2rem] p-6 text-center">
            {content}
          </div>
        );
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-byahero-light p-6 text-center">
          {content}
        </div>
      );
    }

    return this.props.children;
  }
}
