<?php
session_start();

header("Access-Control-Allow-Origin: *"); // Cho phép tất cả các domain, có thể thay bằng một domain cụ thể
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Các phương thức HTTP được phép
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With"); // Các header được phép

// Nếu là phương thức OPTIONS (pre-flight), trả về 200 OK
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'app/models/ProductModel.php';
require_once 'app/helpers/SessionHelper.php';
require_once 'app/controllers/ProductApiController.php';
require_once 'app/controllers/CategoryApiController.php';
require_once 'app/controllers/AuthApiController.php';
require_once 'app/helpers/Router.php';

// Khởi tạo router
$router = new Router();

// Định nghĩa các route

$router->add('GET', '/api/users', 'UserApiController@index');
$router->add('GET', '/api/users/{id}', 'UserApiController@getById');
$router->add('POST', '/api/users', 'UserApiController@create');
$router->add('PUT', '/api/users/{id}', 'UserApiController@update');
$router->add('DELETE', '/api/users/{id}', 'UserApiController@delete');

$router->add('GET', '/api/products', 'ProductApiController@index');
$router->add('GET', '/api/products/{id}', 'ProductApiController@getById');
$router->add('POST', '/api/products', 'ProductApiController@create');
$router->add('PUT', '/api/products/{id}', 'ProductApiController@update');
$router->add('DELETE', '/api/products/{id}', 'ProductApiController@delete');


$router->add('GET', '/api/categories', 'CategoryApiController@index');
$router->add('GET', '/api/categories/{id}', 'CategoryApiController@getById');
$router->add('POST', '/api/categories', 'CategoryApiController@create');
$router->add('PUT', '/api/categories/{id}', 'CategoryApiController@update');
$router->add('DELETE', '/api/categories/{id}', 'CategoryApiController@delete');


$router->add('POST', '/api/auth/register', 'AuthApiController@register');
$router->add('POST', '/api/auth/login', 'AuthApiController@login');

// Lấy URL từ GET
$url = $_GET['url'] ?? '';
$url = rtrim($url, '/');
$url = filter_var($url, FILTER_SANITIZE_URL);

// Lấy phương thức HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Gọi dispatch để xử lý route
$router->dispatch($method, $url);
