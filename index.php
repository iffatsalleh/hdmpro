<?php
// HDMPro Reverse Proxy Bridge to Next.js Standalone (Port 3000)
$backend = 'http://127.0.0.1:3000';
$uri = $_SERVER['REQUEST_URI'];
$url = $backend . $uri;

$method = $_SERVER['REQUEST_METHOD'];

// Tentukan host tunggal yang tepat (elak duplicate header yang menyebabkan "Invalid URL" dalam NextAuth)
$realHost = !empty($_SERVER['HTTP_X_FORWARDED_HOST']) ? $_SERVER['HTTP_X_FORWARDED_HOST'] : (!empty($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost');
if (strpos($realHost, ',') !== false) {
    $parts = explode(',', $realHost);
    $realHost = trim($parts[0]);
}

// Tentukan protokol tunggal
$proto = 'http';
if (
    (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
    (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && stripos($_SERVER['HTTP_X_FORWARDED_PROTO'], 'https') !== false) ||
    (!empty($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443)
) {
    $proto = 'https';
}

$rawHeaders = function_exists('getallheaders') ? getallheaders() : [];
if (empty($rawHeaders)) {
    foreach ($_SERVER as $name => $value) {
        if (substr($name, 0, 5) == 'HTTP_') {
            $rawHeaders[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
        }
    }
}

// Tapis keluar header yang berpotensi berganda
$skipHeaders = ['host', 'content-length', 'x-forwarded-host', 'x-forwarded-proto', 'x-forwarded-port'];
$headers = [];

foreach ($rawHeaders as $name => $value) {
    if (!in_array(strtolower($name), $skipHeaders)) {
        $headers[] = "$name: $value";
    }
}

// Suntik header tunggal yang bersih ke Next.js
$headers[] = "Host: " . $realHost;
$headers[] = "X-Forwarded-Host: " . $realHost;
$headers[] = "X-Forwarded-Proto: " . $proto;
$headers[] = "X-Forwarded-Port: " . ($proto === 'https' ? '443' : '80');

if (isset($_SERVER['CONTENT_TYPE'])) {
    $headers[] = "Content-Type: " . $_SERVER['CONTENT_TYPE'];
}

$body = file_get_contents('php://input');

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
if (!empty($body)) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);

$response = curl_exec($ch);

if ($response === false) {
    http_response_code(502);
    echo "Bad Gateway: Perkhidmatan HDMPro di port 3000 belum sedia. Sila pastikan PM2 sedang berjalan (npx pm2 restart all).";
    exit;
}

$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$header_text = substr($response, 0, $header_size);
$body_text = substr($response, $header_size);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

http_response_code($http_code);

foreach (explode("\r\n", $header_text) as $header) {
    if (!empty($header) && !strncasecmp($header, 'Transfer-Encoding:', 18)) {
        continue;
    }
    if (!empty($header) && !strncasecmp($header, 'HTTP/', 5)) {
        continue;
    }
    if (!empty($header)) {
        header($header, false);
    }
}

echo $body_text;
