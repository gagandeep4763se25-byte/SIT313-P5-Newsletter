import { useState } from 'react';
import './Newsletter.css';

function Newsletter() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');


    async function handleSubscribe(event) {
        event.preventDefault();

        setMessage('');
        setMessageType('');

        const subscriberEmail = email.trim();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(subscriberEmail)) {
            setMessage('Please enter a valid email address.');
            setMessageType('error');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                'http://localhost:3000/api/newsletter/subscribe',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: subscriberEmail
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || 'Subscription failed.'
                );
            }

            setMessage(result.message);
            setMessageType('success');
            setEmail('');

        } catch (error) {
            console.error('Newsletter error:', error);

            setMessage(
                error.message === 'Failed to fetch'
                    ? 'Cannot connect to the server. Please try again.'
                    : error.message
            );

            setMessageType('error');

        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="newsletter-section">
            <div className="newsletter-container">
                <h2>SIGN UP FOR OUR DAILY INSIDER</h2>

                <form
                    className="newsletter-form"
                    onSubmit={handleSubscribe}
                >
                    <label htmlFor="newsletter-email">
                        Email address
                    </label>

                    <div className="newsletter-input-group">
                        <input
                            id="newsletter-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                setMessage('');
                            }}
                            maxLength={254}
                            autoComplete="email"
                            required
                            disabled={loading}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? 'Subscribing...'
                                : 'Subscribe'}
                        </button>
                    </div>

                    {message && (
                        <p
                            className={`newsletter-message ${messageType}`}
                            role="status"
                            aria-live="polite"
                        >
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </section>
    );

}

export default Newsletter;
