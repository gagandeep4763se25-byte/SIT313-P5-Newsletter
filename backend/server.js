import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// EmailJS configuration
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

// Allow requests from the React development server
app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'http://127.0.0.1:5173'
        ]
    })
);

app.use(express.json({ limit: '10kb' }));

// Limit repeated subscription requests
const newsletterLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        message: 'Too many subscription attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Check that the backend is running
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'DEV@Deakin Newsletter backend is running.'
    });
});

// Subscribe to the newsletter
app.post(
    '/api/newsletter/subscribe',
    newsletterLimiter,
    async (req, res) => {
        try {
            const { email } = req.body;

            // Validate email
            if (typeof email !== 'string') {
                return res.status(400).json({
                    message: 'Please enter a valid email address.'
                });
            }

            const subscriberEmail = email.trim();

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                subscriberEmail.length > 254 ||
                !emailPattern.test(subscriberEmail)
            ) {
                return res.status(400).json({
                    message: 'Please enter a valid email address.'
                });
            }

            // Check EmailJS configuration
            if (
                !EMAILJS_SERVICE_ID ||
                !EMAILJS_TEMPLATE_ID ||
                !EMAILJS_PUBLIC_KEY ||
                !EMAILJS_PRIVATE_KEY
            ) {
                console.error(
                    'EmailJS configuration is incomplete. Check backend/.env.'
                );

                return res.status(500).json({
                    message: 'Newsletter service is not configured correctly.'
                });
            }

            // Send subscription email through EmailJS
            const emailResponse = await fetch(
                'https://api.emailjs.com/api/v1.0/email/send',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        service_id: EMAILJS_SERVICE_ID,
                        template_id: EMAILJS_TEMPLATE_ID,
                        user_id: EMAILJS_PUBLIC_KEY,
                        accessToken: EMAILJS_PRIVATE_KEY,
                        template_params: {
                            to_email: subscriberEmail,
                            subscriber_email: subscriberEmail
                        }
                    }),
                    signal: AbortSignal.timeout(15000)
                }
            );

            const responseText = await emailResponse.text();

            console.log(
                'EmailJS HTTP Status:',
                emailResponse.status
            );

            if (!emailResponse.ok) {
                console.error(
                    'EmailJS error:',
                    responseText.slice(0, 500)
                );

                return res.status(502).json({
                    message:
                        'Email could not be sent. Please check your EmailJS settings and try again.'
                });
            }

            console.log('Newsletter email accepted by EmailJS.');

            return res.status(200).json({
                message:
                    'Thank you for subscribing to our newsletter!'
            });

        } catch (error) {
            console.error(
                'Newsletter error:',
                error.message
            );

            if (error.name === 'TimeoutError') {
                return res.status(504).json({
                    message:
                        'The email service took too long to respond. Please try again.'
                });
            }

            return res.status(500).json({
                message:
                    'An unexpected error occurred. Please try again.'
            });
        }
    }
);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found.'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(
        `Newsletter backend running on http://localhost:${PORT}`
    );
});

