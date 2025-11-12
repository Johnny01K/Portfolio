<?php
// PROSTA ZAŠTITA – dozvoli samo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Method not allowed.";
    exit;
}

// UZMI PODATKE IZ FORME
$userEmail = isset($_POST['email']) ? trim($_POST['email']) : '';
$userMessage = isset($_POST['message']) ? trim($_POST['message']) : '';

// PROVERA OSNOVNIH POLJA
if ($userEmail === '' || $userMessage === '') {
    echo "Please fill in all fields.";
    exit;
}

// VALIDACIJA EMAILA
if (!filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
    echo "Invalid email address.";
    exit;
}

// TVOJ MEJL – OVDE STAVI SVOJU PRAVU ADRESU
$to      = "nikola.keki@gmail.com";
$subject = "New message from Portfolio site";
$body    = "You have a new message from your portfolio site:\n\n"
         . "From: " . $userEmail . "\n\n"
         . "Message:\n" . $userMessage . "\n";

$headers = "From: no-reply@nikolakekez-portfolio.eu.org\r\n";
$headers .= "Reply-To: " . $userEmail . "\r\n";

// POKUŠAJ SLANJE
if (mail($to, $subject, $body, $headers)) {
    // Možeš i da napraviš lepši HTML, ali za početak ovako
    echo "Your message has been sent.";
} else {
    echo "Sorry, there was a problem sending your message.";
}
