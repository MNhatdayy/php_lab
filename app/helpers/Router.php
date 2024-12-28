<?php
class Router
{
    private $routes = [];

    public function add($method, $path, $controllerAction)
    {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'controllerAction' => $controllerAction
        ];
    }

    public function dispatch($method, $url)
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

        // Nếu là phương thức OPTIONS, trả về 200 OK
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            exit;
        }


        foreach ($this->routes as $route) {
            if ($route['method'] === $method && $this->matchPath($route['path'], $url)) {
                return $this->executeAction($route['controllerAction'], $url);
            }
        }
        http_response_code(404);
        echo json_encode(['message' => 'Route not found']);
        exit;
    }

    private function matchPath($routePath, $url)
    {
        // Tách các phần của route và url
        $routeParts = explode('/', trim($routePath, '/'));
        $urlParts = explode('/', trim($url, '/'));

        // Nếu số phần không khớp, return false
        if (count($routeParts) !== count($urlParts)) {
            return false;
        }

        // So sánh từng phần của route và url
        foreach ($routeParts as $index => $routePart) {
            // Kiểm tra nếu routePart là tham số động
            if (preg_match('/{(\w+)}/', $routePart, $matches)) {
                // Nếu là tham số động, bỏ qua so sánh
                continue;
            }

            // Nếu không phải tham số động, kiểm tra nếu phần của URL phải khớp
            if ($routePart !== $urlParts[$index]) {
                return false;
            }
        }

        return true;
    }


    private function executeAction($controllerAction, $url)
    {
        list($controllerName, $action) = explode('@', $controllerAction);

        $controllerFile = 'app/controllers/' . $controllerName . '.php';
        if (file_exists($controllerFile)) {
            require_once $controllerFile;
            $controller = new $controllerName();

            // Tách URL thành các phần
            $urlParts = explode('/', $url);

            // Lấy các tham số động từ URL (bỏ qua phần controller và action)
            $params = array_slice($urlParts, 2);

            // Kiểm tra nếu action tồn tại trong controller
            if (method_exists($controller, $action)) {
                // Gọi method và truyền tham số động
                call_user_func_array([$controller, $action], $params);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Action not found']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Controller not found']);
        }
        exit;
    }
}
