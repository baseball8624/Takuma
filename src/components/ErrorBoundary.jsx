import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', color: 'white', background: '#330000', borderRadius: '8px', border: '1px solid #ff0000' }}>
                    <h2>何かがおかしいようです (Error)</h2>
                    <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '20px', padding: '10px', background: 'white', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        ページをリロード
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
