import { errorReportingService } from '../services/errorReportingService';

// Known noisy errors that don't originate from our app code (e.g. browser
// extensions like wallets/password managers poking at stale DOM references).
// These are filtered out before reporting so they don't spam Slack.
const IGNORED_ERROR_PATTERNS: RegExp[] = [
    /Object Not Found Matching Id.*MethodName:update/i,
];

function shouldIgnoreError(message: string): boolean {
    return IGNORED_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

export function initializeGlobalErrorHandlers(): void {
    window.addEventListener('error', (event) => {
        const error = event.error || new Error(event.message);

        if (shouldIgnoreError(error.message)) return;

        errorReportingService.reportError(error, {
            component: 'GlobalErrorHandler',
            userAction: 'Unknown (uncaught error)',
            errorType: 'javascript',
            severity: 'high',
            additionalContext: {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                source: 'window.onerror',
                userAgent: navigator.userAgent
            }
        });
    });

    window.addEventListener('unhandledrejection', (event) => {
        const error = event.reason instanceof Error
            ? event.reason
            : new Error(String(event.reason));

        if (shouldIgnoreError(error.message)) return;

        errorReportingService.reportError(error, {
            component: 'GlobalErrorHandler',
            userAction: 'Promise rejection',
            errorType: 'javascript',
            severity: 'high',
            additionalContext: {
                reason: event.reason,
                source: 'unhandledrejection',
                promise: event.promise
            }
        });
    });

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        try {
            const response = await originalFetch(...args);

            if (!response.ok) {
                const error = new Error(`HTTP Error: ${response.status} ${response.statusText}`);
                
                errorReportingService.reportApiError(
                    {
                        response: {
                            status: response.status,
                            statusText: response.statusText,
                            url: response.url
                        },
                        message: error.message
                    },
                    {
                        method: args[1]?.method || 'GET',
                        url: typeof args[0] === 'string' ? args[0] : (args[0] as Request).url || args[0].toString(),
                        data: args[1]?.body
                    },
                    {
                        component: 'GlobalFetchHandler',
                        userAction: 'API request via fetch',
                        errorType: 'api'
                    }
                );
            }
            
            return response;
        } catch (networkError) {
            errorReportingService.reportApiError(
                networkError,
                {
                    method: args[1]?.method || 'GET',
                    url: typeof args[0] === 'string' ? args[0] : (args[0] as Request).url || args[0].toString(),
                    data: args[1]?.body
                },
                {
                    component: 'GlobalFetchHandler',
                    userAction: 'API request via fetch',
                    errorType: 'network',
                    severity: 'high'
                }
            );
            
            throw networkError;
        }
    };

    console.log('Global error handlers initialized');
}