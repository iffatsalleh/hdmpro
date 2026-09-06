<?php
// HDMPro Reverse Proxy Bridge to Next.js Standalone (Port 3000)
$backend = 'http://127.0.0.1:3000';
$uri = $_SERVER['REQUEST_URI'];
$url = $backend . $uri;

$method = $_SERVER['REQUEST_METHOD'];
$headers = [];

$rawHeaders = function_exists('getallheaders') ? getallheaders() : [];
if (empty($rawHeaders)) {
    foreach ($_SERVER as $name => $value) {
        if (substr($name, 0, 5) == 'HTTP_') {
            $rawHeaders[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
        }
    }
}

foreach ($rawHeaders as $name => $value) {
    if (strtolower($name) === 'host') {
        $headers[] = "Host: 127.0.0.1:3000";
    } elseif (strtolower($name) !== 'content-length') {
        $headers[] = "$name: $value";
    }
}

if (isset($_SERVER['HTTP_HOST'])) {
    $headers[] = "X-Forwarded-Host: " . $_SERVER['HTTP_HOST'];
}
$isHttps = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ||
           (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
$headers[] = "X-Forwarded-Proto: " . ($isHttps ? 'https' : 'http');

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
