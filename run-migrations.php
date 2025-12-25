<?php
// Safe migration runner: checks DB connection first, then runs migrations.

function parseDotEnv(string $path): array
{
    if (!file_exists($path)) {
        return [];
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $vars = [];
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        if (!str_contains($line, '=')) {
            continue;
        }
        [$name, $val] = array_map('trim', explode('=', $line, 2));
        $val = preg_replace('/(^\"|\"$|^\'|\'$)/', '', $val);
        $vars[$name] = $val;
    }
    return $vars;
}

$dotEnv = parseDotEnv(__DIR__ . '/.env');
foreach ($dotEnv as $k => $v) {
    if (getenv($k) === false) {
        putenv("$k=$v");
    }
    $_ENV[$k] = $v;
    $_SERVER[$k] = $v;
}

$dbConn = getenv('DB_CONNECTION') ?: 'mysql';

function fail(string $msg, int $code = 1): void
{
    fwrite(STDERR, $msg . PHP_EOL);
    exit($code);
}

try {
    switch (strtolower($dbConn)) {
        case 'sqlite':
            $path = getenv('DB_DATABASE') ?: (__DIR__ . '/database/database.sqlite');
            $dsn = 'sqlite:' . $path;
            $pdo = new PDO($dsn);
            break;
        case 'pgsql':
            $host = getenv('DB_HOST') ?: '127.0.0.1';
            $port = getenv('DB_PORT') ?: '5432';
            $db   = getenv('DB_DATABASE') ?: 'postgres';
            $user = getenv('DB_USERNAME') ?: 'postgres';
            $pass = getenv('DB_PASSWORD') ?: '';
            $dsn  = "pgsql:host=$host;port=$port;dbname=$db";
            $pdo  = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
            break;
        case 'mysql':
        default:
            $host = getenv('DB_HOST') ?: '127.0.0.1';
            $port = getenv('DB_PORT') ?: '3306';
            $db   = getenv('DB_DATABASE') ?: 'forge';
            $user = getenv('DB_USERNAME') ?: 'root';
            $pass = getenv('DB_PASSWORD') ?: '';
            $dsn  = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
            $pdo  = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 5]);
            break;
    }
} catch (PDOException $e) {
    fail('Database connection failed: ' . $e->getMessage());
}

echo "Database connection successful. Running migrations..." . PHP_EOL;

$cmd = 'php artisan migrate --force 2>&1';
passthru($cmd, $rv);
exit($rv);
