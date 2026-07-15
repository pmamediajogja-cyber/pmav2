<?php
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SCRIPT PENANGAN KONTAK FORMULIR - PHP (PRODUCTION READY)
 * Portofolio Imam Falahi - IT Operations & Legal Compliance Specialist
 * 
 * Cara Penggunaan:
 * 1. Letakkan file ini pada root direktori hosting Apache / PHP Anda.
 * 2. Ubah konfigurasi email penerima di bawah jika diperlukan.
 * 3. Kirimkan POST request AJAX/Fetch dari form kontak Anda ke file ini.
 */

// Mengaktifkan CORS (Cross-Origin Resource Sharing) untuk kemudahan pengujian jika dihosting terpisah
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// Memastikan method request adalah POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Metode pengiriman tidak diizinkan! Wajib menggunakan POST."
    ]);
    exit;
}

// Membaca JSON payload input dari client
$inputData = json_decode(file_get_contents("php://input"), true);

// Jika input bukan JSON, baca dari standard POST form variables
if (empty($inputData)) {
    $inputData = $_POST;
}

// Mengambil dan mensanitasi data input untuk mencegah serangan injeksi atau XSS
$name = isset($inputData["name"]) ? strip_tags(trim($inputData["name"])) : "";
$email = isset($inputData["email"]) ? filter_var(trim($inputData["email"]), FILTER_SANITIZE_EMAIL) : "";
$subject = isset($inputData["subject"]) ? strip_tags(trim($inputData["subject"])) : "";
$message = isset($inputData["message"]) ? strip_tags(trim($inputData["message"])) : "";

// Validasi backend agar pesan tidak kosong (sejalan dengan validasi JS frontend)
if (empty($name) || empty($email) || empty($subject) || empty("message")) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Gagal mengirim! Semua kolom formulir (Nama, Email, Subjek, Pesan) wajib diisi."
    ]);
    exit;
}

// Validasi format email secara presisi di sisi server
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Gagal mengirim! Alamat email pengirim tidak valid."
    ]);
    exit;
}

// --- KONFIGURASI PENERIMA EMAIL ---
$recipient_email = "mobho@ymail.com"; // Email utama Imam Falahi
$cc_email = "pma.media.jogja@gmail.com";  // CC alternatif

// Merancang konten email dengan layout yang rapi
$email_title = "[PORTOFOLIO SEC_OPS] Kontak Baru: " . $subject;
$email_content = "
<html>
<head>
    <title>Pesan Kontak Portofolio</title>
</head>
<body style='font-family: sans-serif; background-color: #07070d; color: #e2e8f0; padding: 20px;'>
    <div style='max-width: 600px; margin: 0 auto; background-color: #0e0e1a; border: 1px solid #00f0ff; padding: 20px; border-radius: 8px;'>
        <h2 style='color: #00f0ff; border-bottom: 2px solid #ff007f; padding-bottom: 10px; text-transform: uppercase;'>Notifikasi Kontak Portofolio</h2>
        <p><strong>Nama Pengirim:</strong> {$name}</p>
        <p><strong>Email Pengirim:</strong> <a href='mailto:{$email}' style='color: #00f0ff;'>{$email}</a></p>
        <p><strong>Subjek Pesan:</strong> {$subject}</p>
        <div style='background-color: #07070d; padding: 15px; border-radius: 4px; margin-top: 15px; border-left: 3px solid #39ff14;'>
            <p style='margin: 0; line-height: 1.6;'><strong>Isi Pesan:</strong><br><br>" . nl2br($message) . "</p>
        </div>
        <p style='font-size: 10px; color: #555; margin-top: 25px; border-t: 1px solid #222; padding-top: 10px; font-family: monospace;'>
            SEC_OPS_SYSTEM ALERT | Sent from Portfolio Parallax Cyber Engine | IP: " . $_SERVER["REMOTE_ADDR"] . "
        </p>
    </div>
</body>
</html>
";

// Merancang header email pendukung agar terkirim dalam format HTML
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Secure Portfolio Contact <no-reply@" . $_SERVER["SERVER_NAME"] . ">" . "\r\n";
$headers .= "Reply-To: {$name} <{$email}>" . "\r\n";
$headers .= "Cc: {$cc_email}" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Mengirimkan email menggunakan fungsi built-in mail() milik PHP
$mail_sent = mail($recipient_email, $email_title, $email_content, $headers);

if ($mail_sent) {
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Pesan Anda berhasil dikirim secara aman ke email Imam Falahi (mobho@ymail.com)!"
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server gagal memproses pengiriman email. Periksa modul PHP mail() di server hosting Anda."
    ]);
}
?>
