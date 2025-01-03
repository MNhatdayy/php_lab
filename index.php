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
require_once 'app/controllers/CartApiController.php';
require_once 'app/controllers/PaymentApiController.php';
require_once 'app/helpers/Router.php';

// Khởi tạo router
$router = new Router();

//users
$router->add('GET', '/api/users', 'UserApiController@index');
$router->add('GET', '/api/users/{id}', 'UserApiController@getById');
$router->add('POST', '/api/users', 'UserApiController@create');
$router->add('PUT', '/api/users/{id}', 'UserApiController@update');
$router->add('DELETE', '/api/users/{id}', 'UserApiController@delete');

//products
$router->add('GET', '/api/products', 'ProductApiController@index');
$router->add('GET', '/api/products/{id}', 'ProductApiController@getById');
$router->add('POST', '/api/products', 'ProductApiController@create');
$router->add('PUT', '/api/products/{id}', 'ProductApiController@update');
$router->add('DELETE', '/api/products/{id}', 'ProductApiController@delete');

//categories
$router->add('GET', '/api/categories', 'CategoryApiController@index');
$router->add('GET', '/api/categories/{id}', 'CategoryApiController@getById');
$router->add('POST', '/api/categories', 'CategoryApiController@create');
$router->add('PUT', '/api/categories/{id}', 'CategoryApiController@update');
$router->add('DELETE', '/api/categories/{id}', 'CategoryApiController@delete');

//auth
$router->add('POST', '/api/auth/register', 'AuthApiController@register');
$router->add('POST', '/api/auth/login', 'AuthApiController@login');

//order
$router->add('GET', '/api/orders', 'OrderApiController@index');
$router->add('GET', '/api/orders/{id}', 'ProductApiController@getById');
$router->add('POST', '/api/orders', 'OrderApiController@create');
$router->add('PUT', '/api/orders/{id}', 'OrderApiController@update');
$router->add('DELETE', '/api/orders/{id}', 'OrderApiController@delete');

//order detail
$router->add('GET', 'api/detail/{id}', 'OrderDetailApiController@getOrderDetailsByOrderId');

//cart
$router->add('GET', '/api/cart?user={username}', 'CartApiController@getCartItemsByUsername');
$router->add('POST', '/api/cart', 'CartApiController@create');
$router->add('PUT', '/api/cart/{id}', 'CartApiController@update');
$router->add('DELETE', '/api/cart/{id}', 'CartApiController@delete');

//payment
$router->add('GET', '/api/payments/all', 'PaymentApiController@index');

// Lấy URL từ GET
$url = $_GET['url'] ?? '';
$url = rtrim($url, '/');
$url = filter_var($url, FILTER_SANITIZE_URL);

// Lấy phương thức HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Gọi dispatch để xử lý route
$router->dispatch($method, $url);
