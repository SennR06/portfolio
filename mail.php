<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html#form');
    exit;
}

$firstName = isset($_POST['first-name']) ? trim($_POST['first-name']) : '';
$lastName  = isset($_POST['last-name'])  ? trim($_POST['last-name'])  : '';
$email     = isset($_POST['email'])      ? trim($_POST['email'])      : '';
$company   = isset($_POST['company'])    ? trim($_POST['company'])    : '';
$message   = isset($_POST['message'])    ? trim($_POST['message'])    : '';

$errors = [];

if ($firstName === '') {
    $errors[] = 'First name is required.';
}

if ($lastName === '') {
    $errors[] = 'Last name is required.';
}

if ($email === '') {
    $errors[] = 'E-mail is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'E-mail is not valid.';
}

if ($message === '') {
    $errors[] = 'Message is required.';
}

if (!empty($errors)) {
    echo '<h2>Something went wrong:</h2>';
    echo '<ul>';
    foreach ($errors as $error) {
        echo '<li>' . htmlspecialchars($error, ENT_QUOTES, 'UTF-8') . '</li>';
    }
    echo '</ul>';
    echo '<p><a href="index.html#form">Go back to the form</a></p>';
    exit;
}

$to      = 'reinderssenn@gmail.com';
$subject = 'New message via the contact form';

$companyText = $company !== '' ? $company : 'Not specified';

$body  = "You have received a new message via the contact form:\n\n";
$body .= "First name: {$firstName}\n";
$body .= "Last name: {$lastName}\n";
$body .= "E-mail: {$email}\n";
$body .= "Company: {$companyText}\n\n";
$body .= "Message:\n{$message}\n";

$headers   = [];
$headers[] = 'From: ' . $firstName . ' ' . $lastName . ' <' . $email . '>';
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'X-Mailer: PHP/' . phpversion();

$success = mail($to, $subject, $body, implode("\r\n", $headers));

if ($success) {
    echo '<h2>Building plan created</h2>';
    echo '<p>Thank you for contacting me. I’ll get back to you as soon as possible.</p>';
} else {
    echo '<h2>An error occurred while sending your message.</h2>';
    echo '<p>Please try again later or send an email to: ' . htmlspecialchars($to, ENT_QUOTES, 'UTF-8') . '</p>';
}